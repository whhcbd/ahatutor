const http = require('http');

const concept = 'DNA复制';
const question = '可视化表现一下冈崎片段';
const userLevel = 'intermediate';

const url = `http://localhost:3001/api/agent/visualize/ask/stream?concept=${encodeURIComponent(concept)}&question=${encodeURIComponent(question)}&userLevel=${userLevel}`;

console.log('Testing SSE stream...');
console.log('URL:', url);
console.log('\n--- Stream Response ---\n');

const req = http.get(url, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  console.log('\n--- Chunks ---\n');

  let buffer = '';

  res.on('data', (chunk) => {
    const text = chunk.toString();
    buffer += text;
    
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.startsWith('data: ')) {
        try {
          const jsonStr = line.substring(6);
          const data = JSON.parse(jsonStr);
          
          const timestamp = new Date(data.timestamp).toLocaleTimeString();
          
          console.log(`[${timestamp}] Type: ${data.type}`);
          
          if (data.type === 'skeleton') {
            console.log(`  Template: ${data.data.templateId}`);
            console.log(`  VisualizationType: ${data.data.visualizationType}`);
          } else if (data.type === 'chunk') {
            console.log(`  Chunk ${data.data.index + 1}/${data.data.total} (${data.data.progress.toFixed(1)}%)`);
            console.log(`  Text: ${data.data.chunk.substring(0, 50)}...`);
          } else if (data.type === 'data') {
            console.log(`  A2UI Template: ${data.data.a2uiTemplate?.templateId}`);
          } else if (data.type === 'done') {
            console.log(`  Examples: ${data.data.examples?.length || 0}`);
            console.log(`  Follow-up questions: ${data.data.followUpQuestions?.length || 0}`);
          } else if (data.type === 'error') {
            console.log(`  Error: ${data.error}`);
          }
          console.log('');
        } catch (e) {
          console.log(`  [Parse Error]: ${line.substring(0, 100)}...`);
        }
      }
    });
  });

  res.on('end', () => {
    console.log('\n--- Stream Completed ---');
    console.log(`Total bytes received: ${buffer.length}`);
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

setTimeout(() => {
  req.destroy();
  console.log('\n--- Timeout (30s) ---');
}, 30000);
