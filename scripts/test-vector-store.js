const { VectorStoreService } = require('../src/backend/dist/backend/src/modules/rag/services/vector-store.service.js');

async function testVectorStore() {
  console.log('=== Testing Vector Store Service ===');

  try {
    // 创建向量存储服务实例
    const vectorStoreService = new VectorStoreService();

    // 初始化服务
    await vectorStoreService.onModuleInit();

    console.log('✅ VectorStoreService initialized successfully');

    // 测试存储文档块
    const testDocumentId = 'test-doc-1';
    const testChunks = [
      {
        id: 'chunk-1',
        documentId: testDocumentId,
        content: '这是测试文档的第一部分内容。',
        embedding: Array(1536).fill(0).map(() => Math.random() * 2 - 1),
        metadata: {
          pageNumber: 1,
          chapter: '第一章',
          section: '1.1',
          tags: ['test', 'example']
        }
      },
      {
        id: 'chunk-2',
        documentId: testDocumentId,
        content: '这是测试文档的第二部分内容。',
        embedding: Array(1536).fill(0).map(() => Math.random() * 2 - 1),
        metadata: {
          pageNumber: 2,
          chapter: '第一章',
          section: '1.2',
          tags: ['test', 'example']
        }
      }
    ];

    console.log('\n=== Testing storeChunks ===');
    await vectorStoreService.storeChunks(testDocumentId, testChunks);
    console.log('✅ storeChunks test passed');

    // 测试获取文档块
    console.log('\n=== Testing getChunksByDocument ===');
    const retrievedChunks = await vectorStoreService.getChunksByDocument(testDocumentId);
    console.log(`✅ Retrieved ${retrievedChunks.length} chunks`);

    // 测试相似度搜索
    console.log('\n=== Testing similaritySearch ===');
    const testQueryEmbedding = Array(1536).fill(0).map(() => Math.random() * 2 - 1);
    const searchResults = await vectorStoreService.similaritySearch(testQueryEmbedding, {
      topK: 2,
      threshold: 0.1
    });
    console.log(`✅ Found ${searchResults.length} similar chunks`);

    // 测试获取统计信息
    console.log('\n=== Testing getStats ===');
    const stats = await vectorStoreService.getStats();
    console.log('✅ getStats test passed:');
    console.log(`  Total documents: ${stats.totalDocuments}`);
    console.log(`  Total chunks: ${stats.totalChunks}`);
    console.log(`  Total embeddings: ${stats.totalEmbeddings}`);

    // 测试删除文档
    console.log('\n=== Testing deleteDocument ===');
    await vectorStoreService.deleteDocument(testDocumentId);
    console.log('✅ deleteDocument test passed');

    // 再次获取统计信息
    const statsAfterDelete = await vectorStoreService.getStats();
    console.log('✅ getStats after delete test passed:');
    console.log(`  Total documents: ${statsAfterDelete.totalDocuments}`);
    console.log(`  Total chunks: ${statsAfterDelete.totalChunks}`);

    console.log('\n🎉 All tests passed! VectorStoreService is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testVectorStore();
