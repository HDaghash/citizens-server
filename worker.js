const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400'
};

const API_URL = 'https://citizens-server.herokuapp.com/';

addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') {
    event.respondWith(handleOptions(request));
  } else if (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'POST'
  ) {
    event.respondWith(handleRequest(request));
  } else {
    event.respondWith(
      new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed'
      })
    );
  }
});

function handleOptions(request) {
  let headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    let respHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Headers': request.headers.get(
        'Access-Control-Request-Headers'
      )
    };

    return new Response(null, {
      headers: respHeaders
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS'
      }
    });
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);

  let apiUrl = url.searchParams.get('apiurl');

  if (apiUrl == null) {
    apiUrl = API_URL + url.searchParams.get('method');
  }

  request = new Request(apiUrl, request);
  request.headers.set('Origin', new URL(apiUrl).origin);
  let response = await fetch(request);
  let body = response.body;

  response = new Response(response.body, response);

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');

  response.headers.append('Vary', 'Origin');

  return response;
}
