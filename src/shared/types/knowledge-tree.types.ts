/**
 * 知识树相关类型定义
 */

// 知识节点类型
export enum KnowledgeNodeType {
  CONCEPT = 'concept',
  PRINCIPLE = 'principle',
  FORMULA = 'formula',
  EXAMPLE = 'example',
  MISCONCEPTION = 'misconception',
}

// 知识节点状态
export enum NodeStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  MASTERED = 'mastered',
  REVIEW_NEEDED = 'review_needed',
}

// 知识节点
export interface KnowledgeNode {
  id: string;
  name: string;
  type: KnowledgeNodeType;
  level: number; // 0 = 基础概念，越大越高级
  status: NodeStatus;
  mastery: number; // 0-100
  prerequisites: string[]; // 前置节点 ID 列表
  children: string[]; // 子节点 ID 列表
  metadata: {
    domain?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    estimatedTime?: number; // 分钟
    lastReviewed?: Date;
    nextReview?: Date; // 艾宾浩斯复习计划
  };
}

// 知识树
export interface KnowledgeTree {
  id: string;
  name: string;
  domain: string; // 如 'genetics'
  nodes: Map<string, KnowledgeNode>;
  rootNodes: string[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    totalNodes: number;
    masteredNodes: number;
  };
}

// 学习路径
export interface LearningPath {
  id: string;
  name: string;
  targetNode: string; // 目标节点 ID
  path: string[]; // 节点 ID 序列
  estimatedTime: number;
  progress: number; // 0-100
  currentIndex: number;
  completedNodes: string[];
}

// 艾宾浩斯复习间隔（天）
export const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30, 60, 120];

// 复习计划
export interface ReviewPlan {
  userId: string;
  nodeId: string;
  interval: number;
  easeFactor: number; // SuperMemo 算法
  nextReview: Date;
  reviewCount: number;
  lastReview?: Date;
}

// 学习会话
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
  mistakes: string[]; // 错题 ID 列表
}
