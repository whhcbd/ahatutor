const http = require('http');

const data = JSON.stringify({
  concept: '遗传学',
  question: '豌豆杂交实验的原理是什么？'
});

console.log('Sending request to:', 'http://localhost:3001/api/agent/visualize/ask');
console.log('Request body:', data);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/agent/visualize/ask',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);

  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Response length:', body.length);
    try {
      const json = JSON.parse(body);
      console.log('Text Answer:', json.textAnswer);
      console.log('Visualization Type:', json.visualization?.type);
    } catch (e) {
      console.log('Failed to parse as JSON:', e.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(data);
req.end();
