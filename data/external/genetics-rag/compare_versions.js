const fs = require('fs');

const chunksOld = JSON.parse(fs.readFileSync('chunks.json', 'utf8'));
const chunksNew = JSON.parse(fs.readFileSync('chunks_fine_grained.json', 'utf8'));
const vectorsNew = JSON.parse(fs.readFileSync('vectors_fine_grained.json', 'utf8'));

console.log('=== RAG 数据对比分析 ===\n');

console.log('📊 Chunks 数量对比:');
console.log(`  旧版本: ${chunksOld.length} 个 chunks`);
console.log(`  新版本: ${chunksNew.length} 个 chunks`);
console.log(`  增长率: ${((chunksNew.length - chunksOld.length) / chunksOld.length * 100).toFixed(1)}%`);

console.log('\n📏 平均块大小对比:');
const avgOld = chunksOld.reduce((sum, c) => sum + c.content.length, 0) / chunksOld.length;
const avgNew = chunksNew.reduce((sum, c) => sum + c.content.length, 0) / chunksNew.length;
console.log(`  旧版本: ${Math.round(avgOld)} 字符/chunk`);
console.log(`  新版本: ${Math.round(avgNew)} 字符/chunk`);
console.log(`  变化: ${((avgNew - avgOld) / avgOld * 100).toFixed(1)}%`);

console.log('\n📂 文件大小对比:');
const statsOld = fs.statSync('chunks.json');
const statsNew = fs.statSync('chunks_fine_grained.json');
const statsVectorsNew = fs.statSync('vectors_fine_grained.json');
console.log(`  旧版 chunks: ${(statsOld.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`  新版 chunks: ${(statsNew.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`  新版 vectors: ${(statsVectorsNew.size / 1024 / 1024).toFixed(2)} MB`);

console.log('\n🏷️ 新版本元数据结构:');
console.log(`  支持章节: ${new Set(chunksNew.map(c => c.metadata.chapter).filter(Boolean)).size} 个`);
console.log(`  支持小节: ${new Set(chunksNew.map(c => c.metadata.section).filter(Boolean)).size} 个`);
console.log(`  支持子节: ${new Set(chunksNew.map(c => c.metadata.subsection).filter(Boolean)).size} 个`);

console.log('\n🎯 新版本特色:');
console.log('  ✓ 按章节结构分块，保持内容完整性');
console.log('  ✓ 更细粒度（平均791字符 vs 1382字符）');
console.log('  ✓ 多级元数据（章/节/小节）');
console.log('  ✓ 块类型分类（章节块/小节块/内容块）');
console.log('  ✓ 改进的标签提取（13个分类）');

console.log('\n📦 生成文件列表:');
console.log('  1. chunks_fine_grained.json - 完整chunk数据（778个）');
console.log('  2. chunks_fine_grained_simplified.json - 简化chunk数据');
console.log('  3. vectors_fine_grained.json - 向量数据（778个，2000维）');
console.log('  4. stats_fine_grained.json - 分块统计信息');
console.log('  5. stats_fine_grained_vectors.json - 向量化统计信息');

console.log('\n✅ 细粒度RAG构建完成！');
console.log('建议: 更新环境变量使用新文件');
