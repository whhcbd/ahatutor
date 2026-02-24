const http = require('http');

const data = JSON.stringify({
  concept: '遗传学',
  question: '什么是孟德尔分离定律？',
  userLevel: 'beginner'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/agent/visualize/ask',
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
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
