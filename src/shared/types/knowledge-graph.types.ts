export interface KnowledgeGraphNode {
  id: string;
  label: string;
  category: string;
  description?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  importance: number;
  relatedConcepts?: string[];
  metadata?: {
    topics?: string[];
    chapters?: string[];
    sections?: string[];
  };
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'prerequisite' | 'related' | 'causal' | 'hierarchical';
  weight: number;
  description?: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  clusters?: {
    id: string;
    name: string;
    nodes: string[];
    color: string;
  }[];
}

export interface KnowledgeGraphQuery {
  rootConcept?: string;
  depth?: number;
  categories?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  includeRelated?: boolean;
}

export interface KnowledgeGraphNodeDetail {
  node: KnowledgeGraphNode;
  connections: Array<{
    node: KnowledgeGraphNode;
    edge: KnowledgeGraphEdge;
  }>;
  relatedContent?: Array<{
    chunkId: string;
    content: string;
    relevance: number;
  }>;
}
