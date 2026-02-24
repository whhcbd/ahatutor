import * as fs from 'fs';
import * as path from 'path';

const GENETICS_MD_PATH = 'c:/trae_coding/full.md';
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'external', 'genetics-rag');

interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: {
    chapter: string;
    section?: string;
    subsection?: string;
    level: number;
    chunkType: 'chapter' | 'section' | 'content';
    tags: string[];
  };
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🚀 开始构建细粒度遗传学RAG向量知识库...\n');

if (!fs.existsSync(GENETICS_MD_PATH)) {
  console.error(`❌ 文件不存在: ${GENETICS_MD_PATH}`);
  process.exit(1);
}

const content = fs.readFileSync(GENETICS_MD_PATH, 'utf-8');
const stats = fs.statSync(GENETICS_MD_PATH);
console.log(`📄 读取文件: ${GENETICS_MD_PATH}`);
console.log(`   文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
console.log(`   文件行数: ${content.split('\n').length} 行\n`);

const chunks: DocumentChunk[] = [];
const lines = content.split('\n');

interface SectionInfo {
  level: number;
  title: string;
  lineNumber: number;
  children: SectionInfo[];
  chunks: string[];
}

const sections: SectionInfo[] = [];
const stack: SectionInfo[] = [];
let currentContentChunks: string[] = [];
let charCount = 0;

const MAX_CHUNK_SIZE = 700;
const MIN_CHUNK_SIZE = 100;

console.log('📊 开始细粒度分块处理...');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);

  if (headerMatch) {
    const level = headerMatch[1].length;
    const title = headerMatch[2].trim();

    if (currentContentChunks.length > 0 && charCount >= MIN_CHUNK_SIZE) {
      createContentChunks(currentContentChunks.join('\n'), stack, charCount);
      currentContentChunks = [];
      charCount = 0;
    }

    const section: SectionInfo = {
      level,
      title,
      lineNumber: i,
      children: [],
      chunks: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      sections.push(section);
    } else {
      stack[stack.length - 1].children.push(section);
    }

    stack.push(section);
    currentContentChunks = [];
    charCount = 0;
  } else if (line.trim()) {
    currentContentChunks.push(line);
    charCount += line.length;

    if (charCount >= MAX_CHUNK_SIZE) {
      createContentChunks(currentContentChunks.join('\n'), stack, charCount);
      currentContentChunks = [];
      charCount = 0;
    }
  }
}

if (currentContentChunks.length > 0 && charCount >= MIN_CHUNK_SIZE) {
  createContentChunks(currentContentChunks.join('\n'), stack, charCount);
}

console.log(`✅ 分块完成! 共生成 ${chunks.length} 个文本块\n`);

const chunksFile = path.join(OUTPUT_DIR, 'chunks_fine_grained.json');
fs.writeFileSync(chunksFile, JSON.stringify(chunks, null, 2), 'utf-8');
console.log(`💾 分块结果已保存到: ${chunksFile}\n`);

const simplifiedChunks = chunks.map(chunk => ({
  id: chunk.id,
  content: chunk.content,
  chapter: chunk.metadata.chapter,
  section: chunk.metadata.section,
  subsection: chunk.metadata.subsection,
  level: chunk.metadata.level,
  chunkType: chunk.metadata.chunkType,
}));

const simplifiedFile = path.join(OUTPUT_DIR, 'chunks_fine_grained_simplified.json');
fs.writeFileSync(simplifiedFile, JSON.stringify(simplifiedChunks, null, 2), 'utf-8');
console.log(`💾 简化版本已保存到: ${simplifiedFile}\n`);

const statsData = {
  totalChunks: chunks.length,
  totalCharacters: content.length,
  avgChunkSize: Math.round(content.length / chunks.length),
  chapters: sections.filter(s => s.level === 1).length,
  sections: sections.filter(s => s.level === 2).length,
  subsections: sections.filter(s => s.level === 3).length,
  chunksByLevel: {
    1: chunks.filter(c => c.metadata.level === 1).length,
    2: chunks.filter(c => c.metadata.level === 2).length,
    3: chunks.filter(c => c.metadata.level === 3).length,
  },
  chunksByType: {
    chapter: chunks.filter(c => c.metadata.chunkType === 'chapter').length,
    section: chunks.filter(c => c.metadata.chunkType === 'section').length,
    content: chunks.filter(c => c.metadata.chunkType === 'content').length,
  },
  sectionStructure: sections.map(s => ({
    level: s.level,
    title: s.title.substring(0, 50) + (s.title.length > 50 ? '...' : ''),
    childCount: s.children.length,
  })),
};

const statsFile = path.join(OUTPUT_DIR, 'stats_fine_grained.json');
fs.writeFileSync(statsFile, JSON.stringify(statsData, null, 2), 'utf-8');

console.log('📊 统计信息:');
console.log(`   总块数: ${statsData.totalChunks}`);
console.log(`   总字符数: ${statsData.totalCharacters.toLocaleString()}`);
console.log(`   平均块大小: ${statsData.avgChunkSize} 字符`);
console.log(`   一级标题(章): ${statsData.chapters}`);
console.log(`   二级标题(节): ${statsData.sections}`);
console.log(`   三级标题(小节): ${statsData.subsections}`);
console.log(`   块级别分布:`);
console.log(`     L1 (章): ${statsData.chunksByLevel[1]}`);
console.log(`     L2 (节): ${statsData.chunksByLevel[2]}`);
console.log(`     L3 (小节): ${statsData.chunksByLevel[3]}`);
console.log(`   块类型分布:`);
console.log(`     章节块: ${statsData.chunksByType.chapter}`);
console.log(`     小节块: ${statsData.chunksByType.section}`);
console.log(`     内容块: ${statsData.chunksByType.content}`);
console.log(`\n✨ 细粒度遗传学RAG向量知识库构建完成!\n`);

function createContentChunks(content: string, sectionStack: SectionInfo[], charCount: number) {
  const chunkContent = content.trim();
  if (chunkContent.length < MIN_CHUNK_SIZE) return;

  const level1 = sectionStack.find(s => s.level === 1);
  const level2 = sectionStack.find(s => s.level === 2);
  const level3 = sectionStack.find(s => s.level === 3);

  const chunkIndex = chunks.length;
  const chunkType: 'chapter' | 'section' | 'content' = 
    charCount > MAX_CHUNK_SIZE * 1.5 ? 'content' : 
    (level2 ? 'section' : 'chapter');

  chunks.push({
    id: `chunk_fine_${chunkIndex}`,
    documentId: 'genetics_textbook_v4_fine_grained',
    content: chunkContent,
    metadata: {
      chapter: level1?.title || '未分类',
      section: level2?.title,
      subsection: level3?.title,
      level: level3 ? 3 : (level2 ? 2 : (level1 ? 1 : 0)),
      chunkType,
      tags: extractTags(chunkContent),
    },
  });
}

function extractTags(content: string): string[] {
  const tags: string[] = [];
  const lowerContent = content.toLowerCase();

  const keywordGroups = {
    '基因': ['基因', 'dna', 'rna', '蛋白质', '氨基酸', '核苷酸', '基因组'],
    '染色体': ['染色体', '染色质', '着丝粒', '端粒', '同源染色体'],
    '遗传': ['遗传', '孟德尔', '分离定律', '自由组合', '伴性遗传', '连锁'],
    '突变': ['突变', '基因突变', '点突变', '插入', '缺失', '重复', '倒位'],
    '表达': ['表达', '转录', '翻译', '调控', '启动子', '增强子', '沉默子'],
    '复制': ['复制', 'dna复制', '半保留', '复制叉', '冈崎片段'],
    '重组': ['重组', '交叉', '互换', '同源重组', '位点特异性重组'],
    '细胞': ['细胞', '细胞核', '细胞质', '细胞分裂', '有丝分裂', '减数分裂'],
    '群体': ['群体', '基因频率', '基因型频率', '哈代-温伯格', '遗传漂变'],
    '表观': ['表观', '甲基化', '乙酰化', '组蛋白', '染色质重塑'],
    '进化': ['进化', '自然选择', '适应', '物种', '分类'],
    '技术': ['pcr', '电泳', '克隆', '载体', '酶切', '测序', 'crispr'],
  };

  for (const [category, keywords] of Object.entries(keywordGroups)) {
    if (keywords.some(keyword => lowerContent.includes(keyword.toLowerCase()))) {
      tags.push(category);
    }
  }

  const numbers = content.match(/[\u4e00-\u9fa5]*第[\u4e00-\u9fa5]+[\d一二三四五六七八九十百千]+章/g);
  if (numbers) {
    tags.push(...numbers.map(n => n.replace(/[第章]/g, '')));
  }

  return [...new Set(tags)];
}
