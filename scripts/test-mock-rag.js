const axios = require('axios');

// API 基础 URL
const API_BASE_URL = 'http://localhost:3001/api/rag';

// 测试文档内容
const testDocument = {
  name: '遗传学基础测试文档',
  content: `# 遗传学基础

## 第一章 孟德尔定律

### 1.1 分离定律
孟德尔第一定律，也称为分离定律，是遗传学的基本定律之一。它指出在生物体的细胞中，控制同一性状的遗传因子成对存在，且不相融合。在形成配子（生殖细胞）时，成对的遗传因子彼此分离，分别进入不同的配子中，随配子遗传给后代。

### 1.2 自由组合定律
孟德尔第二定律，也称为自由组合定律，指出控制不同性状的遗传因子在配子形成时自由组合。

## 第二章 减数分裂

### 2.1 减数分裂的过程
减数分裂是一种特殊的细胞分裂方式，发生在生殖细胞的形成过程中。它包括两次连续的分裂，最终产生四个单倍体的配子。

### 2.2 减数分裂的意义
减数分裂保证了遗传物质的稳定性，同时通过同源染色体的交换和非同源染色体的自由组合，增加了遗传变异的可能性。

## 第三章 伴性遗传

### 3.1 伴性遗传的概念
伴性遗传是指基因位于性染色体上，其遗传方式与性别相关的遗传现象。

### 3.2 红绿色盲
红绿色盲是一种常见的伴X隐性遗传病，在男性中的发病率远高于女性。
`,
  metadata: {
    author: '测试作者',
    source: '测试来源',
    tags: ['遗传学', '孟德尔定律', '减数分裂', '伴性遗传']
  }
};

// 测试查询
const testQueries = [
  '孟德尔分离定律',
  '减数分裂的过程',
  '伴性遗传',
  '红绿色盲'
];

// 测试函数
async function testRAG() {
  console.log('🔍 测试 Mock Embedding 的 RAG 功能...\n');

  try {
    // 1. 上传测试文档
    console.log('1. 上传测试文档...');
    const uploadResponse = await axios.post(`${API_BASE_URL}/documents`, testDocument);
    const documentId = uploadResponse.data.id;
    console.log(`✅ 文档上传成功！文档ID: ${documentId}\n`);

    // 2. 获取文档状态
    console.log('2. 获取文档状态...');
    const documentResponse = await axios.get(`${API_BASE_URL}/documents/${documentId}`);
    console.log(`✅ 文档状态: ${documentResponse.data.status}`);
    console.log(`   文档名称: ${documentResponse.data.name}`);
    console.log(`   分块数量: ${documentResponse.data.chunkCount}`);
    console.log(`   上传时间: ${documentResponse.data.uploadedAt}`);
    console.log(`   处理时间: ${documentResponse.data.processedAt || 'N/A'}\n`);

    // 3. 获取知识库统计信息
    console.log('3. 获取知识库统计信息...');
    const statsResponse = await axios.get(`${API_BASE_URL}/stats`);
    console.log(`✅ 知识库统计:`);
    console.log(`   总文档数: ${statsResponse.data.totalDocuments}`);
    console.log(`   总块数: ${statsResponse.data.totalChunks}`);
    console.log(`   总嵌入数: ${statsResponse.data.totalEmbeddings}\n`);

    // 4. 测试查询（使用低阈值）
    console.log('4. 测试查询（使用低阈值 0.1）...');
    for (const query of testQueries) {
      console.log(`\n查询: ${query}`);
      console.log('──────────────────────────────────────────────────');

      try {
        const queryResponse = await axios.post(`${API_BASE_URL}/query`, {
          query: query,
          topK: 5,
          threshold: 0.1
        });

        console.log(`找到 ${queryResponse.data.totalResults} 个相关结果:`);
        queryResponse.data.results.forEach((result, index) => {
          console.log(`\n${index + 1}. 相似度: ${result.score.toFixed(4)}`);
          console.log(`   相关性: ${result.relevance}`);
          console.log(`   文档名称: ${result.metadata.documentName}`);
          console.log(`   内容: ${result.content.substring(0, 100)}...`);
        });
      } catch (error) {
        console.error(`查询失败: ${error.message}`);
      }
    }

    // 5. 删除测试文档
    console.log('\n5. 删除测试文档...');
    await axios.delete(`${API_BASE_URL}/documents/${documentId}`);
    console.log('✅ 测试文档已删除\n');

    console.log('🎉 RAG 功能测试完成！');
    console.log('\n总结:');
    console.log('- Mock Embedding 生成的是随机向量，相似度搜索结果也是随机的');
    console.log('- 系统的基本流程（文档上传、处理、查询）正常工作');
    console.log('- 在实际使用中，会使用真实的 Embedding 模型（如 GLM embedding-2）');
    console.log('- 真实的 Embedding 模型生成的向量是有意义的，能够捕捉文本的语义信息');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

// 运行测试
testRAG();
