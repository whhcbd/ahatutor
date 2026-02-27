import React from 'react';

export interface A2UIErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export interface A2UIErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showDetails?: boolean;
  error?: Error;
}

interface A2UIErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export function useA2UIErrorReporting() {
  const [errors, setErrors] = React.useState<Map<string, Error>>(new Map());

  const reportError = React.useCallback((componentId: string, error: Error) => {
    console.error(`[A2UI Error] Component ${componentId}:`, error);
    setErrors(prev => new Map(prev).set(componentId, error));
  }, []);

  const clearError = React.useCallback((componentId: string) => {
    setErrors(prev => {
      const newErrors = new Map(prev);
      newErrors.delete(componentId);
      return newErrors;
    });
  }, []);

  const clearAllErrors = React.useCallback(() => {
    setErrors(new Map());
  }, []);

  return {
    errors,
    reportError,
    clearError,
    clearAllErrors,
    hasErrors: errors.size > 0,
  };
}

export function withA2UIErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorFallback?: React.ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <A2UIErrorBoundary fallback={errorFallback}>
        <WrappedComponent {...props} />
      </A2UIErrorBoundary>
    );
  };
}

export class A2UIErrorBoundary extends React.Component<
  A2UIErrorBoundaryProps,
  A2UIErrorBoundaryState
> {
  constructor(props: A2UIErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<A2UIErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('A2UI Error Boundary caught an error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="a2ui-error-boundary" style={{
          padding: '24px',
          border: '2px solid #ffcdd2',
          borderRadius: '8px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>
            可视化组件加载失败
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#8b0000' }}>
            {this.state.error?.message || '组件渲染过程中发生错误'}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: '#c62828',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            重新尝试
          </button>
          {this.state.errorInfo && (
            <details style={{ marginTop: '16px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                错误详情
              </summary>
              <pre style={{
                padding: '12px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export const A2UIErrorFallback: React.FC<A2UIErrorFallbackProps> = ({
  title = '可视化组件错误',
  message = '组件加载过程中发生错误，请稍后重试',
  onRetry,
  showDetails = false,
  error,
}) => {
  const handleRetry = (): void => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="a2ui-error-fallback" style={{
      padding: '24px',
      border: '2px solid #ffcdd2',
      borderRadius: '8px',
      backgroundColor: '#ffebee',
      color: '#c62828',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '32px', marginRight: '12px' }}>⚠️</div>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>
            {title}
          </h3>
          <p style={{ margin: '0', fontSize: '14px', color: '#8b0000' }}>
            {message}
          </p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={handleRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#c62828',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '12px',
          }}
        >
          重新尝试
        </button>
      )}

      {showDetails && error && (
        <details style={{ marginTop: '12px' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '8px', fontSize: '13px' }}>
            错误详情
          </summary>
          <pre style={{
            padding: '12px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px',
          }}>
            {error.stack || error.message}
          </pre>
        </details>
      )}
    </div>
  );
};