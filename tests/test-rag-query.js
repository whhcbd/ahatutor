const API_URL = 'http://localhost:3001/api/rag/query';

async function queryRAG() {
  console.log('🔍 测试RAG知识库查询...\n');

  try {
    const queries = [
      '孟德尔分离定律',
      '基因传递',
      '减数分裂',
      '伴性遗传',
    ];

    for (const query of queries) {
      console.log(`\n查询: ${query}`);
      console.log('─'.repeat(50));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          topK: 3,
          threshold: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`查询失败: ${response.status}`);
      }

      const result = await response.json();

      console.log(`找到 ${result.results.length} 个相关结果:`);
      if (result.results.length > 0) {
        result.results.forEach((item, index) => {
          console.log(`\n[${index + 1}] 相似度: ${(item.score * 100).toFixed(1)}%`);
          console.log(`    内容: ${item.content.substring(0, 150)}...`);
        });
      }
    }

    console.log('\n✅ RAG查询测试完成!\n');

  } catch (error) {
    console.error('❌ 查询失败:', error.message);
    process.exit(1);
  }
}

queryRAG();
