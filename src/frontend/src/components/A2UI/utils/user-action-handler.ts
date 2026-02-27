import { UserAction, BoundValue } from '@shared/types/a2ui.types';
import { DataBindingResolver } from '../../../utils/data-binding-resolver';

export interface UserActionConfig {
  surfaceId: string;
  componentId: string;
  actionName: string;
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UserActionCallback {
  (action: UserAction): void | Promise<void>;
}

export class UserActionHandler {
  private callbacks: Map<string, UserActionCallback[]> = new Map();
  private resolver: DataBindingResolver;
  private sessionId: string;
  private messageIdCounter: number = 0;

  constructor(
    dataModel: Record<string, any>,
    sessionId?: string
  ) {
    this.resolver = new DataBindingResolver(dataModel);
    this.sessionId = sessionId || this.generateSessionId();
  }

  registerCallback(
    actionName: string,
    callback: UserActionCallback
  ): () => void {
    if (!this.callbacks.has(actionName)) {
      this.callbacks.set(actionName, []);
    }

    this.callbacks.get(actionName)!.push(callback);

    return () => {
      const callbacks = this.callbacks.get(actionName);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  async handleUserAction(config: UserActionConfig): Promise<UserAction> {
    const action = this.createUserAction(config);

    const callbacks = this.callbacks.get(config.actionName);
    if (callbacks) {
      for (const callback of callbacks) {
        try {
          await callback(action);
        } catch (error) {
          console.error(`Error in user action callback for ${config.actionName}:`, error);
        }
      }
    }

    return action;
  }

  sendUserAction(
    surfaceId: string,
    actionName: string,
    context?: Record<string, any>
  ): UserAction {
    const action = this.createUserAction({
      surfaceId,
      componentId: 'unknown',
      actionName,
      context,
    });

    return action;
  }

  resolveContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context) {
      return undefined;
    }

    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(context)) {
      if (this.isBoundValue(value)) {
        resolved[key] = this.resolver.resolve(value as BoundValue);
      } else if (Array.isArray(value)) {
        resolved[key] = this.resolveArrayContext(value);
      } else if (typeof value === 'object' && value !== null) {
        resolved[key] = this.resolveContext(value);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }

  private resolveArrayContext(array: any[]): any[] {
    return array.map(item => {
      if (this.isBoundValue(item)) {
        return this.resolver.resolve(item as BoundValue);
      } else if (Array.isArray(item)) {
        return this.resolveArrayContext(item);
      } else if (typeof item === 'object' && item !== null) {
        return this.resolveContext(item);
      }
      return item;
    });
  }

  private createUserAction(config: UserActionConfig): UserAction {
    const resolvedContext = this.resolveContext(config.context);

    return {
      actionId: this.generateActionId(),
      componentId: config.componentId,
      actionType: 'click',
      payload: {
        name: config.actionName,
        surfaceId: config.surfaceId,
        context: resolvedContext,
        metadata: config.metadata,
      },
      messageId: this.generateMessageId(),
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };
  }

  private isBoundValue(value: any): value is BoundValue {
    return (
      value !== null &&
      typeof value === 'object' &&
      ('path' in value ||
        'literalString' in value ||
        'literalNumber' in value ||
        'literalBoolean' in value)
    );
  }

  private generateActionId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    this.messageIdCounter++;
    return `msg_${this.messageIdCounter}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateDataModel(dataModel: Record<string, any>): void {
    this.resolver.setDataModel(dataModel);
  }

  getDataModel(): Record<string, any> {
    return this.resolver.getDataModel();
  }

  clearCallbacks(): void {
    this.callbacks.clear();
  }
}

export function createUserActionHandler(
  dataModel: Record<string, any>,
  sessionId?: string
): UserActionHandler {
  return new UserActionHandler(dataModel, sessionId);
}
