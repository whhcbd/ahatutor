const API_URL = 'http://localhost:3001/api/rag/query';

async function queryRAG() {
  console.log('🔍 测试RAG知识库查询（低阈值）...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '孟德尔分离定律是什么？',
        topK: 5,
        threshold: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`查询失败: ${response.status}`);
    }

    const result = await response.json();

    console.log(`找到 ${result.results.length} 个相关结果:`);
    result.results.forEach((item, index) => {
      console.log(`\n[${index + 1}] 相似度: ${(item.score * 100).toFixed(1)}%`);
      console.log(`    内容: ${item.content.substring(0, 200)}...`);
      console.log(`    文档: ${item.documentId}`);
      console.log(`    元数据: ${JSON.stringify(item.metadata)}`);
    });

    console.log('\n✅ RAG查询测试完成!\n');

  } catch (error) {
    console.error('❌ 查询失败:', error.message);
    process.exit(1);
  }
}

queryRAG();
