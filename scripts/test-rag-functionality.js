const axios = require('axios');
const FormData = require('form-data');

async function testRAGFunctionality() {
  console.log('=== Testing RAG Functionality ===');

  try {
    // 测试服务器连接
    console.log('\n1. Testing server connection...');
    const healthCheck = await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running:', healthCheck.data);

    // 测试获取 RAG 统计信息
    console.log('\n2. Testing RAG stats...');
    const statsResponse = await axios.get('http://localhost:3000/api/rag/stats');
    console.log('✅ RAG stats:', statsResponse.data);

    // 测试文档上传（如果支持）
    console.log('\n3. Testing document upload...');
    const formData = new FormData();
    formData.append('file', Buffer.from('测试文档内容'), { filename: 'test.txt' });
    formData.append('documentName', 'Test Document');
    formData.append('userId', 'test-user');

    const uploadResponse = await axios.post('http://localhost:3000/api/rag/documents', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    console.log('✅ Document uploaded:', uploadResponse.data);

    // 测试相似度搜索
    console.log('\n4. Testing similarity search...');
    const searchResponse = await axios.post('http://localhost:3000/api/rag/search', {
      query: '测试',
      options: {
        topK: 3,
        threshold: 0.5,
      },
    });
    console.log('✅ Search results:', searchResponse.data);

    console.log('\n🎉 All RAG functionality tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testRAGFunctionality();
