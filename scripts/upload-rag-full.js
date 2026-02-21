const fs = require('fs');

const DOCUMENT_PATH = 'C:/Users/16244/MinerU/遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24/full.md';
const API_URL = 'http://localhost:3001/api/rag/documents';

async function uploadDocument() {
  console.log('🚀 开始上传遗传学教材到RAG知识库...\n');

  try {
    if (!fs.existsSync(DOCUMENT_PATH)) {
      throw new Error(`文件不存在: ${DOCUMENT_PATH}`);
    }

    const content = fs.readFileSync(DOCUMENT_PATH, 'utf-8');
    const stats = fs.statSync(DOCUMENT_PATH);
    console.log(`📄 文件大小: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

    const requestBody = {
      name: '遗传学（第4版）- 刘祖洞',
      type: 'text',
      content: content,
      metadata: {
        title: '遗传学（第4版）',
        author: '刘祖洞、吴燕华、乔守怡、赵寿元',
        publisher: '高等教育出版社',
        year: '2021',
        source: 'MinerU',
        type: 'textbook',
        topics: ['遗传学', '生物学', '教材'],
        originalPath: DOCUMENT_PATH,
      },
    };

    console.log('📤 正在上传到API...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`上传失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    console.log(`\n✅ 上传成功!`);
    console.log(`   文档ID: ${result.id}`);
    console.log(`   文档名称: ${result.name}`);
    console.log(`   状态: ${result.status}`);
    console.log(`   分块数量: ${result.chunkCount}`);
    console.log(`   处理时间: ${result.processedAt}`);

    console.log('\n📊 查看知识库统计:');
    console.log(`   GET http://localhost:3001/api/rag/stats\n`);

  } catch (error) {
    console.error('❌ 上传失败:', error.message);
    process.exit(1);
  }
}

uploadDocument();
