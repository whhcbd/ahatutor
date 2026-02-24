const fs = require('fs');

const data = JSON.parse(fs.readFileSync('chunks.json', 'utf8'));
console.log('Total chunks:', data.length);
console.log('First chunk structure:', Object.keys(data[0]));
console.log('Sample chunk:');
console.log(JSON.stringify(data[0], null, 2));
console.log('\nChunk lengths:');
data.slice(0, 5).forEach((chunk, i) => {
  console.log(`Chunk ${i}: ${chunk.content ? chunk.content.length : 0} chars`);
});
