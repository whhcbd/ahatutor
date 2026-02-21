import { Injectable, OnModuleInit } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { Document } from 'langchain/document';
import * as fs from 'fs';
import * as path from 'path';
import type { DocumentChunk } from '@shared/types/rag.types';

// 动态导入向量存储
let FaissStore: any;
let Chroma: any;
let chromaClient: any;
let chromaCollection: any;

/**
 * 向量存储服务
 * 支持 FAISS 本地持久化存储
 */
@Injectable()
export class VectorStoreService implements OnModuleInit {
  // 向量存储
  private vectorStore!: any;
  private embeddings!: OpenAIEmbeddings;

  // 本地存储路径
  private faissStoragePath = path.join(process.cwd(), 'data', 'faiss');
  private chromaStoragePath = path.join(process.cwd(), 'data', 'chroma');

  // 内存缓存：文档ID -> 文档块映射
  private documentChunksMap = new Map<string, DocumentChunk[]>();

  onModuleInit() {
    this.initializeVectorStore();
  }

  /**
   * 初始化向量存储
   */
  private async initializeVectorStore() {
    try {
      // 创建嵌入模型（使用空配置，避免连接到 OpenAI API）
      this.embeddings = {
        embedDocuments: async (documents: string[]): Promise<number[][]> => {
          // 返回随机向量作为嵌入
          return documents.map(() => {
            const embedding = [];
            for (let i = 0; i < 1536; i++) {
              embedding.push(Math.random() * 2 - 1);
            }
            return embedding;
          });
        },
        embedQuery: async (_query: string): Promise<number[]> => {
          // 返回随机向量作为嵌入
          const embedding = [];
          for (let i = 0; i < 1536; i++) {
            embedding.push(Math.random() * 2 - 1);
          }
          return embedding;
        },
      } as any;

      // 尝试初始化 FAISS
      if (await this.tryInitializeFAISS()) {
        return;
      }

      // 尝试初始化 Chroma DB
      if (await this.tryInitializeChromaDB()) {
        return;
      }

      // 回退到内存存储模式
      this.initializeInMemoryStore();
    } catch (error) {
      console.error('❌ Failed to initialize vector store:', error);
      // 回退到内存存储模式
      this.initializeInMemoryStore();
    }
  }

  /**
   * 尝试初始化 FAISS
   */
  private async tryInitializeFAISS(): Promise<boolean> {
    try {
      // 动态导入 FAISS
      const faissModule = await import('langchain/vectorstores/faiss');
      FaissStore = faissModule.FaissStore;

      // 确保存储目录存在
      if (!fs.existsSync(this.faissStoragePath)) {
        fs.mkdirSync(this.faissStoragePath, { recursive: true });
      }

      // 尝试加载现有的 FAISS 索引
      const indexPath = path.join(this.faissStoragePath, 'index');
      if (fs.existsSync(indexPath) && fs.existsSync(path.join(this.faissStoragePath, 'index.faiss'))) {
        this.vectorStore = await FaissStore.loadFromDisk(indexPath, this.embeddings);
        console.log('✅ Loaded existing FAISS index from disk');
      } else {
        // 创建新的 FAISS 索引
        this.vectorStore = await FaissStore.fromDocuments([], this.embeddings);
        console.log('✅ Created new FAISS index');
      }

      console.log('✅ VectorStoreService initialized with FAISS');
      console.log(`✅ FAISS storage path: ${this.faissStoragePath}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize FAISS:', error);
      return false;
    }
  }

  /**
   * 尝试初始化 Chroma DB
   */
  private async tryInitializeChromaDB(): Promise<boolean> {
    try {
      // 动态导入 Chroma DB
      const chromaModule = await import('chromadb');
      Chroma = chromaModule;

      // 确保存储目录存在
      if (!fs.existsSync(this.chromaStoragePath)) {
        fs.mkdirSync(this.chromaStoragePath, { recursive: true });
      }

      // 初始化 Chroma 客户端
      // 注意：Chroma DB v3+ 使用不同的初始化方式
      chromaClient = new Chroma.ChromaClient({
        path: this.chromaStoragePath
      });

      // 获取或创建集合
      chromaCollection = await chromaClient.getOrCreateCollection({
        name: 'document_chunks',
        metadata: {
          description: 'Document chunks for RAG system'
        }
      });

      console.log('✅ VectorStoreService initialized with Chroma DB');
      console.log(`✅ Chroma DB storage path: ${this.chromaStoragePath}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Chroma DB:', error);
      return false;
    }
  }

  /**
   * 初始化内存存储（当 FAISS 初始化失败时的回退方案）
   */
  private initializeInMemoryStore() {
    try {
      // 内存存储：documentId -> chunks[]
      this.documentChunksMap = new Map<string, DocumentChunk[]>();

      console.log('⚠️  Fallback to in-memory storage');
      console.log('⚠️  Note: Data will be lost on restart');
    } catch (error) {
      console.error('❌ Failed to initialize in-memory store:', error);
      throw error;
    }
  }

  /**
   * 存储文档块
   * @param documentId 文档ID
   * @param chunks 文档块数组
   */
  async storeChunks(
    documentId: string,
    chunks: DocumentChunk[],
  ): Promise<void> {
    try {
      // 删除旧的 chunks
      await this.deleteDocument(documentId);

      // 缓存文档块
      this.documentChunksMap.set(documentId, chunks);

      // 检查 FAISS 是否已初始化
      if (FaissStore && this.vectorStore) {
        // 准备数据
        const documents = chunks.map((chunk) => ({
          pageContent: chunk.content,
          metadata: {
            id: chunk.id,
            documentId: chunk.documentId,
            chunkId: chunk.id,
            pageNumber: chunk.metadata.pageNumber,
            chapter: chunk.metadata.chapter,
            section: chunk.metadata.section,
            tags: chunk.metadata.tags,
          },
        }));

        // 批量添加到 FAISS
        if (documents.length > 0) {
          await this.vectorStore.addDocuments(documents);
          // 保存索引到磁盘
          await this.vectorStore.saveToDisk(path.join(this.faissStoragePath, 'index'));
        }

        console.log(`✅ Stored ${documents.length} chunks for document ${documentId} (FAISS)`);
      } 
      // 检查 Chroma DB 是否已初始化
      else if (chromaCollection) {
        // 准备数据
        const ids = chunks.map((chunk) => chunk.id);
        const metadatas = chunks.map((chunk) => ({
          id: chunk.id,
          documentId: chunk.documentId,
          chunkId: chunk.id,
          pageNumber: chunk.metadata.pageNumber,
          chapter: chunk.metadata.chapter,
          section: chunk.metadata.section,
          tags: chunk.metadata.tags,
        }));
        const documents = chunks.map((chunk) => chunk.content);
        const embeddings = await this.embeddings.embedDocuments(documents);

        // 添加到 Chroma DB
        await chromaCollection.add({
          ids,
          metadatas,
          documents,
          embeddings,
        });

        console.log(`✅ Stored ${chunks.length} chunks for document ${documentId} (Chroma DB)`);
      } else {
        // 使用内存存储
        console.log(`✅ Stored ${chunks.length} chunks for document ${documentId} (in-memory)`);
      }
    } catch (error) {
      console.error('❌ Failed to store chunks:', error);
      throw error;
    }
  }

  /**
   * 根据文档ID获取所有块
   * @param documentId 文档ID
   */
  async getChunksByDocument(documentId: string): Promise<DocumentChunk[]> {
    try {
      // 从缓存中获取
      if (this.documentChunksMap.has(documentId)) {
        return this.documentChunksMap.get(documentId)!;
      }

      // 从 FAISS 中搜索
      // 注意：FAISS 不支持按元数据过滤，所以我们需要从缓存或重新构建
      // 这里返回空数组，实际应用中可能需要更复杂的实现
      return [];
    } catch (error) {
      console.error('❌ Failed to get chunks by document:', error);
      return [];
    }
  }

  /**
   * 根据块ID获取单个块
   * @param chunkId 块ID
   */
  async getChunk(chunkId: string): Promise<DocumentChunk | undefined> {
    try {
      // 遍历所有文档的块
      for (const chunks of this.documentChunksMap.values()) {
        const chunk = chunks.find((c) => c.id === chunkId);
        if (chunk) {
          return chunk;
        }
      }

      return undefined;
    } catch (error) {
      console.error('❌ Failed to get chunk:', error);
      return undefined;
    }
  }

  /**
   * 相似度搜索
   * @param queryEmbedding 查询向量
   * @param options 搜索选项
   */
  async similaritySearch(
    queryEmbedding: number[],
    options: {
      topK?: number;
      threshold?: number;
      documentId?: string;
      filter?: {
        tags?: string[];
        chapter?: string;
      };
    } = {},
  ): Promise<Array<{ chunk: DocumentChunk; score: number }>> {
    try {
      const { topK = 5, threshold = 0.7, documentId } = options;

      // 检查 FAISS 是否已初始化
      if (FaissStore && this.vectorStore) {
        // 执行相似度搜索
        const results = await this.vectorStore.similaritySearchVectorWithScore(
          queryEmbedding,
          topK,
        );

        // 转换结果
        const searchResults: Array<{ chunk: DocumentChunk; score: number }> = [];
        
        for (const [doc, score] of results) {
          if (score >= threshold) {
            const metadata = doc.metadata as any;
            
            // 构建 DocumentChunk
            const chunk: DocumentChunk = {
              id: metadata.id,
              documentId: metadata.documentId,
              content: doc.pageContent,
              embedding: queryEmbedding, // 使用查询向量作为嵌入向量（实际应用中可能需要存储原始嵌入向量）
              metadata: {
                pageNumber: metadata.pageNumber,
                chapter: metadata.chapter,
                section: metadata.section,
                tags: metadata.tags,
              },
            };

            searchResults.push({ chunk, score });
          }
        }

        return searchResults;
      } 
      // 检查 Chroma DB 是否已初始化
      else if (chromaCollection) {
        // 执行相似度搜索
        const results = await chromaCollection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: topK,
          where: documentId ? { documentId } : undefined,
        });

        // 转换结果
        const searchResults: Array<{ chunk: DocumentChunk; score: number }> = [];
        
        if (results && results.ids && results.ids[0]) {
          for (let i = 0; i < results.ids[0].length; i++) {
            const score = results.distances[0][i];
            const document = results.documents[0][i];
            const metadata = results.metadatas[0][i];

            if (score <= (1 - threshold)) { // Chroma 返回距离，需要转换为相似度
              // 构建 DocumentChunk
              const chunk: DocumentChunk = {
                id: metadata.id,
                documentId: metadata.documentId,
                content: document,
                embedding: queryEmbedding,
                metadata: {
                  pageNumber: metadata.pageNumber,
                  chapter: metadata.chapter,
                  section: metadata.section,
                  tags: metadata.tags,
                },
              };

              searchResults.push({ chunk, score: 1 - score }); // 转换距离为相似度
            }
          }
        }

        return searchResults;
      } else {
        // 使用内存存储进行简单的相似度搜索
        return this.inMemorySimilaritySearch(queryEmbedding, options);
      }
    } catch (error) {
      console.error('❌ Failed to perform similarity search:', error);
      // 回退到内存搜索
      return this.inMemorySimilaritySearch(queryEmbedding, options);
    }
  }

  /**
   * 内存中的相似度搜索
   * @param queryEmbedding 查询向量
   * @param options 搜索选项
   */
  private async inMemorySimilaritySearch(
    queryEmbedding: number[],
    options: {
      topK?: number;
      threshold?: number;
      documentId?: string;
      filter?: {
        tags?: string[];
        chapter?: string;
      };
    } = {},
  ): Promise<Array<{ chunk: DocumentChunk; score: number }>> {
    const { topK = 5, threshold = 0.7, documentId } = options;

    const results: Array<{ chunk: DocumentChunk; score: number }> = [];

    // 遍历所有文档块
    for (const [docId, chunks] of this.documentChunksMap.entries()) {
      // 文档过滤
      if (documentId && docId !== documentId) continue;

      for (const chunk of chunks) {
        if (chunk.embedding) {
          // 计算余弦相似度
          const score = this.cosineSimilarity(queryEmbedding, chunk.embedding);

          if (score >= threshold) {
            results.push({ chunk, score });
          }
        }
      }
    }

    // 按相似度排序
    results.sort((a, b) => b.score - a.score);

    // 返回 topK 结果
    return results.slice(0, topK);
  }

  /**
   * 计算余弦相似度
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
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

  /**
   * 删除文档的所有块
   * @param documentId 文档ID
   */
  async deleteDocument(documentId: string): Promise<void> {
    try {
      // 从缓存中删除
      this.documentChunksMap.delete(documentId);

      // 检查 FAISS 是否已初始化
      if (FaissStore && this.vectorStore) {
        // 注意：FAISS 不支持按元数据删除，所以我们需要：
        // 1. 获取所有文档
        // 2. 过滤掉要删除的文档
        // 3. 重新创建 FAISS 索引
        const documents = await this.vectorStore.similaritySearch(' ', 10000);
        const filteredDocuments = documents.filter((doc: Document) => {
          const metadata = doc.metadata as any;
          return metadata.documentId !== documentId;
        });

        // 重新创建 FAISS 索引
        this.vectorStore = await FaissStore.fromDocuments(filteredDocuments, this.embeddings);
        // 保存索引到磁盘
        await this.vectorStore.saveToDisk(path.join(this.faissStoragePath, 'index'));

        console.log(`✅ Deleted document ${documentId} from FAISS`);
      } 
      // 检查 Chroma DB 是否已初始化
      else if (chromaCollection) {
        // 先查询该文档的所有块
        const results = await chromaCollection.query({
          queryTexts: [' '], // 空查询，匹配所有
          nResults: 10000,
          where: { documentId },
        });

        if (results && results.ids && results.ids[0] && results.ids[0].length > 0) {
          // 删除这些块
          await chromaCollection.delete({
            ids: results.ids[0],
          });

          console.log(`✅ Deleted document ${documentId} from Chroma DB`);
        }
      } else {
        // 使用内存存储
        console.log(`✅ Deleted document ${documentId} from in-memory storage`);
      }
    } catch (error) {
      console.error('❌ Failed to delete document:', error);
    }
  }

  /**
   * 获取存储统计
   */
  async getStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    totalEmbeddings: number;
  }> {
    try {
      // 计算唯一文档数
      const documentIds = new Set<string>();
      for (const chunks of this.documentChunksMap.values()) {
        chunks.forEach((chunk) => {
          documentIds.add(chunk.documentId);
        });
      }

      // 计算总块数
      let totalChunks = 0;
      for (const chunks of this.documentChunksMap.values()) {
        totalChunks += chunks.length;
      }

      return {
        totalDocuments: documentIds.size,
        totalChunks,
        totalEmbeddings: totalChunks, // 每个 chunk 对应一个 embedding
      };
    } catch (error) {
      console.error('❌ Failed to get stats:', error);
      return {
        totalDocuments: 0,
        totalChunks: 0,
        totalEmbeddings: 0,
      };
    }
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    try {
      // 检查 FAISS 是否已初始化
      if (FaissStore && this.vectorStore) {
        // 创建新的 FAISS 索引
        this.vectorStore = await FaissStore.fromDocuments([], this.embeddings);
        // 保存索引到磁盘
        await this.vectorStore.saveToDisk(path.join(this.faissStoragePath, 'index'));

        console.log('✅ Cleared all data from FAISS');
      } 
      // 检查 Chroma DB 是否已初始化
      else if (chromaCollection) {
        // 删除并重新创建集合
        await chromaClient.deleteCollection({
          name: 'document_chunks'
        });

        chromaCollection = await chromaClient.getOrCreateCollection({
          name: 'document_chunks',
          metadata: {
            description: 'Document chunks for RAG system'
          }
        });

        console.log('✅ Cleared all data from Chroma DB');
      } else {
        console.log('✅ Cleared all data from in-memory storage');
      }

      // 清空缓存
      this.documentChunksMap.clear();
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      // 至少清空内存缓存
      this.documentChunksMap.clear();
      throw error;
    }
  }
}
