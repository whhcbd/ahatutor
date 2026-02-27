import { ReactElement } from 'react';
import { A2UIMessage } from '@shared/types/a2ui.types';
import { A2UIErrorHandler, A2UIError } from './error-handler';

export interface DegradationLevel {
  level: number;
  name: string;
  description: string;
  features: string[];
}

export interface DegradationConfig {
  maxLevels?: number;
  enableAutoRetry?: boolean;
  retryAttempts?: number;
  fallbackTimeout?: number;
}

export interface DegradationResult {
  success: boolean;
  level: number;
  element?: ReactElement;
  error?: A2UIError;
  warnings: string[];
}

export const DEGRADATION_LEVELS: DegradationLevel[] = [
  {
    level: 0,
    name: 'Full',
    description: 'Complete functionality with all features',
    features: [
      'All message types',
      'Data binding',
      'Dynamic lists',
      'Multi-surface',
      'Progressive rendering',
      'Performance monitoring',
    ],
  },
  {
    level: 1,
    name: 'Reduced',
    description: 'Core functionality without advanced features',
    features: [
      'All message types',
      'Data binding',
      'Static components only',
      'Single surface',
      'Basic rendering',
    ],
  },
  {
    level: 2,
    name: 'Basic',
    description: 'Essential functionality with minimal features',
    features: [
      'Surface and Data messages only',
      'Literal values only (no binding)',
      'Single surface',
      'Static rendering',
    ],
  },
  {
    level: 3,
    name: 'Fallback',
    description: 'Text-only fallback rendering',
    features: ['Text extraction', 'Plain text display', 'No interactivity'],
  },
  {
    level: 4,
    name: 'Error',
    description: 'Error UI display',
    features: ['Error message display', 'Retry button'],
  },
];

export class DegradationStrategy {
  private currentLevel: number = 0;
  private errorHandler: A2UIErrorHandler;
  private config: Required<DegradationConfig>;
  private renderAttempts: Map<number, number> = new Map();

  constructor(
    errorHandler: A2UIErrorHandler,
    config: DegradationConfig = {}
  ) {
    this.errorHandler = errorHandler;
    this.config = {
      maxLevels: config.maxLevels ?? 4,
      enableAutoRetry: config.enableAutoRetry ?? true,
      retryAttempts: config.retryAttempts ?? 3,
      fallbackTimeout: config.fallbackTimeout ?? 10000,
    };
  }

  async renderWithDegradation(
    renderFn: (level: number) => Promise<ReactElement>,
    maxLevel?: number
  ): Promise<DegradationResult> {
    const targetLevel = maxLevel ?? this.config.maxLevels;
    const warnings: string[] = [];

    for (let level = this.currentLevel; level <= targetLevel; level++) {
      const attempts = this.renderAttempts.get(level) ?? 0;

      if (attempts >= this.config.retryAttempts) {
        warnings.push(
          `Level ${level} exceeded max retry attempts (${this.config.retryAttempts})`
        );
        continue;
      }

      try {
        this.renderAttempts.set(level, attempts + 1);

        const startTime = performance.now();
        const element = await Promise.race([
          renderFn(level),
          this.createTimeoutPromise(),
        ]);

        const renderTime = performance.now() - startTime;

        this.currentLevel = level;

        this.logSuccess(level, renderTime);

        return {
          success: true,
          level,
          element,
          warnings,
        };
      } catch (error) {
        this.logError(level, error as Error);

        if (level < targetLevel) {
          this.errorHandler.handleWarning(
            `Degradating from level ${level} to ${level + 1}`,
            {
              additionalData: {
                error: (error as Error).message,
                nextLevel: level + 1,
              },
            }
          );
        }
      }
    }

    const lastError = this.createErrorFromFailure();
    this.errorHandler.handleError(lastError);

    return {
      success: false,
      level: targetLevel,
      error: lastError,
      warnings,
    };
  }

  async renderMessagesWithDegradation(
    messages: A2UIMessage[],
    renderFn: (messages: A2UIMessage[], level: number) => Promise<ReactElement>,
    maxLevel?: number
  ): Promise<DegradationResult> {
    const targetLevel = maxLevel ?? this.config.maxLevels;

    for (let level = this.currentLevel; level <= targetLevel; level++) {
      try {
        const levelInfo = DEGRADATION_LEVELS[level];
        
        if (level > 0) {
          this.errorHandler.handleInfo(
            `Attempting render at level ${level}: ${levelInfo.name}`,
            {
              additionalData: { features: levelInfo.features },
            }
          );
        }

        const startTime = performance.now();
        const element = await Promise.race([
          renderFn(messages, level),
          this.createTimeoutPromise(),
        ]);

        const renderTime = performance.now() - startTime;

        this.currentLevel = level;
        this.renderAttempts.set(level, 0);

        this.logSuccess(level, renderTime);

        return {
          success: true,
          level,
          element,
          warnings: [],
        };
      } catch (error) {
        this.logError(level, error as Error);

        if (level < targetLevel) {
          const nextLevel = DEGRADATION_LEVELS[level + 1];
          this.errorHandler.handleWarning(
            `Render failed at level ${level}, trying level ${level + 1}: ${nextLevel.name}`,
            {
              additionalData: {
                error: (error as Error).message,
                currentFeatures: DEGRADATION_LEVELS[level].features,
                nextFeatures: nextLevel.features,
              },
            }
          );
        }
      }
    }

    const lastError = this.createErrorFromFailure();
    this.errorHandler.handleError(lastError);

    return {
      success: false,
      level: targetLevel,
      error: lastError,
      warnings: [],
    };
  }

  getCurrentLevel(): DegradationLevel {
    return DEGRADATION_LEVELS[this.currentLevel];
  }

  getCurrentLevelNumber(): number {
    return this.currentLevel;
  }

  reset(): void {
    this.currentLevel = 0;
    this.renderAttempts.clear();
  }

  setLevel(level: number): void {
    if (level >= 0 && level < DEGRADATION_LEVELS.length) {
      this.currentLevel = level;
      this.renderAttempts.clear();
    }
  }

  degradeToLevel(level: number): void {
    if (level > this.currentLevel) {
      const currentLevel = DEGRADATION_LEVELS[this.currentLevel];
      const targetLevel = DEGRADATION_LEVELS[level];

      this.errorHandler.handleWarning(
        `Manually degrading from ${currentLevel.name} to ${targetLevel.name}`,
        {
          additionalData: {
            reason: 'manual',
            currentFeatures: currentLevel.features,
            targetFeatures: targetLevel.features,
          },
        }
      );

      this.setLevel(level);
    }
  }

  canRetry(error: Error): boolean {
    if (!this.config.enableAutoRetry) {
      return false;
    }

    const errorMessage = error.message.toLowerCase();
    const retryableErrors = [
      'timeout',
      'network',
      'temporary',
      'overload',
    ];

    return retryableErrors.some(keyword => errorMessage.includes(keyword));
  }

  shouldAutoDegrade(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    const degradableErrors = [
      'memory',
      'performance',
      'timeout',
      'component not found',
      'unsupported',
    ];

    return degradableErrors.some(keyword => errorMessage.includes(keyword));
  }

  getDegradationHistory(): Array<{
    level: number;
    attempts: number;
    lastError: string;
  }> {
    const history: Array<{
      level: number;
      attempts: number;
      lastError: string;
    }> = [];

    for (let level = 0; level < DEGRADATION_LEVELS.length; level++) {
      history.push({
        level,
        attempts: this.renderAttempts.get(level) ?? 0,
        lastError: level === this.currentLevel ? 'N/A' : 'Failed',
      });
    }

    return history;
  }

  getAvailableLevels(): DegradationLevel[] {
    return [...DEGRADATION_LEVELS];
  }

  private createTimeoutPromise(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Render timeout after ${this.config.fallbackTimeout}ms`));
      }, this.config.fallbackTimeout);
    });
  }

  private logSuccess(level: number, renderTime: number): void {
    const levelInfo = DEGRADATION_LEVELS[level];
    this.errorHandler.handleInfo(
      `Successfully rendered at level ${level} (${levelInfo.name}) in ${renderTime.toFixed(2)}ms`,
      {
        additionalData: {
          level,
          renderTime,
          features: levelInfo.features,
        },
      }
    );
  }

  private logError(level: number, error: Error): void {
    this.errorHandler.handleError(error, {
      additionalData: {
        level,
        attempts: this.renderAttempts.get(level),
      },
    });
  }

  private createErrorFromFailure(): A2UIError {
    return new A2UIError('DEGRADATION_FAILED', `All degradation levels failed`, {
      additionalData: {
        maxLevel: this.config.maxLevels,
        currentLevel: this.currentLevel,
        attempts: Array.from(this.renderAttempts.entries()),
        history: this.getDegradationHistory(),
      },
    });
  }
}

export function createDegradationStrategy(
  errorHandler: A2UIErrorHandler,
  config?: DegradationConfig
): DegradationStrategy {
  return new DegradationStrategy(errorHandler, config);
}
