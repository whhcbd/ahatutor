export interface LearningProgress {
  id: string;
  userId: string;
  conceptId: string;
  conceptName: string;
  masteryLevel: number;
  lastStudiedAt: Date;
  studyCount: number;
  totalStudyTime: number;
  quizResults: QuizResult[];
  notes?: string;
  tags?: string[];
}

export interface QuizResult {
  id: string;
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  answeredAt: Date;
  timeSpent: number;
}

export interface StudySession {
  id: string;
  userId: string;
  mode: 'speed' | 'depth' | 'practice';
  conceptId?: string;
  conceptName?: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
}

export interface UserStats {
  userId: string;
  totalStudyTime: number;
  totalSessions: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  masteredConcepts: string[];
  weakConcepts: string[];
}

export interface CreateProgressDto {
  conceptId: string;
  conceptName: string;
  masteryLevel?: number;
  notes?: string;
  tags?: string[];
}

export interface UpdateProgressDto {
  masteryLevel?: number;
  notes?: string;
  tags?: string[];
}

export interface CreateSessionDto {
  mode: 'speed' | 'depth' | 'practice';
  conceptId?: string;
  conceptName?: string;
}

export interface UpdateSessionDto {
  endedAt?: Date;
  duration?: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  accuracy?: number;
}
