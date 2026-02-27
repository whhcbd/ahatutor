import React from 'react';
import { A2UIMessage } from '@shared/types/a2ui.types';
import { MultiSurfaceRenderer } from './MultiSurfaceRenderer';

interface A2UIMessageRendererProps {
  messages: A2UIMessage[];
  showDebugInfo?: boolean;
  renderMode?: 'single' | 'multiple' | 'layered';
  defaultSurfaceId?: string;
  onSurfaceClick?: (surfaceId: string) => void;
  className?: string;
}

export function A2UIMessageRenderer({ 
  messages,
  showDebugInfo = false,
  renderMode = 'single',
  defaultSurfaceId = 'main',
  onSurfaceClick,
  className = '',
}: A2UIMessageRendererProps): React.ReactElement {
  return (
    <MultiSurfaceRenderer
      messages={messages}
      showDebugInfo={showDebugInfo}
      renderMode={renderMode}
      defaultSurfaceId={defaultSurfaceId}
      onSurfaceClick={onSurfaceClick}
      className={`a2ui-message-renderer ${className}`}
    />
  );
}
