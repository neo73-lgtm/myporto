// Proxy video dari TikTok CDN ke client dengan Referer header
// https://vercel.com/docs/functions/serverless-functions/runtimes/node-js#streaming
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing url' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.tiktok.com/',
        Origin: 'https://www.tiktok.com',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Proxy failed', status: response.status }),
        {
          status: response.status,
          headers: { 'content-type': 'application/json' },
        }
      );
    }

    const contentType =
      response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');

    const headers = {
      'content-type': contentType,
      'cache-control': 'public, max-age=86400',
      'access-control-allow-origin': '*',
      'access-control-expose-headers': 'content-length, content-range',
    };

    if (contentLength) {
      headers['content-length'] = contentLength;
    }

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}
