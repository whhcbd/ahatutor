import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  LearningProgress,
  QuizResult,
  StudySession,
  UserStats,
} from '@ahatutor/shared';
import {
  CreateProgressDto,
  UpdateProgressDto,
  CreateSessionDto,
  UpdateSessionDto,
  RecordQuizResultDto,
} from '../dto/progress.dto';

@Injectable()
export class ProgressService {
  private progress = new Map<string, LearningProgress>();
  private sessions = new Map<string, StudySession>();
  private stats = new Map<string, UserStats>();

  async createProgress(userId: string, dto: CreateProgressDto): Promise<LearningProgress> {
    const id = uuidv4();
    const progress: LearningProgress = {
      id,
      userId,
      conceptId: dto.conceptId,
      conceptName: dto.conceptName,
      masteryLevel: dto.masteryLevel ?? 0,
      lastStudiedAt: new Date(),
      studyCount: 0,
      totalStudyTime: 0,
      quizResults: [],
      notes: dto.notes,
      tags: dto.tags,
    };

    this.progress.set(id, progress);
    await this.updateUserStats(userId);
    return progress;
  }

  async getProgress(userId: string, conceptId?: string): Promise<LearningProgress[]> {
    const allProgress = Array.from(this.progress.values()).filter(
      (p) => p.userId === userId,
    );

    if (conceptId) {
      return allProgress.filter((p) => p.conceptId === conceptId);
    }

    return allProgress;
  }

  async getProgressById(id: string): Promise<LearningProgress> {
    const progress = this.progress.get(id);

    if (!progress) {
      throw new NotFoundException(`Progress not found: ${id}`);
    }

    return progress;
  }

  async updateProgress(id: string, dto: UpdateProgressDto): Promise<LearningProgress> {
    const progress = await this.getProgressById(id);

    const updated: LearningProgress = {
      ...progress,
      ...dto,
      lastStudiedAt: new Date(),
    };

    this.progress.set(id, updated);
    await this.updateUserStats(progress.userId);
    return updated;
  }

  async deleteProgress(id: string): Promise<void> {
    const progress = this.progress.get(id);

    if (progress) {
      this.progress.delete(id);
      await this.updateUserStats(progress.userId);
    }
  }

  async recordQuizResult(progressId: string, dto: RecordQuizResultDto): Promise<LearningProgress> {
    const progress = await this.getProgressById(progressId);

    const isCorrect = dto.isCorrect === 'true';

    const quizResult: QuizResult = {
      id: uuidv4(),
      questionId: dto.questionId,
      question: dto.question,
      userAnswer: dto.userAnswer,
      correctAnswer: dto.correctAnswer,
      isCorrect,
      answeredAt: new Date(),
      timeSpent: dto.timeSpent,
    };

    const updatedProgress: LearningProgress = {
      ...progress,
      quizResults: [...progress.quizResults, quizResult],
      lastStudiedAt: new Date(),
      studyCount: progress.studyCount + 1,
    };

    const correctCount = updatedProgress.quizResults.filter((r: QuizResult) => r.isCorrect).length;
    const totalCount = updatedProgress.quizResults.length;
    updatedProgress.masteryLevel = Math.round((correctCount / totalCount) * 100);

    this.progress.set(progressId, updatedProgress);
    await this.updateUserStats(progress.userId);
    return updatedProgress;
  }

  async createSession(userId: string, dto: CreateSessionDto): Promise<StudySession> {
    const id = uuidv4();
    const session: StudySession = {
      id,
      userId,
      mode: dto.mode,
      conceptId: dto.conceptId,
      conceptName: dto.conceptName,
      startedAt: new Date(),
      duration: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      accuracy: 0,
    };

    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<StudySession> {
    const session = this.sessions.get(id);

    if (!session) {
      throw new NotFoundException(`Session not found: ${id}`);
    }

    return session;
  }

  async getSessions(userId: string, mode?: string): Promise<StudySession[]> {
    const userSessions = Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId,
    );

    if (mode) {
      return userSessions.filter((s) => s.mode === mode);
    }

    return userSessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  }

  async updateSession(id: string, dto: UpdateSessionDto): Promise<StudySession> {
    const session = await this.getSession(id);

    const { endedAt: _endedAt, ...dtoWithoutEndedAt } = dto;

    const updated: StudySession = {
      ...session,
      ...dtoWithoutEndedAt,
      endedAt: dto.endedAt ? new Date(dto.endedAt) : session.endedAt,
    };

    this.sessions.set(id, updated);
    await this.updateUserStats(session.userId);
    return updated;
  }

  async deleteSession(id: string): Promise<void> {
    const session = this.sessions.get(id);

    if (session) {
      this.sessions.delete(id);
      await this.updateUserStats(session.userId);
    }
  }

  async getUserStats(userId: string): Promise<UserStats> {
    let stats = this.stats.get(userId);

    if (!stats) {
      stats = await this.calculateUserStats(userId);
      this.stats.set(userId, stats);
    }

    return stats;
  }

  async getMasteredConcepts(userId: string, threshold: number = 80): Promise<string[]> {
    const userProgress = await this.getProgress(userId);
    return userProgress
      .filter((p) => p.masteryLevel >= threshold)
      .map((p) => p.conceptName);
  }

  async getWeakConcepts(userId: string, threshold: number = 50): Promise<string[]> {
    const userProgress = await this.getProgress(userId);
    const conceptsWithResults = userProgress.filter((p) => p.quizResults.length >= 3);

    return conceptsWithResults
      .filter((p) => p.masteryLevel < threshold)
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
      .map((p) => p.conceptName);
  }

  private async calculateUserStats(userId: string): Promise<UserStats> {
    const userSessions = Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId,
    );

    const totalStudyTime = userSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = userSessions.length;
    const totalQuestionsAnswered = userSessions.reduce((sum, s) => sum + s.questionsAnswered, 0);
    const totalCorrectAnswers = userSessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const averageAccuracy = totalQuestionsAnswered > 0
      ? (totalCorrectAnswers / totalQuestionsAnswered) * 100
      : 0;

    const masteredConcepts = await this.getMasteredConcepts(userId);
    const weakConcepts = await this.getWeakConcepts(userId);

    const { currentStreak, longestStreak } = this.calculateStreaks(userSessions);

    return {
      userId,
      totalStudyTime,
      totalSessions,
      totalQuestionsAnswered,
      totalCorrectAnswers,
      averageAccuracy: Math.round(averageAccuracy * 10) / 10,
      currentStreak,
      longestStreak,
      masteredConcepts,
      weakConcepts,
    };
  }

  private calculateStreaks(sessions: StudySession[]): { currentStreak: number; longestStreak: number } {
    const uniqueDays = new Set(
      sessions.map((s) => s.startedAt.toISOString().split('T')[0]),
    );

    const sortedDays = Array.from(uniqueDays).sort();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split('T')[0];

    for (let i = 0; i < sortedDays.length; i++) {
      const currentDay = sortedDays[i];
      const prevDay = i > 0 ? sortedDays[i - 1] : null;

      if (!prevDay) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(prevDay);
        const currentDate = new Date(currentDay);
        const diffDays = Math.floor(
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }

      if (currentDay === today) {
        currentStreak = tempStreak;
      }
    }

    if (currentStreak === 0 && sortedDays.length > 0) {
      const lastDay = sortedDays[sortedDays.length - 1];
      const lastDate = new Date(lastDay);
      const todayDate = new Date();
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) {
        currentStreak = 1;
      } else if (diffDays === 1) {
        currentStreak = longestStreak;
      }
    }

    return { currentStreak, longestStreak };
  }

  private async updateUserStats(userId: string): Promise<void> {
    const stats = await this.calculateUserStats(userId);
    this.stats.set(userId, stats);
  }
}
