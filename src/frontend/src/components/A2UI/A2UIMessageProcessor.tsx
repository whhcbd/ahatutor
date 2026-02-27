import { useState, useCallback, useRef, useEffect } from 'react';
import { A2UIMessage } from '@shared/types/a2ui.types';
import { DataBindingResolver } from '../../utils/data-binding-resolver';
import { MessageBuffer, BufferedMessage } from './utils/message-buffer';
import { EnhancedMessageBuffer } from './utils/enhanced-message-buffer';
import { SurfaceManager, EnhancedSurfaceState } from './utils/surface-manager';
import { PathBasedUpdater } from './utils/path-based-updater';
import { DataUpdateGenerator } from './utils/data-update-generator';
import { UserActionHandler } from './utils/user-action-handler';
import { ContextResolver } from './utils/context-resolver';
import { A2UIErrorHandler, createErrorHandler } from './utils/error-handler';

export function useA2UIMessageProcessor(options?: {
  enableBuffering?: boolean;
  bufferSize?: number;
  flushInterval?: number;
  enableEnhancedBuffer?: boolean;
  enableBatching?: boolean;
  enablePerformanceMonitoring?: boolean;
  enableIncrementalUpdates?: boolean;
  enableErrorHandling?: boolean;
}) {
  const [surfaces, setSurfaces] = useState<Map<string, EnhancedSurfaceState>>(new Map());
  const surfaceManagerRef = useRef<SurfaceManager>(new SurfaceManager());
  const messageBufferRef = useRef<MessageBuffer>(
    new MessageBuffer({
      maxBufferSize: options?.bufferSize ?? 100,
      flushInterval: options?.flushInterval ?? 50,
      enableAutoFlush: options?.enableBuffering ?? true,
    })
  );
  const enhancedBufferRef = useRef<EnhancedMessageBuffer | null>(null);
  const dataUpdateGeneratorRef = useRef<DataUpdateGenerator>(new DataUpdateGenerator());
  const userActionHandlerRef = useRef<UserActionHandler | null>(null);
  const contextResolverRef = useRef<ContextResolver | null>(null);
  const updatedPathsRef = useRef<Set<string>>(new Set());
  const errorHandlerRef = useRef<A2UIErrorHandler | null>(null);

  const processImmediateMessage = useCallback((message: A2UIMessage) => {
    const surfaceManager = surfaceManagerRef.current;

    try {
      if ('surfaceUpdate' in message) {
        const { surfaceId, components } = message.surfaceUpdate;
        
        let surface = surfaceManager.getSurface(surfaceId);
        
        if (!surface) {
          surface = surfaceManager.createSurface(surfaceId, 'normal');
        }

        for (const compDef of components) {
          surface.components.set(compDef.id, compDef.component);
        }

        surfaceManager.updateSurface(surfaceId, {
          components: new Map(surface.components),
          status: 'initializing',
        });
      } else if ('dataModelUpdate' in message) {
        const { surfaceId, path, contents } = message.dataModelUpdate;
        
        const surface = surfaceManager.getSurface(surfaceId);
        
        if (!surface) {
          if (options?.enableErrorHandling && errorHandlerRef.current) {
            errorHandlerRef.current.handleError(
              new Error(`Surface ${surfaceId} not found for dataModelUpdate`),
              { surfaceId }
            );
          } else {
            console.error(`Surface ${surfaceId} not found for dataModelUpdate`);
          }
          return;
        }

        try {
          if (options?.enableIncrementalUpdates && path) {
            const resolver = new DataBindingResolver(surface.dataModel);
            const pathUpdater = new PathBasedUpdater(resolver);
            
            const updatedData = pathUpdater.updateAtPath(path, contents, {
              createMissing: true,
              overwrite: true,
            });
            
            surface.dataModel = updatedData;
            
            updatedPathsRef.current.add(path);
          } else {
            const resolver = new DataBindingResolver(surface.dataModel);
            
            if (path) {
              for (const item of contents) {
                const fullPath = path + '/' + item.key;
                const value = getValueFromContents(item);
                resolver.updateDataModel(fullPath, value);
                updatedPathsRef.current.add(fullPath);
              }
            } else {
              for (const item of contents) {
                const value = getValueFromContents(item);
                surface.dataModel[item.key] = value;
                updatedPathsRef.current.add('/' + item.key);
              }
            }
          }

          surfaceManager.updateSurface(surfaceId, {
            dataModel: { ...surface.dataModel },
          });
        } catch (error) {
          if (options?.enableErrorHandling && errorHandlerRef.current) {
            errorHandlerRef.current.handleError(error as Error, {
              surfaceId,
              path,
            });
          } else {
            throw error;
          }
        }
      } else if ('beginRendering' in message) {
        const { surfaceId, root, catalogId, styles } = message.beginRendering;
        
        const surface = surfaceManager.getSurface(surfaceId);
        
        if (!surface) {
          if (options?.enableErrorHandling && errorHandlerRef.current) {
            errorHandlerRef.current.handleError(
              new Error(`Surface ${surfaceId} not found for beginRendering`),
              { surfaceId }
            );
          } else {
            console.error(`Surface ${surfaceId} not found for beginRendering`);
          }
          return;
        }

        surfaceManager.updateSurface(surfaceId, {
          rootId: root,
          catalogId,
          isReady: true,
          status: 'ready',
          styles,
        });

        surfaceManager.setActiveSurface(surfaceId);
      } else if ('deleteSurface' in message) {
        const { surfaceId } = message.deleteSurface;
        try {
          surfaceManager.deleteSurface(surfaceId);
        } catch (error) {
          if (options?.enableErrorHandling && errorHandlerRef.current) {
            errorHandlerRef.current.handleError(error as Error, {
              surfaceId,
            });
          } else {
            throw error;
          }
        }
      }

      setSurfaces(new Map(surfaceManager.getAllSurfaces()));
    } catch (error) {
      if (options?.enableErrorHandling && errorHandlerRef.current) {
        errorHandlerRef.current.handleError(error as Error, {
          message,
        });
      } else {
        throw error;
      }
    }
  }, [options?.enableIncrementalUpdates, options?.enableErrorHandling]);

  useEffect(() => {
    if (options?.enableErrorHandling ?? true) {
      errorHandlerRef.current = createErrorHandler(100);
    }

    return () => {
      errorHandlerRef.current?.clearErrorLog();
      errorHandlerRef.current = null;
    };
  }, [options?.enableErrorHandling]);

  useEffect(() => {
    if (options?.enableEnhancedBuffer ?? true) {
      enhancedBufferRef.current = new EnhancedMessageBuffer(
        (messages: BufferedMessage[]) => {
          for (const bufferedMessage of messages) {
            processImmediateMessage(bufferedMessage.message);
          }
        },
        () => {
          setSurfaces(new Map(surfaceManagerRef.current.getAllSurfaces()));
        },
        {
          maxBufferSize: options?.bufferSize ?? 100,
          flushInterval: options?.flushInterval ?? 50,
          enableAutoFlush: options?.enableBuffering ?? true,
          enableBatching: options?.enableBatching ?? true,
          batchSize: 10,
          enablePerformanceMonitoring: options?.enablePerformanceMonitoring ?? true,
        }
      );
    }

    return () => {
      const buffer = messageBufferRef.current;
      buffer.destroy();
      enhancedBufferRef.current?.destroy();
    };
  }, [options?.enableEnhancedBuffer, options?.bufferSize, options?.flushInterval, options?.enableBuffering, options?.enableBatching, options?.enablePerformanceMonitoring, processImmediateMessage, options?.enableIncrementalUpdates]);

  useEffect(() => {
    if (options?.enableIncrementalUpdates) {
      const activeSurface = surfaceManagerRef.current.getActiveSurface();
      if (activeSurface) {
        userActionHandlerRef.current = new UserActionHandler(
          activeSurface.dataModel,
          `session_${Date.now()}`
        );
        contextResolverRef.current = new ContextResolver(
          new DataBindingResolver(activeSurface.dataModel)
        );
      }
    }

    return () => {
      userActionHandlerRef.current?.clearCallbacks();
      userActionHandlerRef.current = null;
      contextResolverRef.current = null;
    };
  }, [surfaces, options?.enableIncrementalUpdates]);

  const processBufferedMessages = useCallback(() => {
    const messages = messageBufferRef.current.flush();

    for (const bufferedMessage of messages) {
      processImmediateMessage(bufferedMessage.message);
    }
  }, [processImmediateMessage]);

  const processMessage = useCallback((message: A2UIMessage, priority: 'high' | 'normal' | 'low' = 'normal') => {
    if (options?.enableBuffering !== false) {
      if (enhancedBufferRef.current) {
        enhancedBufferRef.current.add(message, priority);
      } else {
        messageBufferRef.current.add(message, priority);
        processBufferedMessages();
      }
    } else {
      processImmediateMessage(message);
    }
  }, [options?.enableBuffering, processBufferedMessages, processImmediateMessage]);

  const getSurface = useCallback((surfaceId: string): EnhancedSurfaceState | undefined => {
    return surfaces.get(surfaceId);
  }, [surfaces]);

  const getAllSurfaces = useCallback((): Map<string, EnhancedSurfaceState> => {
    return new Map(surfaces);
  }, [surfaces]);

  const getSurfaceManager = useCallback((): SurfaceManager => {
    return surfaceManagerRef.current;
  }, []);

  const bringToFront = useCallback((surfaceId: string): boolean => {
    const result = surfaceManagerRef.current.bringToFront(surfaceId);
    if (result) {
      setSurfaces(new Map(surfaceManagerRef.current.getAllSurfaces()));
    }
    return result;
  }, []);

  const setActiveSurface = useCallback((surfaceId: string): boolean => {
    const result = surfaceManagerRef.current.setActiveSurface(surfaceId);
    if (result) {
      setSurfaces(new Map(surfaceManagerRef.current.getAllSurfaces()));
    }
    return result;
  }, []);

  const getPerformanceMetrics = useCallback(() => {
    if (enhancedBufferRef.current) {
      return enhancedBufferRef.current.getPerformanceMetrics();
    }
    return null;
  }, []);

  const resetPerformanceMetrics = useCallback(() => {
    if (enhancedBufferRef.current) {
      enhancedBufferRef.current.resetPerformanceMetrics();
    }
  }, []);

  const generateDataUpdate = useCallback((
    surfaceId: string,
    path: string,
    updates: Record<string, any>
  ) => {
    return dataUpdateGeneratorRef.current.generateDataModelUpdate(
      surfaceId,
      path,
      updates
    );
  }, []);

  const handleUserAction = useCallback(async (
    surfaceId: string,
    componentId: string,
    actionName: string,
    context?: Record<string, any>
  ) => {
    if (!userActionHandlerRef.current) {
      console.warn('UserActionHandler not initialized');
      return null;
    }

    return await userActionHandlerRef.current.handleUserAction({
      surfaceId,
      componentId,
      actionName,
      context,
    });
  }, []);

  const resolveContext = useCallback((context?: Record<string, any>) => {
    if (!contextResolverRef.current) {
      console.warn('ContextResolver not initialized');
      return context;
    }

    return contextResolverRef.current.resolve(context);
  }, []);

  const getUpdatedPaths = useCallback(() => {
    return new Set(updatedPathsRef.current);
  }, []);

  const clearUpdatedPaths = useCallback(() => {
    updatedPathsRef.current.clear();
  }, []);

  const getErrorHandler = useCallback(() => {
    return errorHandlerRef.current;
  }, []);

  const getErrorLog = useCallback(() => {
    return errorHandlerRef.current?.getErrorLog() ?? [];
  }, []);

  const getRecentErrors = useCallback((count?: number, codeFilter?: string) => {
    return errorHandlerRef.current?.getRecentErrors(count, codeFilter) ?? [];
  }, []);

  const clearErrorLog = useCallback(() => {
    errorHandlerRef.current?.clearErrorLog();
  }, []);

  return {
    processMessage,
    getSurface,
    getAllSurfaces,
    getSurfaceManager,
    bringToFront,
    setActiveSurface,
    getPerformanceMetrics,
    resetPerformanceMetrics,
    generateDataUpdate,
    handleUserAction,
    resolveContext,
    getUpdatedPaths,
    clearUpdatedPaths,
    getErrorHandler,
    getErrorLog,
    getRecentErrors,
    clearErrorLog,
  };
}

function getValueFromContents(item: any): any {
  if (item.valueString !== undefined) {
    return item.valueString;
  }
  if (item.valueNumber !== undefined) {
    return item.valueNumber;
  }
  if (item.valueBoolean !== undefined) {
    return item.valueBoolean;
  }
  if (item.valueMap !== undefined) {
    return item.valueMap;
  }
  return undefined;
}
