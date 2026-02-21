import * as fs from 'fs';
import * as path from 'path';

// 遗传学教材路径
const GENETICS_MD_PATH = 'C:/Users/16244/MinerU/遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24/full.md';
const OUTPUT_DIR = path.join(__dirname, 'data', 'genetics-rag');

interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: {
    chapter?: string;
    section?: string;
    level: number;
    tags: string[];
  };
}

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 开始构建遗传学RAG向量知识库...\n');

// 读取MD文件
if (!fs.existsSync(GENETICS_MD_PATH)) {
  console.error(`❌ 文件不存在: ${GENETICS_MD_PATH}`);
  process.exit(1);
}

const content = fs.readFileSync(GENETICS_MD_PATH, 'utf-8');
const stats = fs.statSync(GENETICS_MD_PATH);
console.log(`📄 读取文件: ${GENETICS_MD_PATH}`);
console.log(`   文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`   文件行数: ${content.split('\n').length} 行\n`);

// 按章节和结构分块
console.log('📊 开始分块处理...');
const chunks: DocumentChunk[] = [];
const lines = content.split('\n');

let currentChunk = '';
let currentChapter = '';
let currentSection = '';
let currentSubsection = '';
let chunkIndex = 0;
let charCount = 0;
const MAX_CHUNK_SIZE = 1500;
const MIN_CHUNK_SIZE = 500;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // 检测标题
  const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);
  
  if (headerMatch) {
    const level = headerMatch[1].length;
    const title = headerMatch[2].trim();
    
    // 如果当前块足够大，保存它
    if (currentChunk.trim().length >= MIN_CHUNK_SIZE) {
      chunks.push(createChunk(currentChunk.trim(), chunkIndex++, {
        chapter: currentChapter || undefined,
        section: currentSection || undefined,
        level,
      }));
      charCount = 0;
    }
    
    // 更新当前标题
    if (level === 1) {
      currentChapter = title;
      currentSection = '';
      currentSubsection = '';
    } else if (level === 2) {
      currentSection = title;
      currentSubsection = '';
    } else if (level === 3) {
      currentSubsection = title;
    }
    
    currentChunk = line + '\n';
    charCount += line.length;
  } else {
    currentChunk += line + '\n';
    charCount += line.length;
    
    // 如果块超过最大大小，保存它
    if (charCount >= MAX_CHUNK_SIZE && currentChunk.trim().length >= MIN_CHUNK_SIZE) {
      chunks.push(createChunk(currentChunk.trim(), chunkIndex++, {
        chapter: currentChapter || undefined,
        section: currentSection || undefined,
        level: currentSection ? 2 : (currentChapter ? 1 : 0),
      }));
      currentChunk = '';
      charCount = 0;
    }
  }
}

// 保存最后一个块
if (currentChunk.trim().length >= MIN_CHUNK_SIZE) {
  chunks.push(createChunk(currentChunk.trim(), chunkIndex++, {
    chapter: currentChapter || undefined,
    section: currentSection || undefined,
    level: currentSection ? 2 : (currentChapter ? 1 : 0),
  }));
}

console.log(`✅ 分块完成! 共生成 ${chunks.length} 个文本块\n`);

// 保存分块结果
const chunksFile = path.join(OUTPUT_DIR, 'chunks.json');
fs.writeFileSync(chunksFile, JSON.stringify(chunks, null, 2), 'utf-8');
console.log(`💾 分块结果已保存到: ${chunksFile}\n`);

// 生成统计信息
const statsData = {
  totalChunks: chunks.length,
  totalCharacters: content.length,
  avgChunkSize: Math.round(content.length / chunks.length),
  chapters: new Set(chunks.map(c => c.metadata.chapter).filter(Boolean)).size,
  sections: new Set(chunks.map(c => c.metadata.section).filter(Boolean)).size,
  chunksByLevel: {
    0: chunks.filter(c => c.metadata.level === 0).length,
    1: chunks.filter(c => c.metadata.level === 1).length,
    2: chunks.filter(c => c.metadata.level === 2).length,
  },
};

const statsFile = path.join(OUTPUT_DIR, 'stats.json');
fs.writeFileSync(statsFile, JSON.stringify(statsData, null, 2), 'utf-8');
console.log('📊 统计信息:');
console.log(`   总块数: ${statsData.totalChunks}`);
console.log(`   总字符数: ${statsData.totalCharacters.toLocaleString()}`);
console.log(`   平均块大小: ${statsData.avgChunkSize} 字符`);
console.log(`   章节数: ${statsData.chapters}`);
console.log(`   小节数: ${statsData.sections}`);
console.log(`   块级别分布:`);
console.log(`     L0 (正文): ${statsData.chunksByLevel[0]}`);
console.log(`     L1 (章节): ${statsData.chunksByLevel[1]}`);
console.log(`     L2 (小节): ${statsData.chunksByLevel[2]}`);
console.log(`\n✨ 遗传学RAG向量知识库构建完成!\n`);

// 创建一个简化的JSON文件，用于后续的向量化和检索
const simplifiedChunks = chunks.map(chunk => ({
  id: chunk.id,
  content: chunk.content,
  chapter: chunk.metadata.chapter,
  section: chunk.metadata.section,
  level: chunk.metadata.level,
}));

const simplifiedFile = path.join(OUTPUT_DIR, 'chunks_simplified.json');
fs.writeFileSync(simplifiedFile, JSON.stringify(simplifiedChunks, null, 2), 'utf-8');
console.log(`💾 简化版本已保存到: ${simplifiedFile}\n`);

function createChunk(content: string, index: number, metadata: any): DocumentChunk {
  return {
    id: `chunk_${index}`,
    documentId: 'genetics_textbook_v4',
    content: content.trim(),
    metadata: {
      chapter: metadata.chapter,
      section: metadata.section,
      level: metadata.level || 0,
      tags: extractTags(content),
    },
  };
}

function extractTags(content: string): string[] {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();
  
  const keywords = [
    '基因', '染色体', 'dna', 'rna', '蛋白质', '遗传', '突变',
    '表达', '调控', '转录', '翻译', '复制', '重组', '连锁',
    '群体', '进化', '表观', '基因组', '序列', '结构', '功能',
    '孟德尔', '遗传学', '分子', '细胞', '生物'
  ];
  
  for (const keyword of keywords) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      tags.push(keyword);
    }
  }
  
  return tags;
}
