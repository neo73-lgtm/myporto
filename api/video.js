import { instagramGetUrl } from 'instagram-url-direct';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  try {
    if (url.includes('tiktok.com')) {
      return await handleTikTok(url, res);
    }

    if (url.includes('instagram.com')) {
      return await handleInstagram(url, res);
    }

    return res.status(400).json({ error: 'Unsupported URL' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ── TikTok ──────────────────────────────────────────────────
async function handleTikTok(url, res) {
  // Primary: tikwm.com API
  try {
    const api = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      }
    ).then((r) => r.json());

    if (api.code === 0 && api.data) {
      const videoUrl = api.data.play || api.data.wmplay || null;
      if (videoUrl) {
        const finalUrl = videoUrl.startsWith('http')
          ? videoUrl
          : `https://www.tikwm.com${videoUrl}`;
        return res.json({ videoUrl: finalUrl, title: api.data.title || null });
      }
    }
  } catch {}

  // Fallback: scrape TikTok page langsung
  try {
    const page = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }).then((r) => r.text());

    const videoUrl = extractTikTokVideo(page);
    if (videoUrl) return res.json({ videoUrl, title: extractTitle(page) });
  } catch {}

  return res.status(404).json({ error: 'Video not found' });
}

// ── Instagram ────────────────────────────────────────────────
async function handleInstagram(url, res) {
  // Primary: instagram-url-direct package (GraphQL API via CSRF token)
  try {
    const data = await instagramGetUrl(url, { retries: 2, delay: 1000 });
    const videos = data.url_list.filter(
      (u, i) => data.media_details[i]?.type === 'video'
    );
    if (videos.length > 0) {
      return res.json({ videoUrl: videos[0], title: data.post_info?.caption || null });
    }
  } catch {}

  // Fallback 1: __a=1 endpoint (sometimes works)
  try {
    const shortcode = url.match(/(?:p|reel|reels|tv)\/([\w-]+)/);
    if (shortcode) {
      const json = await fetch(
        `https://www.instagram.com/p/${shortcode[1]}/?__a=1&__d=1`,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            Accept: 'application/json',
          },
        }
      ).then((r) => r.json());

      const items = json?.items?.[0] || json?.graphql?.shortcode_media;
      if (items?.video_url) return res.json({ videoUrl: items.video_url, title: null });
      if (items?.video_versions?.[0]?.url)
        return res.json({ videoUrl: items.video_versions[0].url, title: null });
    }
  } catch {}

  // Fallback 2: scrape page untuk JSON-LD / video_url
  try {
    const page = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }).then((r) => r.text());

    const patterns = [
      /"video_url"\s*:\s*"([^"]+)"/,
      /"contentUrl"\s*:\s*"([^"]+)"/,
      /"url"\s*:\s*"([^"]+\.mp4[^"]*)"/,
    ];
    for (const p of patterns) {
      const m = page.match(p);
      if (m) {
        const vu = m[1].replace(/\\u002F/g, '/').replace(/\\/g, '');
        if (vu) return res.json({ videoUrl: vu, title: null });
      }
    }
  } catch {}

  return res.status(404).json({ error: 'Video not found' });
}

// ── TikTok extraction helpers ───────────────────────────────
function extractTikTokVideo(html) {
  const seen = new Set();

  const cdnRegex =
    /https?:\\?\/\\?\/[^"']*?tiktokcdn[^"']*?\.(?:mp4|webm)[^"']*/gi;
  const cdnMatches = html.matchAll(cdnRegex);
  for (const m of cdnMatches) {
    const clean = m[0]
      .replace(/\\u002F/g, '/')
      .replace(/\\\//g, '/')
      .replace(/\\/g, '');
    if (!seen.has(clean) && (clean.includes('.mp4') || clean.includes('video'))) {
      seen.add(clean);
      return clean;
    }
  }

  const scriptRegex = /<script[^>]*>(.*?)<\/script>/gs;
  const scriptMatches = html.matchAll(scriptRegex);

  for (const sm of scriptMatches) {
    try {
      const text = sm[1].trim();
      if (!text.startsWith('{') && !text.startsWith('[') && !text.startsWith('window.__'))
        continue;

      let json = text;
      const varMatch = text.match(/window\.__\w+__\s*=\s*({.*?});?\s*$/);
      if (varMatch) json = varMatch[1];

      const data = JSON.parse(json);
      const walk = (obj, depth = 0) => {
        if (!obj || depth > 10) return null;
        if (typeof obj !== 'object') return null;

        for (const key of [
          'playAddr',
          'downloadAddr',
          'playUrl',
          'videoUrl',
          'contentUrl',
        ]) {
          const val = obj[key];
          if (typeof val === 'string' && val.includes('tiktokcdn') && !seen.has(val)) {
            const clean = val.replace(/\\u002F/g, '/').replace(/\\\//g, '/');
            seen.add(clean);
            return clean;
          }
        }

        for (const val of Object.values(obj)) {
          const result = walk(val, depth + 1);
          if (result) return result;
        }
        return null;
      };

      const result = walk(data);
      if (result) return result;
    } catch {}
  }

  const fallbackPatterns = [
    /"playAddr"\s*:\s*"(https?:\\?\/\\?\/[^"]+)"/,
    /"downloadAddr"\s*:\s*"(https?:\\?\/\\?\/[^"]+)"/,
  ];

  for (const p of fallbackPatterns) {
    const m = html.match(p);
    if (m) {
      const clean = m[1]
        .replace(/\\u002F/g, '/')
        .replace(/\\\//g, '/')
        .replace(/\\/g, '');
      if (!seen.has(clean)) {
        seen.add(clean);
        return clean;
      }
    }
  }

  return null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/);
  if (m) return m[1].replace(' - TikTok', '').trim();
  return null;
}
