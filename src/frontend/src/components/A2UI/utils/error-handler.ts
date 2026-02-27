export enum A2UIErrorCode {
  SURFACE_NOT_FOUND = 'SURFACE_NOT_FOUND',
  COMPONENT_NOT_FOUND = 'COMPONENT_NOT_FOUND',
  INVALID_DATA_PATH = 'INVALID_DATA_PATH',
  CATALOG_NOT_SUPPORTED = 'CATALOG_NOT_SUPPORTED',
  BINDING_RESOLUTION_FAILED = 'BINDING_RESOLUTION_FAILED',
  INVALID_MESSAGE_FORMAT = 'INVALID_MESSAGE_FORMAT',
  RENDER_ERROR = 'RENDER_ERROR',
  DATA_MODEL_ERROR = 'DATA_MODEL_ERROR',
  USER_ACTION_ERROR = 'USER_ACTION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorMessage {
  error: {
    code: string;
    message: string;
    surfaceId?: string;
    componentId?: string;
    path?: string;
    details?: any;
    timestamp?: number;
    severity?: 'error' | 'warning' | 'info';
  };
}

export interface ErrorContext {
  surfaceId?: string;
  componentId?: string;
  path?: string;
  componentType?: string;
  message?: any;
  stack?: string;
  additionalData?: Record<string, any>;
}

export class A2UIError extends Error {
  code: string;
  surfaceId?: string;
  componentId?: string;
  path?: string;
  details?: any;
  timestamp: number;

  constructor(
    code: string,
    message: string,
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'A2UIError';
    this.code = code;
    this.surfaceId = context?.surfaceId;
    this.componentId = context?.componentId;
    this.path = context?.path;
    this.details = context?.additionalData;
    this.timestamp = Date.now();
  }
}

export class SurfaceNotFoundError extends A2UIError {
  constructor(surfaceId: string, additionalData?: any) {
    super(
      A2UIErrorCode.SURFACE_NOT_FOUND,
      `Surface ${surfaceId} not found`,
      { surfaceId, additionalData }
    );
  }
}

export class ComponentNotFoundError extends A2UIError {
  constructor(componentId: string, componentType?: string, additionalData?: any) {
    super(
      A2UIErrorCode.COMPONENT_NOT_FOUND,
      `Component ${componentId} (${componentType || 'unknown'}) not found`,
      { componentId, componentType, additionalData }
    );
  }
}

export class InvalidDataPathError extends A2UIError {
  constructor(path: string, additionalData?: any) {
    super(
      A2UIErrorCode.INVALID_DATA_PATH,
      `Invalid data path: ${path}`,
      { path, additionalData }
    );
  }
}

export class BindingResolutionError extends A2UIError {
  constructor(path: string, reason: string, additionalData?: any) {
    super(
      A2UIErrorCode.BINDING_RESOLUTION_FAILED,
      `Failed to resolve binding at path ${path}: ${reason}`,
      { path, additionalData }
    );
  }
}

export class CatalogNotSupportedError extends A2UIError {
  constructor(catalogId: string, additionalData?: any) {
    super(
      A2UIErrorCode.CATALOG_NOT_SUPPORTED,
      `Catalog ${catalogId} is not supported`,
      { additionalData }
    );
  }
}

export class RenderError extends A2UIError {
  constructor(
    componentId: string,
    error: Error,
    additionalData?: any
  ) {
    super(
      A2UIErrorCode.RENDER_ERROR,
      `Failed to render component ${componentId}: ${error.message}`,
      { componentId, additionalData, stack: error.stack }
    );
  }
}

export class UserActionError extends A2UIError {
  constructor(
    actionName: string,
    reason: string,
    additionalData?: any
  ) {
    super(
      A2UIErrorCode.USER_ACTION_ERROR,
      `User action ${actionName} failed: ${reason}`,
      { additionalData }
    );
  }
}

export interface ErrorSeverity {
  error: 'error';
  warning: 'warning';
  info: 'info';
}

export interface ErrorRecoveryStrategy {
  retry?: boolean;
  fallback?: any;
  ignore?: boolean;
  customHandler?: (error: A2UIError) => void;
}

export class A2UIErrorHandler {
  private errorLog: ErrorMessage[] = [];
  private maxLogSize: number = 100;
  private recoveryStrategies: Map<
    A2UIErrorCode,
    ErrorRecoveryStrategy
  > = new Map();
  private errorCallbacks: Set<(error: ErrorMessage) => void> = new Set();

  constructor(maxLogSize: number = 100) {
    this.maxLogSize = maxLogSize;
    this.initializeDefaultStrategies();
  }

  handleError(error: Error, context: ErrorContext = {}): ErrorMessage {
    const a2uiError = this.normalizeError(error, context);
    const errorMessage = this.createErrorMessage(a2uiError);

    this.logError(errorMessage);
    this.notifyCallbacks(errorMessage);

    const strategy = this.recoveryStrategies.get(
      a2uiError.code as A2UIErrorCode
    );
    if (strategy) {
      this.applyRecoveryStrategy(a2uiError, strategy);
    }

    return errorMessage;
  }

  handleWarning(message: string, context?: ErrorContext): ErrorMessage {
    const errorMessage: ErrorMessage = {
      error: {
        code: 'WARNING',
        message,
        surfaceId: context?.surfaceId,
        componentId: context?.componentId,
        path: context?.path,
        details: context?.additionalData,
        timestamp: Date.now(),
        severity: 'warning',
      },
    };

    this.logError(errorMessage);
    this.notifyCallbacks(errorMessage);

    return errorMessage;
  }

  handleInfo(message: string, context?: ErrorContext): ErrorMessage {
    const errorMessage: ErrorMessage = {
      error: {
        code: 'INFO',
        message,
        surfaceId: context?.surfaceId,
        componentId: context?.componentId,
        path: context?.path,
        details: context?.additionalData,
        timestamp: Date.now(),
        severity: 'info',
      },
    };

    this.logError(errorMessage);
    this.notifyCallbacks(errorMessage);

    return errorMessage;
  }

  registerRecoveryStrategy(
    code: A2UIErrorCode,
    strategy: ErrorRecoveryStrategy
  ): void {
    this.recoveryStrategies.set(code, strategy);
  }

  onError(callback: (error: ErrorMessage) => void): () => void {
    this.errorCallbacks.add(callback);

    return () => {
      this.errorCallbacks.delete(callback);
    };
  }

  getErrorLog(): ErrorMessage[] {
    return [...this.errorLog];
  }

  getRecentErrors(
    count: number = 10,
    codeFilter?: string
  ): ErrorMessage[] {
    let errors = [...this.errorLog].reverse();

    if (codeFilter) {
      errors = errors.filter(e => e.error.code === codeFilter);
    }

    return errors.slice(0, count);
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  getErrorCount(code?: string): number {
    if (code) {
      return this.errorLog.filter(e => e.error.code === code).length;
    }
    return this.errorLog.length;
  }

  hasRecentError(
    code: string,
    timeWindowMs: number = 5000
  ): boolean {
    const now = Date.now();
    return this.errorLog.some(
      e =>
        e.error.code === code &&
        e.error.timestamp &&
        now - e.error.timestamp < timeWindowMs
    );
  }

  private normalizeError(error: Error, context: ErrorContext): A2UIError {
    if (error instanceof A2UIError) {
      return error;
    }

    const code = this.inferErrorCode(error, context);
    return new A2UIError(code, error.message, {
      ...context,
      stack: error.stack,
    });
  }

  private inferErrorCode(error: Error, context: ErrorContext): string {
    if (error.message.includes('not found')) {
      if (context.surfaceId) {
        return A2UIErrorCode.SURFACE_NOT_FOUND;
      }
      if (context.componentId) {
        return A2UIErrorCode.COMPONENT_NOT_FOUND;
      }
    }

    if (error.message.includes('path') || context.path) {
      return A2UIErrorCode.INVALID_DATA_PATH;
    }

    if (error.message.includes('render') || context.componentType) {
      return A2UIErrorCode.RENDER_ERROR;
    }

    return A2UIErrorCode.UNKNOWN_ERROR;
  }

  private createErrorMessage(error: A2UIError): ErrorMessage {
    return {
      error: {
        code: error.code,
        message: error.message,
        surfaceId: error.surfaceId,
        componentId: error.componentId,
        path: error.path,
        details: error.details,
        timestamp: error.timestamp,
        severity: 'error',
      },
    };
  }

  private logError(errorMessage: ErrorMessage): void {
    this.errorLog.push(errorMessage);

    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }
  }

  private notifyCallbacks(errorMessage: ErrorMessage): void {
    for (const callback of this.errorCallbacks) {
      try {
        callback(errorMessage);
      } catch (error) {
        console.error('Error in error callback:', error);
      }
    }
  }

  private applyRecoveryStrategy(
    error: A2UIError,
    strategy: ErrorRecoveryStrategy
  ): void {
    if (strategy.ignore) {
      console.warn(`Ignoring error: ${error.code}`);
      return;
    }

    if (strategy.customHandler) {
      strategy.customHandler(error);
    }

    if (strategy.retry) {
      console.warn(`Retry strategy configured for error: ${error.code}`);
    }
  }

  private initializeDefaultStrategies(): void {
    this.recoveryStrategies.set(A2UIErrorCode.COMPONENT_NOT_FOUND, {
      ignore: true,
    });

    this.recoveryStrategies.set(A2UIErrorCode.CATALOG_NOT_SUPPORTED, {
      fallback: 'standard',
    });
  }
}

export const createErrorHandler = (maxLogSize?: number): A2UIErrorHandler => {
  return new A2UIErrorHandler(maxLogSize);
};
