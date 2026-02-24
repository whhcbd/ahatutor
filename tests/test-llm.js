const { LLMService } = require('./src/backend/dist/backend/src/modules/llm/llm.service');
const { OpenAIProvider } = require('./src/backend/dist/backend/src/modules/llm/providers/openai.provider');
const { ClaudeProvider } = require('./src/backend/dist/backend/src/modules/llm/providers/claude.provider');
const { DeepSeekProvider } = require('./src/backend/dist/backend/src/modules/llm/providers/deepseek.provider');
const { GLMProvider } = require('./src/backend/dist/backend/src/modules/llm/providers/glm.provider');
const { MockProvider } = require('./src/backend/dist/backend/src/modules/llm/providers/mock.provider');

// 创建测试实例
const llmService = new LLMService(
  new OpenAIProvider(),
  new ClaudeProvider(),
  new DeepSeekProvider(),
  new GLMProvider(),
  new MockProvider()
);

// 测试chat方法
async function testChat() {
  console.log('Testing chat method...');
  try {
    const messages = [
      {
        role: 'user',
        content: '什么是孟德尔分离定律？'
      }
    ];
    
    const response = await llmService.chat(messages, { provider: 'mock' });
    console.log('Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 测试structuredChat方法
async function testStructuredChat() {
  console.log('\nTesting structuredChat method...');
  try {
    const messages = [
      {
        role: 'user',
        content: '你是遗传学教育专家。用户问题：什么是孟德尔分离定律？请提供详细回答。'
      }
    ];
    
    const schema = {
      type: 'object',
      properties: {
        textAnswer: { type: 'string' },
        needVisualization: { type: 'boolean' },
        followUpQuestions: { type: 'array', items: { type: 'string' } }
      },
      required: ['textAnswer', 'needVisualization', 'followUpQuestions']
    };
    
    const response = await llmService.structuredChat(messages, schema, { provider: 'mock' });
    console.log('Structured Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 运行测试
testChat();
testStructuredChat();