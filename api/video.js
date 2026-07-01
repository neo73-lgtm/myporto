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
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'application/json',
        },
      }
    ).then((r) => r.json());

    if (api.code === 0 && api.data) {
      const videoUrl = api.data.play || api.data.wmplay;
      if (videoUrl) {
        const finalUrl = videoUrl.startsWith('http')
          ? videoUrl
          : `https://www.tikwm.com${videoUrl}`;
        return res.json({ videoUrl: finalUrl, title: api.data.title || null });
      }
    }
  } catch {}

  try {
    const page = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html',
      },
    }).then((r) => r.text());

    const videoUrl = extractTikTokVideo(page);
    if (videoUrl) return res.json({ videoUrl, title: extractTitle(page) });
  } catch {}

  return res.status(404).json({ error: 'Video not found' });
}

// ── Instagram ────────────────────────────────────────────────
async function handleInstagram(url, res) {
  // Coba scrape page — cari og:video atau video_url di HTML
  try {
    const page = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'text/html',
      },
    }).then((r) => r.text());

    // og:video
    const og = page.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/);
    if (og && og[1].includes('.mp4')) return res.json({ videoUrl: og[1], title: null });

    // JSON-LD
    const ld = page.match(
      /<script type="application\/ld\+json">(.*?)<\/script>/s
    );
    if (ld) {
      try {
        const data = JSON.parse(ld[1]);
        const vu = data?.contentUrl || data?.video?.[0]?.contentUrl;
        if (vu) return res.json({ videoUrl: vu, title: data?.caption || data?.description || null });
      } catch {}
    }

    // video_url patterns
    const patterns = [
      /"video_url"\s*:\s*"([^"]+\.mp4[^"]*)"/,
      /"contentUrl"\s*:\s*"([^"]+)"/,
    ];
    for (const p of patterns) {
      const m = page.match(p);
      if (m) {
        const vu = m[1].replace(/\\u002F/g, '/').replace(/\\/g, '');
        if (vu) return res.json({ videoUrl: vu, title: null });
      }
    }
  } catch {}

  // Instagram tidak punya API gratis seperti tikwm untuk TikTok
  return res.status(404).json({ error: 'Video not found' });
}

// ── TikTok extraction helpers ───────────────────────────────
function extractTikTokVideo(html) {
  const seen = new Set();

  const cdnRegex =
    /https?:\\?\/\\?\/[^"']*?tiktokcdn[^"']*?\.(?:mp4|webm)[^"']*/gi;
  for (const m of html.matchAll(cdnRegex)) {
    const clean = m[0]
      .replace(/\\u002F/g, '/')
      .replace(/\\\//g, '/')
      .replace(/\\/g, '');
    if (
      !seen.has(clean) &&
      (clean.includes('.mp4') || clean.includes('video'))
    ) {
      seen.add(clean);
      return clean;
    }
  }

  const scriptRegex = /<script[^>]*>(.*?)<\/script>/gs;
  for (const sm of html.matchAll(scriptRegex)) {
    try {
      const text = sm[1].trim();
      if (
        !text.startsWith('{') &&
        !text.startsWith('[') &&
        !text.startsWith('window.__')
      )
        continue;
      let json = text;
      const vm = text.match(/window\.__\w+__\s*=\s*({.*?});?\s*$/);
      if (vm) json = vm[1];
      const data = JSON.parse(json);
      const walk = (obj, depth = 0) => {
        if (!obj || typeof obj !== 'object' || depth > 10) return null;
        for (const k of [
          'playAddr',
          'downloadAddr',
          'playUrl',
          'videoUrl',
          'contentUrl',
        ]) {
          if (
            typeof obj[k] === 'string' &&
            obj[k].includes('tiktokcdn') &&
            !seen.has(obj[k])
          ) {
            const c = obj[k]
              .replace(/\\u002F/g, '/')
              .replace(/\\\//g, '/');
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

  const m = html.match(
    /"(playAddr|downloadAddr)"\s*:\s*"(https?:\\?\/\\?\/[^"]+)"/
  );
  if (m) {
    const c = m[2]
      .replace(/\\u002F/g, '/')
      .replace(/\\\//g, '/')
      .replace(/\\/g, '');
    if (!seen.has(c)) return c;
  }

  return null;
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/);
  if (m) return m[1].replace(' - TikTok', '').trim();
  return null;
}
