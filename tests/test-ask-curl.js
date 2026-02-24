const { exec } = require('child_process');

const data = JSON.stringify({
  concept: '孟德尔第一定律',
  question: '什么是孟德尔分离定律？'
});

const command = `curl -X POST http://localhost:3001/api/agent/visualize/ask -H "Content-Type: application/json" -d '${data}'`;

console.log('Running command:', command);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
    return;
  }
  console.log('Response:', stdout);
});
