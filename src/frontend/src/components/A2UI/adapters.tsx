import React from 'react';
import type { A2UIComponent } from '@shared/types/a2ui.types';
import { getA2UIComponent, getA2UIComponentRegistration } from './registry';
import { useA2UIStore } from '../../stores/a2uiStore';

function transformValue(value: any, transformer?: (value: any) => any): any {
  if (!transformer) return value;
  return transformer(value);
}

export interface AdaptedComponentProps {
  component: A2UIComponent;
  children?: React.ReactNode;
}

export function adaptA2UIComponent(component: A2UIComponent): React.ComponentType<any> | null {
  const { type } = component;
  return getA2UIComponent(type) || null;
}

export function adaptComponentProps(
  componentType: string,
  a2uiProps: Record<string, any>
): Record<string, any> {
  const adaptedProps: Record<string, any> = { ...a2uiProps };

  switch (componentType) {
    case 'ahatutor-punnett-square':
      adaptedProps.data = adaptedProps.data || {};
      adaptedProps.interactive = adaptedProps.interactive ?? true;
      adaptedProps.showLabels = adaptedProps.showLabels ?? true;
      adaptedProps.knowledgePoints = adaptedProps.knowledgePoints || {};
      break;

    case 'ahatutor-inheritance-path':
      adaptedProps.generations = adaptedProps.generations || [];
      adaptedProps.interactions = adaptedProps.interactions || ['hover', 'click'];
      adaptedProps.showLabels = adaptedProps.showLabels ?? true;
      adaptedProps.knowledgePoints = adaptedProps.knowledgePoints || {};
      break;

    case 'ahatutor-knowledge-graph':
      adaptedProps.nodes = adaptedProps.nodes || [];
      adaptedProps.links = adaptedProps.links || [];
      adaptedProps.width = adaptedProps.width || 800;
      adaptedProps.height = adaptedProps.height || 600;
      adaptedProps.interactive = adaptedProps.interactive ?? true;
      break;

    case 'ahatutor-meiosis-animation':
      adaptedProps.stages = adaptedProps.stages || [];
      adaptedProps.title = adaptedProps.title || '减数分裂动画';
      adaptedProps.description = adaptedProps.description || '';
      adaptedProps.controls = adaptedProps.controls || {
        autoplay: true,
        loop: true,
        speed: 1
      };
      break;

    case 'ahatutor-probability-distribution':
      adaptedProps.categories = adaptedProps.categories || [];
      adaptedProps.values = adaptedProps.values || [];
      adaptedProps.colors = adaptedProps.colors || [];
      adaptedProps.title = adaptedProps.title || '概率分布';
      adaptedProps.total = adaptedProps.total || '';
      break;

    default:
      break;
  }

  // 保留知识点内容
  if (a2uiProps.knowledgePoints) {
    adaptedProps.knowledgePoints = a2uiProps.knowledgePoints;
  }

  return adaptedProps;
}

export function adaptFromRegistry(componentType: string, props: Record<string, any>): Record<string, any> {
  const registration = getA2UIComponentRegistration(componentType);

  if (!registration) {
    return props;
  }

  const { defaultProps, propMapping = {} } = registration;

  const adaptedProps: Record<string, any> = {};

  for (const [registryKey, a2uiKey] of Object.entries(propMapping)) {
    if (a2uiKey === null) {
      adaptedProps[registryKey] = props[a2uiKey];
      continue;
    }

    const value = props[a2uiKey];
    if (value !== undefined && value !== null) {
      adaptedProps[registryKey] = transformValue(value, registration.transformers?.[registryKey]);
    }
  }

  for (const [key, value] of Object.entries(props)) {
    if (adaptedProps[key] === undefined) {
      adaptedProps[key] = value;
    }
  }

  if (defaultProps) {
    for (const [key, value] of Object.entries(defaultProps)) {
      if (adaptedProps[key] === undefined) {
        adaptedProps[key] = value;
      }
    }
  }

  // 保留知识点内容
  if (props.knowledgePoints) {
    adaptedProps.knowledgePoints = props.knowledgePoints;
  }

  return adaptedProps;
}

export function createEventHandler(
  componentId: string,
  eventType: string
): (data?: any) => void {
  return (data?: any) => {
    useA2UIStore.getState().logEvent({
      type: eventType,
      componentId,
      data
    });
  };
}

export function createWrappedComponent(
  component: A2UIComponent,
  WrappedComponent: React.ComponentType<any>
): React.ComponentType<AdaptedComponentProps> {
  return function AdaptedComponent(props: AdaptedComponentProps) {
    const adaptedProps = adaptComponentProps(component.type, component.properties);
    const handleClick = createEventHandler(component.id, 'click');
    const handleHover = createEventHandler(component.id, 'hover');
    const handleChange = createEventHandler(component.id, 'change');

    return (
      <div className="a2ui-component-wrapper" data-component-id={component.id}>
        <WrappedComponent
          {...adaptedProps}
          onClick={handleClick}
          onHover={handleHover}
          onChange={handleChange}
        />
        {props.children}
      </div>
    );
  };
}

export function createFallbackComponent(component: A2UIComponent): React.ReactElement {
  const { type, id, properties } = component;

  return (
    <div
      key={id}
      className="a2ui-fallback-component"
      style={{
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        backgroundColor: '#f5f5f5'
      }}
    >
      <h3>未知组件类型: {type}</h3>
      <pre>{JSON.stringify(properties, null, 2)}</pre>
    </div>
  );
}
