const axios = require('axios');

// API 基础 URL
const API_BASE_URL = 'http://localhost:3001/api/rag';

// 检查知识库状态
async function checkRAGStats() {
  console.log('🔍 检查 RAG 向量知识库状态...\n');

  try {
    // 获取知识库统计信息
    console.log('1. 获取知识库统计信息...');
    const statsResponse = await axios.get(`${API_BASE_URL}/stats`);
    const stats = statsResponse.data;
    
    console.log(`✅ 知识库统计:`);
    console.log(`   总文档数: ${stats.totalDocuments}`);
    console.log(`   总块数: ${stats.totalChunks}`);
    console.log(`   总嵌入数: ${stats.totalEmbeddings}`);
    
    // 检查是否为空
    if (stats.totalDocuments === 0 && stats.totalChunks === 0 && stats.totalEmbeddings === 0) {
      console.log('\n⚠️  知识库为空！');
    } else {
      console.log('\n✅ 知识库非空，包含以下内容:');
      
      // 获取所有文档
      console.log('\n2. 获取所有文档...');
      const documentsResponse = await axios.get(`${API_BASE_URL}/documents`);
      const documents = documentsResponse.data;
      
      console.log(`找到 ${documents.length} 个文档:`);
      documents.forEach((doc, index) => {
        console.log(`\n${index + 1}. 文档ID: ${doc.id}`);
        console.log(`   文档名称: ${doc.name}`);
        console.log(`   文档类型: ${doc.type}`);
        console.log(`   文档状态: ${doc.status}`);
        console.log(`   分块数量: ${doc.chunkCount}`);
        console.log(`   上传时间: ${doc.uploadedAt}`);
      });
    }

    console.log('\n🎉 知识库状态检查完成！');

  } catch (error) {
    console.error('❌ 检查失败:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

// 运行检查
checkRAGStats();
