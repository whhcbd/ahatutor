export declare enum DocumentType {
    PDF = "pdf",
    WORD = "word",
    MARKDOWN = "markdown",
    TEXT = "text"
}
export declare enum DocumentStatus {
    UPLOADING = "uploading",
    PARSING = "parsing",
    VECTORIZING = "vectorizing",
    READY = "ready",
    ERROR = "error"
}
export interface DocumentChunk {
    id: string;
    documentId: string;
    content: string;
    metadata: {
        pageNumber?: number;
        chapter?: string;
        section?: string;
        tags?: string[];
    };
    embedding?: number[];
}
export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    status: DocumentStatus;
    size: number;
    uploadedAt: Date;
    processedAt?: Date;
    chunks: DocumentChunk[];
    metadata: {
        source?: string;
        author?: string;
        title?: string;
    };
}
export interface QueryOptions {
    topK?: number;
    threshold?: number;
    filter?: {
        documentId?: string;
        tags?: string[];
        chapter?: string;
    };
}
export interface QueryResult {
    chunk: DocumentChunk;
    score: number;
    relevance: 'high' | 'medium' | 'low';
}
export declare enum MessageRole {
    SYSTEM = "system",
    USER = "user",
    ASSISTANT = "assistant"
}
export interface Message {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    imageUrl?: string;
}
export interface ChatSession {
    id: string;
    userId: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    metadata: {
        topic?: string;
        mode?: 'speed' | 'depth';
    };
}
export interface RAGServiceConfig {
    vectorStore: {
        type: 'pinecone' | 'weaviate';
        apiKey: string;
        environment?: string;
        indexName: string;
    };
    embedding: {
        provider: 'openai' | 'cohere';
        model: string;
        dimensions: number;
    };
    chunkSize: number;
    chunkOverlap: number;
}
export interface StreamResponse {
    content: string;
    done: boolean;
    sources?: QueryResult[];
}
