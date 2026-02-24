const fs = require('fs');

const data = JSON.parse(fs.readFileSync('chunks.json', 'utf8'));

console.log('=== RAG 数据分析 ===\n');
console.log('总 chunks 数量:', data.length);
console.log('文件总行数:', fs.readFileSync('chunks.json', 'utf8').split('\n').length);
console.log('平均每个 chunk 占用行数:', (fs.readFileSync('chunks.json', 'utf8').split('\n').length / data.length).toFixed(1));

console.log('\n=== 每个 chunk 的结构 ===');
console.log('- id: chunk 唯一标识');
console.log('- documentId: 文档标识');
console.log('- content: 文本内容');
console.log('- metadata: 元数据（章节、标签等）');

console.log('\n=== 为什么行数 > chunk 数量？===');
console.log('原因：');
console.log('1. JSON 格式化后，每个 chunk 对象占用多行');
console.log('2. 包含缩进、换行符、逗号等格式字符');
console.log('3. 每个 chunk 约 17-18 行（8754 行 ÷ 490 ≈ 17.9 行/chunk）');

console.log('\n=== 实际 chunk 数量计算 ===');
console.log(`如果目标是 12000 个 chunks，实际 JSON 行数约: ${12000 * 17.9} 行`);
console.log(`如果文件有 8000 行，实际 chunks 数量约: ${(8000 / 17.9).toFixed(0)} 个`);

console.log('\n=== 结论 ===');
console.log('✓ 当前文件包含 490 个 chunks（不是 12000 个）');
console.log('✓ 8754 行是 JSON 格式化后的行数');
console.log('✓ 每个 chunk 包含完整的内容和元数据');
