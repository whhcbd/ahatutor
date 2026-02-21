import * as fs from 'fs';
import * as path from 'path';

const STORAGE_DIR = path.join(__dirname, 'data', 'genetics-rag');
const VECTORS_FILE = path.join(STORAGE_DIR, 'vectors.json');

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
  embedding?: number[];
}

interface QueryResult {
  content: string;
  score: number;
  metadata: {
    chapter?: string;
    section?: string;
    tags: string[];
  };
}

class GeneticsRAGService {
  private chunks: DocumentChunk[] = [];
  private embeddings: Map<string, number[]> = new Map();

  async initialize() {
    console.log('🔧 初始化本地向量存储...\n');

    // 尝试加载已有向量
    if (fs.existsSync(VECTORS_FILE)) {
      const data = fs.readFileSync(VECTORS_FILE, 'utf-8');
      const loaded = JSON.parse(data);
      this.chunks = (loaded.chunks || []).map((c: any) => ({
        ...c,
        metadata: c.metadata || { level: 0, tags: [] }
      }));
      this.embeddings = new Map(loaded.embeddings || []);
      console.log(`✅ 加载了 ${this.chunks.length} 个文本块和 ${this.embeddings.size} 个向量\n`);
    } else {
      console.log('✅ 向量存储已就绪（空）\n');
    }
  }

  async loadChunks() {
    const chunksFile = path.join(STORAGE_DIR, 'chunks_simplified.json');
    
    if (!fs.existsSync(chunksFile)) {
      throw new Error(`文件不存在: ${chunksFile}`);
    }

    const data = fs.readFileSync(chunksFile, 'utf-8');
    this.chunks = JSON.parse(data);
    console.log(`📚 加载了 ${this.chunks.length} 个文本块\n`);
  }

  // 简单的TF-IDF风格的文本向量化
  private textToVector(text: string): number[] {
    // 提取所有唯一的汉字和单词
    const words: string[] = [];
    const regex = /[\u4e00-\u9fa5]+|[a-zA-Z0-9]+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      words.push(match[0]);
    }

    // 创建词汇表（固定大小用于一致性）
    const vocabSize = 2000;
    const vector = new Array(vocabSize).fill(0);
    
    // 简单哈希将词映射到向量位置
    for (const word of words) {
      const hash = this.hashString(word);
      const index = Math.abs(hash) % vocabSize;
      vector[index] += 1;
    }

    // 归一化向量
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = vector[i] / norm;
      }
    }

    return vector;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }

  async indexChunks() {
    console.log('📤 开始索引文本块...\n');

    // 清空现有数据
    this.chunks = [];
    this.embeddings.clear();

    await this.loadChunks();

    // 为每个文本块生成向量
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const embedding = this.textToVector(chunk.content);
      
      chunk.embedding = embedding;
      this.embeddings.set(chunk.id, embedding);
      
      if ((i + 1) % 50 === 0) {
        console.log(`✅ 已处理 ${i + 1}/${this.chunks.length} 个块`);
      }
    }

    console.log(`✅ 已处理全部 ${this.chunks.length} 个块\n`);

    // 保存到文件
    this.saveVectors();
    console.log('💾 向量已保存\n');
  }

  private saveVectors() {
    const data = {
      chunks: this.chunks,
      embeddings: Array.from(this.embeddings.entries())
    };
    fs.writeFileSync(VECTORS_FILE, JSON.stringify(data), 'utf-8');
  }

  async search(query: string, topK: number = 5): Promise<QueryResult[]> {
    console.log(`🔍 搜索查询: "${query}"\n`);

    if (this.chunks.length === 0) {
      console.log('⚠️  知识库为空，请先运行 index 命令\n');
      return [];
    }

    // 为查询生成向量
    const queryVector = this.textToVector(query);

    // 计算所有文本块的相似度
    const results: Array<{ chunk: DocumentChunk; score: number }> = [];
    
    for (const chunk of this.chunks) {
      if (chunk.embedding) {
        const score = this.cosineSimilarity(queryVector, chunk.embedding);
        if (score > 0.1) { // 设置最小相似度阈值
          results.push({ chunk, score });
        }
      }
    }

    // 按相似度排序
    results.sort((a, b) => b.score - a.score);

    // 返回 topK 结果
    const topResults = results.slice(0, topK);
    console.log(`✅ 找到 ${topResults.length} 个相关结果\n`);

    return topResults.map(r => ({
      content: r.chunk.content,
      score: r.score,
      metadata: {
        chapter: r.chunk.metadata?.chapter,
        section: r.chunk.metadata?.section,
        tags: r.chunk.metadata?.tags || [],
      }
    }));
  }

  async getStats() {
    return {
      totalChunks: this.chunks.length,
      totalEmbeddings: this.embeddings.size,
      storagePath: STORAGE_DIR
    };
  }

  async deleteCollection() {
    console.log(`🗑️  删除向量存储...`);
    this.chunks = [];
    this.embeddings.clear();
    
    if (fs.existsSync(VECTORS_FILE)) {
      fs.unlinkSync(VECTORS_FILE);
    }
    
    console.log('✅ 向量存储已删除\n');
  }
}

// CLI 接口
async function main() {
  const command = process.argv[2];
  const query = process.argv.slice(3).join(' ');

  const ragService = new GeneticsRAGService();

  try {
    await ragService.initialize();

    switch (command) {
      case 'index':
        await ragService.indexChunks();
        const stats = await ragService.getStats();
        console.log('📊 最终统计:');
        console.log(`   总向量数: ${stats.totalEmbeddings}`);
        console.log(`   存储位置: ${stats.storagePath}\n`);
        break;

      case 'search':
        if (!query) {
          console.error('❌ 请提供搜索查询');
          console.log('用法: npm run rag:search "你的查询问题"\n');
          process.exit(1);
        }
        const results = await ragService.search(query, 5);
        if (results.length === 0) {
          console.log('😕 未找到相关结果\n');
        } else {
          results.forEach((result, index) => {
            console.log(`\n【结果 ${index + 1}】相似度: ${(result.score * 100).toFixed(1)}%`);
            if (result.metadata.chapter) {
              console.log(`📚 章节: ${result.metadata.chapter}`);
            }
            if (result.metadata.section) {
              console.log(`📖 小节: ${result.metadata.section}`);
            }
            if (result.metadata.tags.length > 0) {
              console.log(`🏷️  标签: ${result.metadata.tags.join(', ')}`);
            }
            console.log(`\n${result.content.substring(0, 400)}...\n${'─'.repeat(80)}`);
          });
        }
        break;

      case 'stats':
        const currentStats = await ragService.getStats();
        console.log('📊 当前知识库状态:');
        console.log(`   总向量数: ${currentStats.totalEmbeddings}`);
        console.log(`   存储位置: ${currentStats.storagePath}\n`);
        break;

      case 'delete':
        await ragService.deleteCollection();
        break;

      default:
        console.log('📖 用法:');
        console.log('   index   - 索引文本块到向量数据库');
        console.log('   search  - 搜索知识库');
        console.log('   stats   - 查看知识库统计');
        console.log('   delete  - 删除知识库\n');
        console.log('示例:');
        console.log('   npm run rag:index');
        console.log('   npm run rag:search "什么是基因表达?"\n');
    }
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { GeneticsRAGService };
