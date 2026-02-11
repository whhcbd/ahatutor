export declare enum KnowledgeNodeType {
    CONCEPT = "concept",
    PRINCIPLE = "principle",
    FORMULA = "formula",
    EXAMPLE = "example",
    MISCONCEPTION = "misconception"
}
export declare enum NodeStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    MASTERED = "mastered",
    REVIEW_NEEDED = "review_needed"
}
export interface KnowledgeNode {
    id: string;
    name: string;
    type: KnowledgeNodeType;
    level: number;
    status: NodeStatus;
    mastery: number;
    prerequisites: string[];
    children: string[];
    metadata: {
        domain?: string;
        difficulty?: 'easy' | 'medium' | 'hard';
        estimatedTime?: number;
        lastReviewed?: Date;
        nextReview?: Date;
    };
}
export interface KnowledgeTree {
    id: string;
    name: string;
    domain: string;
    nodes: Map<string, KnowledgeNode>;
    rootNodes: string[];
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        totalNodes: number;
        masteredNodes: number;
    };
}
export interface LearningPath {
    id: string;
    name: string;
    targetNode: string;
    path: string[];
    estimatedTime: number;
    progress: number;
    currentIndex: number;
    completedNodes: string[];
}
export declare const EBBINGHAUS_INTERVALS: number[];
export interface ReviewPlan {
    userId: string;
    nodeId: string;
    interval: number;
    easeFactor: number;
    nextReview: Date;
    reviewCount: number;
    lastReview?: Date;
}
export interface LearningSession {
    id: string;
    userId: string;
    mode: 'speed' | 'depth';
    currentNode: string;
    path: LearningPath;
    startTime: Date;
    endTime?: Date;
    questionsAnswered: number;
    correctAnswers: number;
    mistakes: string[];
}
