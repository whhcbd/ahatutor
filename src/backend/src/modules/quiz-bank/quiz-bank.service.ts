import { Injectable, Logger } from '@nestjs/common';
import { QuizQuestion, Difficulty, QuestionType } from '@shared/types/genetics.types';

interface ExerciseData {
  id: string;
  chapter: string;
  chapterNumber: number;
  question: string;
  type: 'choice' | 'fill' | 'calculation' | 'essay' | 'multiple' | 'other';
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  metadata: {
    originalLine: number;
    pageNumber?: number;
    hasImage?: boolean;
    relatedTopics?: string[];
  };
}

interface ChapterData {
  chapter: string;
  chapterNumber: number;
  exercises: ExerciseData[];
}

@Injectable()
export class QuizBankService {
  private readonly logger = new Logger(QuizBankService.name);
  private exercises: Map<string, ExerciseData> = new Map();
  private chapterExercises: Map<number, ExerciseData[]> = new Map();
  private topicExercises: Map<string, ExerciseData[]> = new Map();
  private initialized = false;

  constructor() {
    this.loadExercisesFromData();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadExercisesFromData();
      this.initialized = true;
      this.logger.log(`Quiz bank initialized with ${this.exercises.size} exercises`);
    } catch (error) {
      this.logger.error('Failed to initialize quiz bank:', error);
      throw error;
    }
  }

  private async loadExercisesFromData(): Promise<void> {
    try {
      const exercisesPath = this.getExercisesFilePath();
      
      if (await this.fileExists(exercisesPath)) {
        const content = await this.readFile(exercisesPath);
        const data = JSON.parse(content) as { exercises: ExerciseData[] };
        
        data.exercises.forEach(exercise => {
          this.addExercise(exercise);
        });
        
        this.logger.log(`Loaded ${data.exercises.length} exercises from ${exercisesPath}`);
      } else {
        this.logger.warn(`Exercises file not found at ${exercisesPath}, starting with empty bank`);
      }
    } catch (error) {
      this.logger.error('Error loading exercises:', error);
    }
  }

  private getExercisesFilePath(): string {
    return '../../data/exercises.json';
  }

  private async fileExists(path: string): Promise<boolean> {
    const fs = await import('fs/promises');
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async readFile(path: string): Promise<string> {
    const fs = await import('fs/promises');
    return await fs.readFile(path, 'utf-8');
  }

  private addExercise(exercise: ExerciseData): void {
    this.exercises.set(exercise.id, exercise);
    
    if (!this.chapterExercises.has(exercise.chapterNumber)) {
      this.chapterExercises.set(exercise.chapterNumber, []);
    }
    this.chapterExercises.get(exercise.chapterNumber)!.push(exercise);
    
    exercise.tags.forEach(tag => {
      if (!this.topicExercises.has(tag)) {
        this.topicExercises.set(tag, []);
      }
      this.topicExercises.get(tag)!.push(exercise);
    });
  }

  async getQuestionsByChapters(params: {
    chapterNumbers: number[];
    difficulty?: Difficulty;
    count?: number;
  }): Promise<QuizQuestion[]> {
    await this.initialize();
    
    const exercises: ExerciseData[] = [];
    
    params.chapterNumbers.forEach(chapterNum => {
      const chapterExercises = this.chapterExercises.get(chapterNum) || [];
      exercises.push(...chapterExercises);
    });
    
    let filtered = this.removeDuplicates(exercises);
    
    if (params.difficulty) {
      filtered = filtered.filter(ex => ex.difficulty === params.difficulty);
    }
    
    if (params.count && params.count < filtered.length) {
      filtered = this.shuffleArray(filtered).slice(0, params.count);
    }
    
    const questions = filtered.map(ex => this.convertToQuizQuestion(ex));
    this.logger.log(`Returning ${questions.length} questions from ${params.chapterNumbers.length} chapters`);
    return questions;
  }

  async getQuestionsByTopics(params: {
    topics: string[];
    difficulty?: Difficulty;
    count?: number;
  }): Promise<QuizQuestion[]> {
    await this.initialize();
    
    const exercises: ExerciseData[] = [];
    
    params.topics.forEach(topic => {
      const topicExercises = this.topicExercises.get(topic) || [];
      exercises.push(...topicExercises);
    });
    
    let filtered = this.removeDuplicates(exercises);
    
    if (params.difficulty) {
      filtered = filtered.filter(ex => ex.difficulty === params.difficulty);
    }
    
    if (params.count && params.count < filtered.length) {
      filtered = this.shuffleArray(filtered).slice(0, params.count);
    }
    
    const questions = filtered.map(ex => this.convertToQuizQuestion(ex));
    this.logger.log(`Returning ${questions.length} questions from ${params.topics.length} topics`);
    return questions;
  }

  async getRandomQuestions(params: {
    difficulty?: Difficulty;
    count: number;
    chapterNumbers?: number[];
  }): Promise<QuizQuestion[]> {
    await this.initialize();
    
    let exercises: ExerciseData[] = [];
    
    if (params.chapterNumbers && params.chapterNumbers.length > 0) {
      params.chapterNumbers.forEach(chapterNum => {
        const chapterExercises = this.chapterExercises.get(chapterNum) || [];
        exercises.push(...chapterExercises);
      });
    } else {
      exercises = Array.from(this.exercises.values());
    }
    
    let filtered = exercises;
    
    if (params.difficulty) {
      filtered = filtered.filter(ex => ex.difficulty === params.difficulty);
    }
    
    if (filtered.length === 0) {
      this.logger.warn(`No exercises found with the specified criteria`);
      return [];
    }
    
    const shuffled = this.shuffleArray(filtered);
    const selected = shuffled.slice(0, Math.min(params.count, shuffled.length));
    
    return selected.map(ex => this.convertToQuizQuestion(ex));
  }

  async getChapters(): Promise<Array<{ number: number; name: string; exerciseCount: number }>> {
    await this.initialize();
    
    const chapters: Array<{ number: number; name: string; exerciseCount: number }> = [];
    
    this.chapterExercises.forEach((exercises, chapterNum) => {
      const chapter = exercises[0];
      chapters.push({
        number: chapterNum,
        name: chapter.chapter,
        exerciseCount: exercises.length
      });
    });
    
    return chapters.sort((a, b) => a.number - b.number);
  }

  async getTopics(): Promise<string[]> {
    await this.initialize();
    return Array.from(this.topicExercises.keys()).sort();
  }

  private convertToQuizQuestion(exercise: ExerciseData): QuizQuestion {
    const questionType = this.mapExerciseTypeToQuestionType(exercise.type);
    const difficulty = this.mapDifficultyToDifficulty(exercise.difficulty);
    
    const options = exercise.options ? exercise.options.map((opt, index) => ({
      id: String.fromCharCode(65 + index),
      label: String.fromCharCode(65 + index),
      content: opt,
      isCorrect: exercise.answer === String.fromCharCode(65 + index)
    })) : undefined;
    
    return {
      id: exercise.id,
      type: questionType,
      difficulty: difficulty,
      topic: exercise.tags[0] || '遗传学',
      content: exercise.question,
      options: options,
      correctAnswer: exercise.answer || '',
      explanation: exercise.explanation ? this.parseExplanation(exercise.explanation) : {
        level1: exercise.explanation || '',
        level2: '',
        level3: '',
        level4: '',
        level5: ''
      },
      tags: exercise.tags,
      metadata: {
        source: 'exercise-bank',
        chapter: exercise.chapter,
        chapterNumber: exercise.chapterNumber
      }
    };
  }

  private mapExerciseTypeToQuestionType(type: ExerciseData['type']): QuestionType {
    const typeMap: Record<ExerciseData['type'], QuestionType> = {
      'choice': QuestionType.MULTIPLE_CHOICE,
      'fill': QuestionType.FILL_BLANK,
      'calculation': QuestionType.CALCULATION,
      'essay': QuestionType.ESSAY,
      'multiple': QuestionType.MULTIPLE_CHOICE,
      'other': QuestionType.MULTIPLE_CHOICE
    };
    return typeMap[type] || QuestionType.MULTIPLE_CHOICE;
  }

  private mapDifficultyToDifficulty(difficulty: ExerciseData['difficulty']): Difficulty {
    const difficultyMap: Record<ExerciseData['difficulty'], Difficulty> = {
      'easy': Difficulty.EASY,
      'medium': Difficulty.MEDIUM,
      'hard': Difficulty.HARD
    };
    return difficultyMap[difficulty] || Difficulty.MEDIUM;
  }

  private parseExplanation(explanation: string): QuizQuestion['explanation'] {
    return {
      level1: explanation,
      level2: '',
      level3: '',
      level4: '',
      level5: ''
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private removeDuplicates<T extends { id: string }>(array: T[]): T[] {
    const seen = new Set<string>();
    return array.filter(item => {
      if (seen.has(item.id)) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  }

  async addExerciseToBank(exercise: ExerciseData): Promise<void> {
    this.addExercise(exercise);
    this.logger.log(`Added exercise ${exercise.id} to bank`);
  }

  async saveBank(): Promise<void> {
    const exercises = Array.from(this.exercises.values());
    const data = JSON.stringify({ exercises }, null, 2);
    
    const fs = await import('fs/promises');
    await fs.writeFile(this.getExercisesFilePath(), data, 'utf-8');
    
    this.logger.log(`Saved ${exercises.length} exercises to bank`);
  }

  getBankStats(): {
    totalExercises: number;
    totalChapters: number;
    totalTopics: number;
    byDifficulty: Record<string, number>;
    byType: Record<string, number>;
  } {
    return {
      totalExercises: this.exercises.size,
      totalChapters: this.chapterExercises.size,
      totalTopics: this.topicExercises.size,
      byDifficulty: this.getStatsByDifficulty(),
      byType: this.getStatsByType()
    };
  }

  private getStatsByDifficulty(): Record<string, number> {
    const stats: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
    
    this.exercises.forEach(exercise => {
      stats[exercise.difficulty]++;
    });
    
    return stats;
  }

  private getStatsByType(): Record<string, number> {
    const stats: Record<string, number> = {
      choice: 0,
      fill: 0,
      calculation: 0,
      essay: 0,
      multiple: 0,
      other: 0
    };
    
    this.exercises.forEach(exercise => {
      stats[exercise.type]++;
    });
    
    return stats;
  }
}
