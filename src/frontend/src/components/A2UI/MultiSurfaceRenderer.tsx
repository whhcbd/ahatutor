import React, { useMemo } from 'react';
import { useA2UIMessageProcessor } from './A2UIMessageProcessor';
import { A2UIMessage } from '@shared/types/a2ui.types';
import { renderComponentTree } from './renderers/component-tree-renderer';
import { A2UIErrorBoundary } from './components/A2UIErrorBoundary';
import { createErrorHandler } from './utils/error-handler';
import { createDegradationStrategy } from './utils/degradation-strategy';

interface MultiSurfaceRendererProps {
  messages: A2UIMessage[];
  showDebugInfo?: boolean;
  renderMode?: 'single' | 'multiple' | 'layered';
  defaultSurfaceId?: string;
  onSurfaceClick?: (surfaceId: string) => void;
  className?: string;
}

export function MultiSurfaceRenderer({
  messages,
  showDebugInfo = false,
  renderMode = 'layered',
  defaultSurfaceId = 'main',
  onSurfaceClick,
  className = '',
}: MultiSurfaceRendererProps): React.ReactElement {
  const errorHandler = useMemo(() => createErrorHandler(100), []);
  const degradationStrategy = useMemo(() => createDegradationStrategy(errorHandler, {
    maxLevels: 4,
    enableAutoRetry: true,
    retryAttempts: 3,
    fallbackTimeout: 10000,
  }), [errorHandler]);

  const {
    processMessage,
    getAllSurfaces,
    setActiveSurface,
    getSurfaceManager,
  } = useA2UIMessageProcessor({
    enableBuffering: true,
    bufferSize: 100,
    flushInterval: 50,
    enableErrorHandling: true,
  });

  React.useEffect(() => {
    for (const message of messages) {
      processMessage(message);
    }
  }, [messages, processMessage]);

  const renderedSurfaces = useMemo(() => {
    const surfaces = getAllSurfaces();
    
    if (surfaces.size === 0) {
      return <div className="a2ui-no-surfaces">No surfaces to render</div>;
    }

    if (renderMode === 'single') {
      const activeSurface = getSurfaceManager().getActiveSurface();
      const surfaceToRender = activeSurface || surfaces.get(defaultSurfaceId);
      
      if (!surfaceToRender) {
        return <div className="a2ui-waiting">Waiting for surface data...</div>;
      }
      
      return (
        <SurfaceLayer
          surface={surfaceToRender}
          isActive={true}
          showDebugInfo={showDebugInfo}
          onClick={() => {}}
        />
      );
    }

    if (renderMode === 'multiple') {
      const visibleSurfaces = getSurfaceManager().getVisibleSurfaces();
      
      return (
        <div className="a2ui-multiple-surfaces">
          {visibleSurfaces.map((surface) => (
            <div key={surface.surfaceId} className="a2ui-surface-container">
              <div className="a2ui-surface-header">
                <span className="a2ui-surface-title">{surface.surfaceId}</span>
                <span className={`a2ui-surface-status a2ui-status-${surface.status}`}>
                  {surface.status}
                </span>
              </div>
              <SurfaceLayer
                surface={surface}
                isActive={false}
                showDebugInfo={showDebugInfo}
                onClick={() => setActiveSurface(surface.surfaceId)}
              />
            </div>
          ))}
        </div>
      );
    }

    const readySurfaces = getSurfaceManager().getReadySurfaces();
    
    return (
      <div className="a2ui-layered-surfaces">
        {readySurfaces.map((surface) => (
          <SurfaceLayer
            key={surface.surfaceId}
            surface={surface}
            isActive={surface.surfaceId === getSurfaceManager().getActiveSurface()?.surfaceId}
            showDebugInfo={showDebugInfo}
            onClick={() => {
              setActiveSurface(surface.surfaceId);
              onSurfaceClick?.(surface.surfaceId);
            }}
          />
        ))}
      </div>
    );
  }, [getAllSurfaces, getSurfaceManager, setActiveSurface, renderMode, defaultSurfaceId, showDebugInfo, onSurfaceClick]);

  return (
    <A2UIErrorBoundary
      errorHandler={errorHandler}
      degradationStrategy={degradationStrategy}
      showDetails={showDebugInfo}
    >
      <div className={`a2ui-multi-surface-renderer ${className}`}>
        {renderedSurfaces}
      </div>
    </A2UIErrorBoundary>
  );
}

interface SurfaceLayerProps {
  surface: any;
  isActive: boolean;
  showDebugInfo: boolean;
  onClick: () => void;
}

function SurfaceLayer({ surface, isActive, showDebugInfo, onClick }: SurfaceLayerProps): React.ReactElement {
  if (!surface.isReady || !surface.rootId) {
    return (
      <div className="a2ui-surface-layer a2ui-waiting">
        Waiting for beginRendering signal...
      </div>
    );
  }

  const rootComponent = surface.components.get(surface.rootId);

  if (!rootComponent) {
    return (
      <div className="a2ui-surface-layer a2ui-error">
        Root component {surface.rootId} not found
      </div>
    );
  }

  return (
    <div
      className={`a2ui-surface-layer ${isActive ? 'a2ui-surface-active' : ''}`}
      style={{
        zIndex: surface.zIndex,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={onClick}
    >
      {renderComponentTree(
        rootComponent,
        surface.components,
        surface.dataModel,
        showDebugInfo
      )}
      
      {showDebugInfo && (
        <div className="a2ui-surface-debug">
          <div className="a2ui-surface-info">
            <strong>Surface:</strong> {surface.surfaceId}<br />
            <strong>Status:</strong> {surface.status}<br />
            <strong>Priority:</strong> {surface.priority}<br />
            <strong>Visibility:</strong> {surface.visibility}<br />
            <strong>Z-Index:</strong> {surface.zIndex}<br />
            <strong>Components:</strong> {surface.components.size}<br />
            <strong>Buffer Size:</strong> {surface.bufferSize}<br />
            <strong>Pending:</strong> {surface.pendingMessages}
          </div>
        </div>
      )}
    </div>
  );
}
