export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  try {
    const api = await fetch(
      `https://api.microlink.io/?url=${encodeURIComponent(url)}`
    );
    const data = await api.json();

    if (data.status === 'success' && data.data?.image?.url) {
      return res.json({ thumbnail: data.data.image.url });
    }

    return res.json({
      thumbnail: `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
