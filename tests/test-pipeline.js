const http = require('http');

const data = JSON.stringify({
  concept: '孟德尔第一定律',
  userLevel: 'beginner'
});

console.log('Sending request to:', 'http://localhost:3001/api/agent/pipeline');
console.log('Request body:', data);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/agent/pipeline',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
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
    console.log('Response:', body);
    try {
      const json = JSON.parse(body);
      console.log('Parsed JSON:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Failed to parse as JSON');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
