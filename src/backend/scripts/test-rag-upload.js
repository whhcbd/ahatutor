const fs = require('fs');

const API_URL = 'http://localhost:3001/api/rag/documents';

async function uploadTestDocument() {
  console.log('🚀 开始上传测试文档到RAG知识库...\n');

  try {
    const requestBody = {
      name: '测试文档',
      type: 'text',
      content: '这是一个测试文档。孟德尔第一定律（分离定律）指出：在生物体的体细胞中，控制同一性状的遗传因子成对存在，互不融合；在形成配子时，成对的遗传因子发生分离，分离后的遗传因子分别进入不同的配子中，随配子遗传给后代。',
      metadata: {
        title: '测试文档',
        type: 'test',
        topics: ['遗传学', '测试'],
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

uploadTestDocument();
