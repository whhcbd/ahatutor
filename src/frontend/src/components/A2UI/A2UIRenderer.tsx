import React, { useEffect, useMemo, useState } from 'react';
import type { A2UIPayload, A2UIComponent } from '@shared/types/a2ui.types';
import { adaptA2UIComponent, adaptComponentProps, createWrappedComponent, createFallbackComponent } from './adapters';
import { getA2UIComponentRegistration, adaptComponentProps as adaptFromRegistry } from './registry';
import { useA2UIStore } from '../../stores/a2uiStore';
interface A2UIRendererProps {
  payload: A2UIPayload;
  fallback?: React.ComponentType<{ component: A2UIComponent; error?: Error }>;
  showDebugInfo?: boolean;
  onComponentError?: (componentId: string, error: Error) => void;
}

export function A2UIRenderer({
  payload,
  fallback: FallbackComponent,
  showDebugInfo = false,
  onComponentError
}: A2UIRendererProps): React.ReactElement {
  const { setCurrentPayload, setRendering, setRenderError, updatePerformance } = useA2UIStore();
  const [errors, setErrors] = useState<Map<string, Error>>(new Map());

  // 提取知识点内容
  const knowledgePoints = payload.dataModel?._knowledgePoints;

  useEffect(() => {
    const startTime = Date.now();
    setCurrentPayload(payload);
    setRendering(true);
    setRenderError(null);

    return () => {
      const renderTime = Date.now() - startTime;
      updatePerformance(renderTime);
      setRendering(false);
    };
  }, [payload, setCurrentPayload, setRendering, setRenderError, updatePerformance]);

  const renderedComponents = useMemo(() => {
    const { surface } = payload;
    const rootComponent = surface?.components?.[surface?.rootId];

    if (!rootComponent) {
      return <div>Invalid payload: root component not found</div>;
    }

    return renderComponentTree(
      rootComponent,
      surface.components,
      FallbackComponent,
      (error) => {
        setErrors(prev => new Map(prev).set(rootComponent.id, error));
        setRenderError(error);
        onComponentError?.(rootComponent.id, error);
      },
      showDebugInfo,
      knowledgePoints
    );
  }, [payload, FallbackComponent, onComponentError, showDebugInfo]);

  return (
    <div className="a2ui-renderer" data-payload-version={payload.version}>
      {errors.size > 0 && (
        <div className="a2ui-errors" style={{ padding: '8px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '16px' }}>
          <strong>渲染警告:</strong> {errors.size} 个组件渲染失败
        </div>
      )}
      <div className="a2ui-content">
        {renderedComponents}
      </div>
      {showDebugInfo && (
        <div className="a2ui-debug" style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <h4>A2UI Debug Info</h4>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function renderComponentTree(
  component: A2UIComponent,
  components: Record<string, A2UIComponent>,
  FallbackComponent?: React.ComponentType<{ component: A2UIComponent; error?: Error }>,
  onError?: (error: Error) => void,
  showDebugInfo?: boolean,
  knowledgePoints?: Record<string, any>
): React.ReactElement {
  const Component = adaptA2UIComponent(component);

  if (!Component) {
    if (FallbackComponent) {
      return <FallbackComponent key={component.id} component={component} />;
    }
    return createFallbackComponent(component);
  }

  try {
    const adaptedProps = adaptComponentProps(component.type, component.properties);

    // 将知识点内容传递给组件
    if (knowledgePoints && !adaptedProps.knowledgePoints) {
      adaptedProps.knowledgePoints = knowledgePoints;
    }

    const registration = getA2UIComponentRegistration(component.type);

    let wrappedContent;
    if (registration) {
      const registryProps = adaptFromRegistry(component.type, adaptedProps);
      const WrappedComponent = createWrappedComponent(component, Component);

      wrappedContent = <WrappedComponent {...registryProps} />;
    } else {
      wrappedContent = <Component {...adaptedProps} />;
    }

    const children = component.children?.map((childId) => {
      const childComponent = components[childId];
      if (!childComponent) {
        console.warn(`Child component ${childId} not found`);
        return null;
      }
      return renderComponentTree(
        childComponent,
        components,
        FallbackComponent,
        onError,
        showDebugInfo,
        knowledgePoints
      );
    });

    return (
      <div key={component.id} className="a2ui-component" data-component-type={component.type}>
        {wrappedContent}
        {children && children.length > 0 && (
          <div className="a2ui-children">
            {children}
          </div>
        )}
        {showDebugInfo && (
          <div className="a2ui-component-debug" style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
            {component.type} (ID: {component.id})
          </div>
        )}
      </div>
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err);

    if (FallbackComponent) {
      return <FallbackComponent key={component.id} component={component} error={err} />;
    }

    return (
      <div
        key={component.id}
        className="a2ui-error"
        style={{
          padding: '16px',
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          backgroundColor: '#ffebee',
          color: '#c62828'
        }}
      >
        <strong>组件渲染错误:</strong> {component.type}
        <pre style={{ marginTop: '8px', fontSize: '12px' }}>{err.message}</pre>
      </div>
    );
  }
}

export function A2UIStreamRenderer({
  payloads,
  ...props
}: Omit<A2UIRendererProps, 'payload'> & { payloads: A2UIPayload[] }): React.ReactElement {
  const mergedPayload = useMemo(() => {
    if (payloads.length === 0) {
      return {
        version: '1.0',
        surface: {
          rootId: 'empty',
          components: {
            empty: {
              type: 'card',
              id: 'empty',
              properties: {},
            },
          },
        },
        dataModel: {},
      };
    }

    if (payloads.length === 1) {
      return payloads[0];
    }

    const mergedComponents: Record<string, A2UIComponent> = {};
    const mergedDataModel: Record<string, any> = {};
    const childIds: string[] = [];

    payloads.forEach((payload) => {
      Object.assign(mergedComponents, payload.surface?.components || {});
      Object.assign(mergedDataModel, payload.dataModel || {});

      if (payload.surface?.rootId) {
        childIds.push(payload.surface.rootId);
      }
    });

    const rootId = `merged_${Date.now()}`;

    return {
      version: '1.0',
      surface: {
        rootId,
        components: {
          ...mergedComponents,
          [rootId]: {
            type: 'card',
            id: rootId,
            properties: {},
            children: childIds,
          },
        },
      },
      dataModel: mergedDataModel,
    };
  }, [payloads]);

  return <A2UIRenderer payload={mergedPayload as A2UIPayload} {...props} />;
}

export function A2UILazyRenderer({
  payload,
  ...props
}: A2UIRendererProps & { threshold?: number }): React.ReactElement {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const threshold = props.threshold || 0.1;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={containerRef} className="a2ui-lazy-renderer">
      {isVisible ? (
        <A2UIRenderer payload={payload} {...props} />
      ) : (
        <div className="a2ui-loading" style={{ padding: '32px', textAlign: 'center', color: '#999' }}>
          加载中...
        </div>
      )}
    </div>
  );
}
