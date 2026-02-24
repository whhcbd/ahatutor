import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import type { A2UIComponent } from '@shared/types/a2ui.types';

export interface A2UIErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<A2UIErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
}

export interface A2UIErrorFallbackProps {
  error: Error;
  errorInfo?: ErrorInfo;
  component?: A2UIComponent;
  retryCount: number;
  onRetry: () => void;
  onReset: () => void;
}

export class A2UIErrorBoundary extends Component<A2UIErrorBoundaryProps, {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  componentStack: string[];
}> {
  constructor(props: A2UIErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      componentStack: []
    };
  }

  static getDerivedStateFromError(error: Error): Partial<A2UIErrorBoundary['state']> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[A2UI Error Boundary] Caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo,
      componentStack: this.extractComponentStack(errorInfo)
    });

    this.props.onError?.(error, errorInfo);

    this.reportError(error, errorInfo);
  }

  private extractComponentStack(errorInfo: ErrorInfo): string[] {
    const stack = errorInfo.componentStack || '';
    const components: string[] = [];
    
    const componentPattern = /in (\w+)/g;
    let match;
    while ((match = componentPattern.exec(stack)) !== null) {
      if (!components.includes(match[1])) {
        components.push(match[1]);
      }
    }
    
    return components;
  }

  private reportError(error: Error, errorInfo: ErrorInfo): void {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      if (typeof window !== 'undefined' && window.onerror) {
        console.error('[A2UI Error] Reporting error:', errorReport);
      }

      fetch('/api/a2ui/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      }).catch(reportError => {
        console.error('[A2UI Error] Failed to report error:', reportError);
      });

    } catch (reportingError) {
      console.error('[A2UI Error] Error reporting failed:', reportingError);
    }
  }

  handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      console.warn('[A2UI Error Boundary] Max retries reached');
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1
    });
  };

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      componentStack: []
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback: FallbackComponent, enableRetry = true, maxRetries = 3 } = this.props;
      const { error, errorInfo, retryCount } = this.state;

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error!}
            errorInfo={errorInfo!}
            retryCount={retryCount}
            onRetry={enableRetry ? this.handleRetry : () => {}}
            onReset={this.handleReset}
          />
        );
      }

      return <DefaultA2UIErrorFallback 
        error={error!}
        errorInfo={errorInfo!}
        retryCount={retryCount}
        onRetry={enableRetry ? this.handleRetry : () => {}}
        onReset={this.handleReset}
        maxRetries={maxRetries}
      />;
    }

    return this.props.children;
  }
}

function DefaultA2UIErrorFallback({
  error,
  errorInfo,
  retryCount,
  onRetry,
  onReset,
  maxRetries = 3
}: A2UIErrorFallbackProps & { maxRetries?: number }): React.ReactElement {
  const [showDetails, setShowDetails] = useState(false);
  const canRetry = retryCount < maxRetries;

  return (
    <div className="a2ui-error-fallback" style={{
      padding: '20px',
      border: '1px solid #ffcdd2',
      borderRadius: '8px',
      backgroundColor: '#ffebee',
      color: '#c62828',
      maxWidth: '600px',
      margin: '16px 0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          可视化组件加载失败
        </h3>
      </div>

      <p style={{ margin: '0 0 16px 0', fontSize: '14px', lineHeight: '1.5' }}>
        抱歉，可视化组件遇到了问题。{error.message}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {canRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#c62828',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b71c1c'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c62828'}
          >
            重试 ({retryCount + 1}/{maxRetries})
          </button>
        )}

        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            color: '#c62828',
            border: '1px solid #c62828',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          重置
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#c62828',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          {showDetails ? '隐藏详情' : '显示详情'}
        </button>
      </div>

      {showDetails && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '4px',
          fontSize: '12px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <details>
            <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
              错误堆栈
            </summary>
            <pre style={{
              margin: '8px 0 0 0',
              padding: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '11px',
              lineHeight: '1.4'
            }}>
              {error.stack}
            </pre>
          </details>

          {errorInfo && (
            <details style={{ marginTop: '12px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
                组件堆栈
              </summary>
              <pre style={{
                margin: '8px 0 0 0',
                padding: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '11px',
                lineHeight: '1.4'
              }}>
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export function withA2UIErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<A2UIErrorBoundaryProps>
): React.ComponentType<P> {
  return function WithA2UIErrorBoundaryWrapper(props: P) {
    return (
      <A2UIErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </A2UIErrorBoundary>
    );
  };
}

export function useA2UIErrorReporting(): (error: Error, context?: Record<string, any>) => void {
  return React.useCallback((error: Error, context?: Record<string, any>) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('[A2UI Error] Reporting error:', errorReport);

    fetch('/api/a2ui/error-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorReport),
    }).catch(reportingError => {
      console.error('[A2UI Error] Failed to report error:', reportingError);
    });
  }, []);
}
