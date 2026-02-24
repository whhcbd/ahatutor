import { registerAs } from '@nestjs/config';

export const ragConfig = registerAs('rag', () => ({
  enabled: process.env.RAG_ENABLED === 'true',

  chunksFile: process.env.RAG_CHUNKS_FILE ||
    'c:/trae_coding/ahatutor/data/external/genetics-rag/chunks_fine_grained_simplified.json',

  vectorsFile: process.env.RAG_VECTORS_FILE ||
    'c:/trae_coding/ahatutor/data/external/genetics-rag/vectors_fine_grained.json',

  chunkSize: parseInt(process.env.RAG_CHUNK_SIZE || '700', 10),
  chunkOverlap: parseInt(process.env.RAG_CHUNK_OVERLAP || '200', 10),
  topK: parseInt(process.env.RAG_TOP_K || '5', 10),
  threshold: parseFloat(process.env.RAG_THRESHOLD || '0.7'),

  dataSource: process.env.RAG_DATA_SOURCE || 'local',
  vectorStoreType: process.env.RAG_VECTOR_STORE_TYPE || 'local',
  embeddingModel: process.env.RAG_EMBEDDING_MODEL || 'local',
  embeddingDimensions: parseInt(process.env.RAG_EMBEDDING_DIMENSIONS || '2000', 10),

  mineru: {
    baseUrl: process.env.MINERU_BASE_URL || 'http://3a092f40.r6.cpolar.cn',
    apiEndpoint: process.env.MINERU_API_ENDPOINT || '/api/convert_pdf',
    timeout: parseInt(process.env.MINERU_TIMEOUT || '600000', 10),
    useMinerU: process.env.USE_MINERU === 'true',
  },
}));
