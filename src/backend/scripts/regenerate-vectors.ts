import { EnhancedLocalEmbeddingService } from '../src/modules/rag/services/enhanced-local-embedding.service';
import * as fs from 'fs';
import * as path from 'path';

interface ChunkData {
  id: string;
  content: string;
  chapter?: string;
  section?: string;
  subsection?: string;
  chunkType?: string;
  level?: number;
}

async function regenerateVectors() {
  console.log('🚀 开始重新生成向量...\n');

  try {
    // 1. 加载embedding模型
    const embedding = new EnhancedLocalEmbeddingService();
    
    console.log('⏳ 正在初始化本地embedding模型...');
    console.log('   首次运行需要下载模型，请耐心等待...\n');
    
    await embedding.initialize();
    
    const modelInfo = embedding.getModelInfo();
    console.log(`✅ 模型加载成功`);
    console.log(`   模型名称: ${modelInfo.modelName}`);
    console.log(`   向量维度: ${modelInfo.dimension}`);
    console.log(`   量化模型: ${modelInfo.quantized ? '是' : '否'}\n`);

    // 2. 加载chunks
    const basePath = path.join(process.cwd(), 'data', 'external', 'genetics-rag');
    const chunksPath = path.join(basePath, 'chunks_fine_grained_simplified.json');
    
    if (!fs.existsSync(chunksPath)) {
      console.error(`❌ 找不到chunks文件: ${chunksPath}`);
      process.exit(1);
    }

    console.log(`📂 加载chunks文件: ${chunksPath}`);
    const chunks: ChunkData[] = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
    console.log(`✅ 加载了 ${chunks.length} 个chunks\n`);

    // 3. 批量生成向量
    const batchSize = 32;
    const allVectors: Array<{ id: string; vector: number[] }> = [];
    
    console.log(`🔄 开始批量生成向量 (批次大小: ${batchSize})...\n`);
    
    const startTime = Date.now();
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const batchTexts = batch.map(c => c.content);
      
      const vectors = await embedding.embedBatch(batchTexts);

      for (let j = 0; j < batch.length; j++) {
        allVectors.push({
          id: batch[j].id,
          vector: vectors[j]
        });
      }

      const progress = Math.min(i + batchSize, chunks.length);
      const percent = Math.round(progress / chunks.length * 100);
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = progress / elapsed;
      const remaining = (chunks.length - progress) / speed;
      
      console.log(`   进度: ${progress}/${chunks.length} (${percent}%) | 速度: ${speed.toFixed(1)} 个/秒 | 剩余: ${Math.round(remaining)}秒`);
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n✅ 向量生成完成！`);
    console.log(`   总耗时: ${elapsed}秒`);
    console.log(`   平均速度: ${(chunks.length / elapsed).toFixed(1)} 个/秒\n`);

    // 4. 保存向量
    const outputPath = path.join(basePath, `vectors_local_${modelInfo.dimension}d.json`);
    
    console.log(`💾 保存向量到: ${outputPath}`);
    fs.writeFileSync(outputPath, JSON.stringify(allVectors, null, 2));
    
    const fileSize = fs.statSync(outputPath).size / (1024 * 1024);
    console.log(`✅ 保存成功！`);
    console.log(`   文件大小: ${fileSize.toFixed(2)} MB`);
    console.log(`   向量数量: ${allVectors.length}`);
    console.log(`   向量维度: ${modelInfo.dimension}\n`);

    // 5. 更新配置提示
    console.log('📋 请更新 .env 配置文件:\n');
    console.log(`RAG_VECTORS_FILE=${outputPath}`);
    console.log(`RAG_EMBEDDING_DIMENSIONS=${modelInfo.dimension}\n`);
    
    console.log('📋 可选：使用中文优化模型重新生成:\n');
    console.log('   修改 .env:');
    console.log('   LOCAL_EMBEDDING_MODEL=Xenova/bge-base-zh-v1.5');
    console.log('   然后重新运行此脚本\n');

  } catch (error) {
    console.error('\n❌ 发生错误:', error);
    process.exit(1);
  }
}

regenerateVectors();
