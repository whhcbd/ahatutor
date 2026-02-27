export interface A2UIComponent {
  type: string;
  id: string;
  properties: Record<string, any>;
  metadata?: Record<string, any>;
  dataRef?: string;
  children?: string[];
  child?: string;
}

export interface BoundValue {
  path?: string;
  literalString?: string;
  literalNumber?: number;
  literalBoolean?: boolean;
}

export interface ChildrenReference {
  explicitList?: string[];
  template?: {
    dataBinding: string;
    componentId: string;
  };
}

export interface A2UIPayload {
  version: string;
  surface: {
    rootId: string;
    components: Record<string, A2UIComponent>;
  };
  dataModel: Record<string, any>;
  metadata?: {
    templateId?: string;
    generatedAt?: string;
    version?: string;
    fallbackLevel?: number;
    fallbackReason?: string;
  };
}

export type A2UIMessage = 
  | SurfaceUpdateMessage
  | DataModelUpdateMessage
  | BeginRenderingMessage
  | DeleteSurfaceMessage;

export interface SurfaceUpdateMessage {
  surfaceUpdate: {
    surfaceId: string;
    components: Array<{
      id: string;
      component: Record<string, any>;
    }>;
  };
}

export interface DataModelUpdateMessage {
  dataModelUpdate: {
    surfaceId: string;
    path?: string;
    contents: Array<{
      key: string;
      valueString?: string;
      valueNumber?: number;
      valueBoolean?: boolean;
      valueMap?: any;
    }>;
  };
}

export interface BeginRenderingMessage {
  beginRendering: {
    surfaceId: string;
    root: string;
    catalogId?: string;
    styles?: Record<string, any>;
  };
}

export interface DeleteSurfaceMessage {
  deleteSurface: {
    surfaceId: string;
  };
}

export interface A2UIEvent {
  type: string;
  componentId: string;
  data?: Record<string, any>;
  timestamp: number;
}

export interface A2UIStreamingChunk {
  type: 'text' | 'component' | 'metadata';
  content?: string;
  component?: A2UIComponent;
  metadata?: Record<string, any>;
  chunkIndex: number;
  totalChunks: number;
}

export interface A2UIParseResult {
  directives: Array<{
    type: string;
    content: any;
    startIndex: number;
    endIndex: number;
  }>;
  cleanedText: string;
  payloads: A2UIPayload[];
}

export interface ComponentCatalog {
  version: string;
  components: Record<string, ComponentDefinition>;
}

export interface ComponentDefinition {
  type: string;
  version: string;
  displayName: string;
  description?: string;
  allowedProps: string[];
  allowedEvents: string[];
  requiresAuth?: boolean;
  dataBinding?: boolean;
  metadata?: {
    author?: string;
    category?: string;
    tags?: string[];
  };
}

export interface UserAction {
  actionId: string;
  componentId: string;
  actionType: 'click' | 'change' | 'submit' | 'focus' | 'blur' | 'input';
  payload?: Record<string, any>;
  messageId: string;
  timestamp: number;
  sessionId?: string;
}
