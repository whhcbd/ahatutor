import { Component, ErrorInfo, ReactNode } from 'react';
import { A2UIErrorHandler } from '../utils/error-handler';
import { DegradationStrategy, DegradationResult } from '../utils/degradation-strategy';

interface A2UIErrorBoundaryProps {
  children: ReactNode;
  errorHandler?: A2UIErrorHandler;
  degradationStrategy?: DegradationStrategy;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface A2UIErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  degradationLevel: number;
  degradationResult?: DegradationResult;
}

export class A2UIErrorBoundary extends Component<
  A2UIErrorBoundaryProps,
  A2UIErrorBoundaryState
> {
  constructor(props: A2UIErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      degradationLevel: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<A2UIErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { errorHandler, degradationStrategy, onError } = this.props;

    if (errorHandler) {
      errorHandler.handleError(error, {
        componentId: errorInfo.componentStack?.split('\n')[0]?.trim() || 'Unknown',
        stack: errorInfo.componentStack || '',
      });
    }

    if (onError) {
      onError(error, errorInfo);
    }

    if (degradationStrategy) {
      this.tryDegradation(degradationStrategy);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  async tryDegradation(degradationStrategy: DegradationStrategy) {
    try {
      const result = await degradationStrategy.renderWithDegradation(
        async () => {
          return this.props.children as any;
        },
        4
      );

      this.setState({
        degradationResult: result,
        degradationLevel: result.level,
      });
    } catch (error) {
      console.error('Degradation failed:', error);
    }
  }

  handleRetry = async () => {
    const { degradationStrategy } = this.props;

    if (degradationStrategy) {
      degradationStrategy.reset();

      const result = await degradationStrategy.renderWithDegradation(
        async () => {
          return this.props.children as any;
        },
        4
      );

      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        degradationResult: result,
        degradationLevel: result.level,
      });
    } else {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
      });
    }
  };

  handleDegrade = () => {
    const { degradationStrategy } = this.props;

    if (degradationStrategy) {
      const currentLevel = degradationStrategy.getCurrentLevelNumber();
      const newLevel = Math.min(currentLevel + 1, 4);

      degradationStrategy.degradeToLevel(newLevel);

      this.setState({
        degradationLevel: newLevel,
      });
    }
  };

  render() {
    const {
      children,
      fallback,
      showDetails = false,
      errorHandler,
    } = this.props;

    const {
      hasError,
      error,
      errorInfo,
      degradationLevel,
      degradationResult,
    } = this.state;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    const recentErrors = errorHandler?.getRecentErrors(5) ?? [];

    return (
      <div className="a2ui-error-boundary">
        <div className="a2ui-error-header">
          <h3>Something went wrong</h3>
          <p>We encountered an error while rendering the UI.</p>
        </div>

        {showDetails && error && (
          <div className="a2ui-error-details">
            <h4>Error Details</h4>
            <pre className="a2ui-error-message">{error.message}</pre>
            {errorInfo && (
              <pre className="a2ui-error-stack">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        {degradationResult && degradationResult.warnings.length > 0 && (
          <div className="a2ui-degradation-warnings">
            <h4>Warnings</h4>
            <ul>
              {degradationResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {recentErrors.length > 0 && showDetails && (
          <div className="a2ui-recent-errors">
            <h4>Recent Errors</h4>
            <ul>
              {recentErrors.map((msg, index) => (
                <li key={index} className={`severity-${msg.error.severity}`}>
                  <strong>{msg.error.code}</strong>: {msg.error.message}
                  {msg.error.timestamp && (
                    <span className="timestamp">
                      {new Date(msg.error.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="a2ui-error-actions">
          <button onClick={this.handleRetry} className="a2ui-retry-button">
            Retry
          </button>
          {degradationLevel < 4 && (
            <button
              onClick={this.handleDegrade}
              className="a2ui-degrade-button"
            >
              Degrade to Level {degradationLevel + 1}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export function A2UIErrorFallback({
  error,
  onRetry,
  onDegrade,
  showDetails = false,
}: {
  error?: Error;
  onRetry?: () => void;
  onDegrade?: () => void;
  showDetails?: boolean;
}) {
  return (
    <div className="a2ui-error-fallback">
      <div className="a2ui-error-icon">⚠️</div>
      <h2>Unable to render UI</h2>
      <p>
        An error occurred while processing the A2UI messages. Please try again or
        use a degraded version.
      </p>

      {error && showDetails && (
        <details className="a2ui-error-details-toggle">
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </details>
      )}

      <div className="a2ui-error-actions">
        {onRetry && (
          <button onClick={onRetry} className="a2ui-retry-button">
            🔄 Retry
          </button>
        )}
        {onDegrade && (
          <button onClick={onDegrade} className="a2ui-degrade-button">
            ⬇️ Use Simplified UI
          </button>
        )}
      </div>
    </div>
  );
}

export function A2UIDegradedModeIndicator({
  level,
  onUpgrade,
}: {
  level: number;
  onUpgrade?: () => void;
}) {
  const levels = [
    { level: 0, name: 'Full', color: 'green' },
    { level: 1, name: 'Reduced', color: 'blue' },
    { level: 2, name: 'Basic', color: 'orange' },
    { level: 3, name: 'Fallback', color: 'red' },
    { level: 4, name: 'Error', color: 'gray' },
  ];

  const currentLevel = levels[level] || levels[4];

  return (
    <div className={`a2ui-degraded-indicator level-${level}`}>
      <span className={`badge badge-${currentLevel.color}`}>
        {currentLevel.name} Mode
      </span>
      <span className="description">
        Some features may be limited
      </span>
      {level > 0 && onUpgrade && (
        <button onClick={onUpgrade} className="upgrade-button">
          ↑ Upgrade
        </button>
      )}
    </div>
  );
}
