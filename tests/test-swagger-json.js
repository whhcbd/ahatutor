const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/docs-json',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);

  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Response length:', body.length);
    try {
      const json = JSON.parse(body);
      console.log('Paths:', Object.keys(json.paths || {}));
      const askPath = json.paths['/api/agent/visualize/ask'];
      if (askPath) {
        console.log('Ask path schema:', JSON.stringify(askPath, null, 2));
      }
    } catch (e) {
      console.log('Failed to parse as JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.end();
