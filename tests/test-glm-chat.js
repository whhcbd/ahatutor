const API_URL = 'http://localhost:3001/api/llm/chat';

async function testGLMChat() {
  console.log('💬 测试GLM Chat功能...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: '请简要解释孟德尔分离定律'
          }
        ],
        provider: 'glm',
        temperature: 0.7,
        maxTokens: 500
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Chat失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Chat响应:');
    console.log(result.content);
    console.log('\n✅ GLM Chat测试完成!\n');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

testGLMChat();
