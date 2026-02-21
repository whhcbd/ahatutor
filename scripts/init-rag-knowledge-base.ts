import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { RAGModule } from '../src/backend/src/modules/rag/rag.module';
import { RAGService } from '../src/backend/src/modules/rag/services/rag.service';
import * as fs from 'fs';
import * as path from 'path';

async function initializeKnowledgeBase() {
  console.log('🚀 开始初始化RAG知识库...\n');

  let app: INestApplication | null = null;

  try {
    app = await NestFactory.create(RAGModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    const ragService = app.get(RAGService);

    const fullPath = 'C:/Users/16244/MinerU/遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24/full.md';

    if (!fs.existsSync(fullPath)) {
      throw new Error(`文件不存在: ${fullPath}`);
    }

    console.log(`📄 读取文件: ${fullPath}`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const stats = fs.statSync(fullPath);
    console.log(`   文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB\n`);

    console.log('📤 上传文档到RAG知识库...');
    const uploadResult = await ragService.uploadDocument({
      name: '遗传学（第4版）- 刘祖洞',
      type: 'text',
      content,
      metadata: {
        title: '遗传学（第4版）',
        author: '刘祖洞、吴燕华、乔守怡、赵寿元',
        publisher: '高等教育出版社',
        year: '2021',
        source: 'MinerU解析',
        type: 'textbook',
        topics: ['遗传学', '生物学', '教材'],
        originalPath: fullPath,
      },
    });

    console.log(`\n✅ 文档上传成功!`);
    console.log(`   文档ID: ${uploadResult.id}`);
    console.log(`   文档名称: ${uploadResult.name}`);
    console.log(`   状态: ${uploadResult.status}`);
    console.log(`   分块数量: ${uploadResult.chunkCount}`);
    console.log(`   处理时间: ${uploadResult.processedAt}\n`);

    console.log('📊 知识库统计信息:');
    const statsResult = await ragService.getStats();
    console.log(`   总文档数: ${statsResult.totalDocuments}`);
    console.log(`   总分块数: ${statsResult.totalChunks}`);
    console.log(`   总向量数: ${statsResult.totalEmbeddings}\n`);

    console.log('✨ RAG知识库初始化完成!\n');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
  }
}

initializeKnowledgeBase();
