const API_URL = 'http://localhost:3001/api/llm/embed';

async function testEmbedding() {
  console.log('🧪 测试Embedding生成...\n');

  try {
    const testTexts = [
      '孟德尔分离定律',
      '基因传递给后代',
      '减数分裂过程',
      '伴性遗传特点',
    ];

    for (const text of testTexts) {
      console.log(`\n测试文本: ${text}`);
      console.log('─'.repeat(50));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`Embedding失败: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Embedding长度: ${result.embedding.length}`);
      console.log(`前5个值: [${result.embedding.slice(0, 5).join(', ')}]`);
      console.log(`是否全为0: ${result.embedding.every(v => v === 0)}`);
    }

    console.log('\n✅ Embedding测试完成!\n');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

testEmbedding();
