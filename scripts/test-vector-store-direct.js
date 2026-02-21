// 直接测试向量存储服务
const { VectorStoreService } = require('./../src/backend/src/modules/rag/services/vector-store.service');

async function testVectorStoreDirect() {
  console.log('=== Testing Vector Store Service Directly ===');

  try {
    // 创建向量存储服务实例
    const vectorStoreService = new VectorStoreService();

    // 初始化服务
    console.log('\n1. Initializing VectorStoreService...');
    await vectorStoreService.onModuleInit();
    console.log('✅ VectorStoreService initialized successfully');

    // 测试存储文档块
    console.log('\n2. Testing storeChunks...');
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
      }
    ];

    await vectorStoreService.storeChunks(testDocumentId, testChunks);
    console.log('✅ storeChunks test passed');

    // 测试获取文档块
    console.log('\n3. Testing getChunksByDocument...');
    const retrievedChunks = await vectorStoreService.getChunksByDocument(testDocumentId);
    console.log(`✅ Retrieved ${retrievedChunks.length} chunks`);

    // 测试获取统计信息
    console.log('\n4. Testing getStats...');
    const stats = await vectorStoreService.getStats();
    console.log('✅ getStats test passed:');
    console.log(`  Total documents: ${stats.totalDocuments}`);
    console.log(`  Total chunks: ${stats.totalChunks}`);

    // 测试删除文档
    console.log('\n5. Testing deleteDocument...');
    await vectorStoreService.deleteDocument(testDocumentId);
    console.log('✅ deleteDocument test passed');

    // 测试清空所有数据
    console.log('\n6. Testing clear...');
    await vectorStoreService.clear();
    console.log('✅ clear test passed');

    console.log('\n🎉 All direct tests passed! VectorStoreService is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error stack:', error.stack);
  }
}

testVectorStoreDirect();
