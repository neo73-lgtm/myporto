const cache = new Map();

const MICROLINK_API = 'https://api.microlink.io';

export async function fetchOembed(videoUrl) {
  if (!videoUrl) return null;
  if (cache.has(videoUrl)) return cache.get(videoUrl);

  const strategies = [
    // Strategy 1: server-side proxy (no CORS, more reliable)
    async () => {
      const res = await fetch(`/api/thumbnail?url=${encodeURIComponent(videoUrl)}`);
      if (!res.ok) throw new Error('server proxy failed');
      const data = await res.json();
      if (!data.thumbnail) throw new Error('no thumbnail from proxy');
      return {
        title: null,
        thumbnail_url: data.thumbnail,
        screenshot_url: null,
      };
    },
    // Strategy 2: microlink (client-side fallback)
    async () => {
      const res = await fetch(`${MICROLINK_API}/?url=${encodeURIComponent(videoUrl)}`);
      if (!res.ok) throw new Error('microlink failed');
      const data = await res.json();
      if (data.status !== 'success') throw new Error('microlink not success');
      return {
        title: data.data?.title || null,
        thumbnail_url: data.data?.image?.url || null,
        screenshot_url: `${MICROLINK_API}/?url=${encodeURIComponent(videoUrl)}&screenshot=true&meta=false&embed=screenshot.url`,
      };
    },
    // Strategy 3: noembed (works for YouTube, Vimeo, etc.)
    async () => {
      const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`);
      if (!res.ok) throw new Error('noembed failed');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return {
        title: data.title || null,
        thumbnail_url: data.thumbnail_url || data.url || null,
        screenshot_url: null,
      };
    },
  ];

  for (const strategy of strategies) {
    try {
      const result = await strategy();
      cache.set(videoUrl, result);
      return result;
    } catch {}
  }

  cache.set(videoUrl, null);
  return null;
}

export async function fetchThumbnail(videoUrl) {
  const data = await fetchOembed(videoUrl);
  return data?.thumbnail_url || data?.screenshot_url || null;
}

export async function fetchTitle(videoUrl) {
  const data = await fetchOembed(videoUrl);
  return data?.title || null;
}

const DEFAULT = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop';
const GENERIC_PATTERNS = [
  DEFAULT,
  'https://images.unsplash.com/',
  'unsplash.com',
];

export function isGenericPlaceholder(url) {
  if (!url) return true;
  return GENERIC_PATTERNS.some(p => url.includes(p));
}
