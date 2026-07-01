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
  try {
    const api = await fetch(
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      }
    ).then((r) => r.json());

    if (api.code === 0 && api.data) {
      const videoUrl = api.data.play || api.data.wmplay;
      if (videoUrl) {
        const finalUrl = videoUrl.startsWith('http') ? videoUrl : `https://www.tikwm.com${videoUrl}`;
        return res.json({ videoUrl: finalUrl, title: api.data.title || null });
      }
    }
  } catch {}

  try {
    const page = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html',
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
  // 1. instagram-url-direct (GraphQL API)
  try {
    const data = await instagramGetUrl(url, { retries: 1, delay: 500 });
    const videos = data.url_list.filter((u, i) => data.media_details[i]?.type === 'video');
    if (videos.length > 0) {
      return res.json({ videoUrl: videos[0], title: data.post_info?.caption || null });
    }
  } catch {}

  // 2. ?__a=1 JSON endpoint
  try {
    const shortcode = extractInstagramShortcode(url);
    if (shortcode) {
      const json = await fetch(`https://www.instagram.com/p/${shortcode}/?__a=1&__d=1`, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/json',
        },
      }).then((r) => r.json());

      const walk = (obj, depth = 0) => {
        if (!obj || typeof obj !== 'object' || depth > 5) return null;
        if (obj.video_url && typeof obj.video_url === 'string') return obj.video_url;
        if (obj.video_versions?.[0]?.url) return obj.video_versions[0].url;
        for (const v of Object.values(obj)) {
          const r = walk(v, depth + 1);
          if (r) return r;
        }
        return null;
      };

      const vu = walk(json);
      if (vu) return res.json({ videoUrl: vu, title: null });
    }
  } catch {}

  // 3. scrape page — cari video_url di JSON apapun
  try {
    const page = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
        if (vu && vu.includes('fbcdn') || vu.includes('cdninstagram')) {
          return res.json({ videoUrl: vu, title: null });
        }
      }
    }

    // Cari di <script type="application/ld+json">
    const ldMatch = page.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    if (ldMatch) {
      try {
        const ld = JSON.parse(ldMatch[1]);
        const vu = ld?.contentUrl || ld?.video?.[0]?.contentUrl;
        if (vu) return res.json({ videoUrl: vu, title: ld.caption || ld.description || null });
      } catch {}
    }
  } catch {}

  return res.status(404).json({ error: 'Video not found' });
}

function extractInstagramShortcode(url) {
  const m = url.match(/(?:p|reel|reels|tv)\/([\w-]+)/);
  return m ? m[1] : null;
}

// ── TikTok extraction helpers ───────────────────────────────
function extractTikTokVideo(html) {
  const seen = new Set();

  const cdnRegex = /https?:\\?\/\\?\/[^"']*?tiktokcdn[^"']*?\.(?:mp4|webm)[^"']*/gi;
  for (const m of html.matchAll(cdnRegex)) {
    const clean = m[0].replace(/\\u002F/g, '/').replace(/\\\//g, '/').replace(/\\/g, '');
    if (!seen.has(clean) && (clean.includes('.mp4') || clean.includes('video'))) {
      seen.add(clean);
      return clean;
    }
  }

  const scriptRegex = /<script[^>]*>(.*?)<\/script>/gs;
  for (const sm of html.matchAll(scriptRegex)) {
    try {
      const text = sm[1].trim();
      if (!text.startsWith('{') && !text.startsWith('[') && !text.startsWith('window.__')) continue;
      let json = text;
      const vm = text.match(/window\.__\w+__\s*=\s*({.*?});?\s*$/);
      if (vm) json = vm[1];
      const data = JSON.parse(json);
      const walk = (obj, depth = 0) => {
        if (!obj || typeof obj !== 'object' || depth > 10) return null;
        for (const k of ['playAddr', 'downloadAddr', 'playUrl', 'videoUrl', 'contentUrl']) {
          if (typeof obj[k] === 'string' && obj[k].includes('tiktokcdn') && !seen.has(obj[k])) {
            const c = obj[k].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
            seen.add(c);
            return c;
          }
        }
        for (const v of Object.values(obj)) {
          const r = walk(v, depth + 1);
          if (r) return r;
        }
        return null;
      };
      const r = walk(data);
      if (r) return r;
    } catch {}
  }

  for (const p of [/"(playAddr|downloadAddr)"\s*:\s*"(https?:\\?\/\\?\/[^"]+)"/]) {
    const m = html.match(p);
    if (m) {
      const c = m[2].replace(/\\u002F/g, '/').replace(/\\\//g, '/').replace(/\\/g, '');
      if (!seen.has(c)) return c;
    }
  }
  return null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/);
  if (m) return m[1].replace(' - TikTok', '').trim();
  return null;
}
