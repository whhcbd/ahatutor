import * as fs from 'fs';
import * as path from 'path';

const CHUNKS_FILE = path.join(__dirname, '..', 'data', 'external', 'genetics-rag', 'chunks_fine_grained_simplified.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'external', 'genetics-rag');

interface SimplifiedChunk {
  id: string;
  content: string;
  chapter?: string;
  section?: string;
  subsection?: string;
  level?: number;
  chunkType?: string;
}

interface VectorData {
  id: string;
  vector: number[];
  content: string;
  metadata: {
    chapter?: string;
    section?: string;
    subsection?: string;
    level?: number;
    chunkType?: string;
  };
}

console.log('🚀 开始生成细粒度RAG向量...\n');

if (!fs.existsSync(CHUNKS_FILE)) {
  console.error(`❌ 文件不存在: ${CHUNKS_FILE}`);
  console.log('请先运行: npx tsx build_genetics_rag_fine_grained.ts');
  process.exit(1);
}

const chunks: SimplifiedChunk[] = JSON.parse(fs.readFileSync(CHUNKS_FILE, 'utf-8'));
console.log(`📄 读取了 ${chunks.length} 个 chunks\n`);

console.log('🔄 开始向量化处理...');

const VOCABULARY_SIZE = 2000;
const vocabulary: Map<string, number> = new Map();

function buildVocabulary(text: string) {
  const words = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];
  for (const word of words) {
    const key = word.toLowerCase();
    if (!vocabulary.has(key)) {
      vocabulary.set(key, vocabulary.size);
      if (vocabulary.size >= VOCABULARY_SIZE) {
        return;
      }
    }
  }
}

console.log('📖 构建词汇表...');
for (const chunk of chunks) {
  buildVocabulary(chunk.content);
}
console.log(`   词汇表大小: ${vocabulary.size} 词\n`);

function textToVector(text: string): number[] {
  const vector = new Array(VOCABULARY_SIZE).fill(0);
  const words = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];

  for (const word of words) {
    const key = word.toLowerCase();
    const index = vocabulary.get(key);
    if (index !== undefined && index < VOCABULARY_SIZE) {
      vector[index]++;
    }
  }

  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (norm > 0) {
    for (let i = 0; i < vector.length; i++) {
      vector[i] = vector[i] / norm;
    }
  }

  return vector;
}

console.log('🧮 生成向量...');
const vectorData: VectorData[] = [];

for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  const vector = textToVector(chunk.content);

  vectorData.push({
    id: chunk.id,
    vector,
    content: chunk.content,
    metadata: {
      chapter: chunk.chapter,
      section: chunk.section,
      subsection: chunk.subsection,
      level: chunk.level,
      chunkType: chunk.chunkType,
    },
  });

  if ((i + 1) % 100 === 0) {
    console.log(`   进度: ${i + 1}/${chunks.length}`);
  }
}

console.log(`   完成: ${chunks.length}/${chunks.length}\n`);

const vectorsFile = path.join(OUTPUT_DIR, 'vectors_fine_grained.json');
fs.writeFileSync(vectorsFile, JSON.stringify(vectorData, null, 2), 'utf-8');
console.log(`💾 向量数据已保存到: ${vectorsFile}\n`);

const stats = {
  totalChunks: chunks.length,
  totalVectors: vectorData.length,
  vocabularySize: vocabulary.size,
  vectorDimension: VOCABULARY_SIZE,
  avgChunkSize: Math.round(
    chunks.reduce((sum, c) => sum + c.content.length, 0) / chunks.length
  ),
  chunksByChapter: new Map(
    chunks
      .filter(c => c.chapter)
      .map(c => [c.chapter, chunks.filter(ch => ch.chapter === c.chapter).length])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  ),
};

const statsFile = path.join(OUTPUT_DIR, 'stats_fine_grained_vectors.json');
fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2), 'utf-8');

console.log('📊 向量化统计:');
console.log(`   总块数: ${stats.totalChunks}`);
console.log(`   向量数: ${stats.totalVectors}`);
console.log(`   词汇表大小: ${stats.vocabularySize}`);
console.log(`   向量维度: ${stats.vectorDimension}`);
console.log(`   平均块大小: ${stats.avgChunkSize} 字符`);
console.log(`   前10个章节的chunk数量:`);
for (const [chapter, count] of stats.chunksByChapter) {
  console.log(`     ${chapter}: ${count}`);
}
console.log(`\n✨ 细粒度RAG向量生成完成!\n`);

console.log('📝 使用说明:');
console.log('1. 新的chunks文件: chunks_fine_grained.json');
console.log('2. 新的简化文件: chunks_fine_grained_simplified.json');
console.log('3. 新的向量文件: vectors_fine_grained.json');
console.log('4. 更新配置使用新文件:');
console.log('   RAG_CHUNKS_FILE=data/external/genetics-rag/chunks_fine_grained_simplified.json');
console.log('   RAG_VECTORS_FILE=data/external/genetics-rag/vectors_fine_grained.json\n');
