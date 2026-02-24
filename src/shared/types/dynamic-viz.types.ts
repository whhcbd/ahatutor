export interface VisualizationTemplate {
  templateId: string;
  concept: string;
  conceptKeywords: string[];
  vizType: string;
  vizCategory: string;
  title: string;
  description: string;
  applicableScenarios: string[];
  templateStructure: any;
  dataGenerationRules: any;
  styling: any;
  educationalAids: any;
  metadata: any;
  vector?: number[];
}

export interface VisualizationTemplateMatch {
  template: VisualizationTemplate;
  similarity: number;
  matchReason: string;
}

export interface DynamicVizInput {
  question: string;
  concept?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface DynamicVizResponse {
  visualizationApplicable: boolean;
  applicableReason: string;
  selectedTemplate?: {
    templateId: string;
    reason: string;
  };
  extractedData?: Record<string, any>;
  visualizationData?: any;
  textAnswer?: {
    mainAnswer: string;
    keyPoints: string[];
    examples: string[];
    commonMistakes: string[];
  };
  educationalAids?: {
    keyPoints: string[];
    visualConnection: string;
    commonMistakes: string[];
    thinkingProcess: string[];
  };
  citations?: Citation[];
}

export interface Citation {
  chunkId: string;
  content: string;
  chapter: string;
  section: string;
}
