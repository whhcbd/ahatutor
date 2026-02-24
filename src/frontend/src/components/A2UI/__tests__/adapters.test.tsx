import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import React from 'react';
import {
  adaptA2UIComponent,
  adaptComponentProps,
  createEventHandler,
  createWrappedComponent,
  createFallbackComponent
} from './adapters';
import { registerA2UIComponent, unregisterA2UIComponent } from './registry';
import type { A2UIComponent } from '@shared/types/a2ui.types';

vi.mock('../../stores/a2uiStore', () => ({
  logEvent: vi.fn(),
  useA2UIStore: vi.fn(() => ({
    logEvent: vi.fn(),
    setCurrentPayload: vi.fn(),
    setRendering: vi.fn(),
    setRenderError: vi.fn(),
    updatePerformance: vi.fn()
  }))
}));

afterEach(() => {
  cleanup();
});

describe('A2UI Adapters', () => {
  const TestComponent = ({ title, value }: { title?: string; value?: number }) => (
    <div data-title={title} data-value={value}>Test</div>
  );

  beforeEach(() => {
    unregisterA2UIComponent('test-component');
    unregisterA2UIComponent('punnett-adapter-test');
  });

  describe('adaptA2UIComponent', () => {
    it('should return null for unregistered component type', () => {
      const component: A2UIComponent = {
        id: 'test-1',
        type: 'non-existent-type',
        properties: {}
      };
      const result = adaptA2UIComponent(component);
      expect(result).toBeNull();
    });

    it('should return component for registered type', () => {
      registerA2UIComponent('test-component', TestComponent);
      const component: A2UIComponent = {
        id: 'test-1',
        type: 'test-component',
        properties: {}
      };
      const result = adaptA2UIComponent(component);
      expect(result).toBe(TestComponent);
    });
  });

  describe('adaptComponentProps', () => {
    beforeEach(() => {
      registerA2UIComponent('test-component', TestComponent, {
        defaultProps: {
          title: 'Default Title',
          defaultValue: 10
        }
      });
    });

    afterEach(() => {
      unregisterA2UIComponent('test-component');
    });

    it('should apply default props when not provided', () => {
      const adapted = adaptComponentProps('test-component', {});
      expect(adapted.title).toBe('Default Title');
      expect(adapted.defaultValue).toBe(10);
    });

    it('should override default props with provided props', () => {
      const adapted = adaptComponentProps('test-component', {
        title: 'Custom Title',
        value: 20
      });
      expect(adapted.title).toBe('Custom Title');
      expect(adapted.value).toBe(20);
      expect(adapted.defaultValue).toBe(10);
    });

    it('should apply adapter function', () => {
      const adapter = vi.fn((props: any) => ({
        ...props,
        computed: props.value * 2
      }));

      registerA2UIComponent('punnett-adapter-test', TestComponent, {
        adapter: adapter
      });

      const adapted = adaptComponentProps('punnett-adapter-test', {
        value: 5
      });

      expect(adapter).toHaveBeenCalledWith({ value: 5 });
      expect(adapted.computed).toBe(10);
    });

    it('should return original props for unregistered component', () => {
      const props = { foo: 'bar' };
      const adapted = adaptComponentProps('unregistered', props);
      expect(adapted).toBe(props);
    });
  });

  describe('createEventHandler', () => {
    it('should create event handler that logs to store', () => {
      const { logEvent } = require('../../stores/a2uiStore');
      const handler = createEventHandler('component-123', 'click');
      const eventData = { value: 'test' };

      handler(eventData);

      expect(logEvent).toHaveBeenCalledWith({
        type: 'click',
        componentId: 'component-123',
        data: eventData
      });
    });

    it('should call handler without data', () => {
      const { logEvent } = require('../../stores/a2uiStore');
      const handler = createEventHandler('component-123', 'hover');

      handler();

      expect(logEvent).toHaveBeenCalledWith({
        type: 'hover',
        componentId: 'component-123',
        data: undefined
      });
    });
  });

  describe('createWrappedComponent', () => {
    it('should wrap component with event handlers', () => {
      registerA2UIComponent('test-component', TestComponent);
      const component: A2UIComponent = {
        id: 'comp-1',
        type: 'test-component',
        properties: { title: 'Test Title' }
      };

      const Wrapped = createWrappedComponent(component, TestComponent);
      render(<Wrapped />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should pass adapted props to wrapped component', () => {
      registerA2UIComponent('test-component', TestComponent, {
        defaultProps: { title: 'Default' }
      });

      const component: A2UIComponent = {
        id: 'comp-1',
        type: 'test-component',
        properties: { title: 'Custom', value: 42 }
      };

      const Wrapped = createWrappedComponent(component, TestComponent);
      const { container } = render(<Wrapped />);
      const div = container.querySelector('[data-value="42"]');
      expect(div).toBeInTheDocument();
    });

    it('should render children if provided', () => {
      registerA2UIComponent('test-component', TestComponent);
      const component: A2UIComponent = {
        id: 'comp-1',
        type: 'test-component',
        properties: {}
      };

      const Wrapped = createWrappedComponent(component, TestComponent);
      render(
        <Wrapped>
          <span>Child</span>
        </Wrapped>
      );
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('Child')).toBeInTheDocument();
    });
  });

  describe('createFallbackComponent', () => {
    it('should create fallback component for unknown type', () => {
      const component: A2UIComponent = {
        id: 'test-1',
        type: 'unknown-type',
        properties: { prop1: 'value1' }
      };

      render(createFallbackComponent(component));
      expect(screen.getByText('未知组件类型: unknown-type')).toBeInTheDocument();
    });

    it('should apply fallback styles', () => {
      const component: A2UIComponent = {
        id: 'test-1',
        type: 'unknown-type',
        properties: {}
      };

      const { container } = render(createFallbackComponent(component));
      const div = container.querySelector('.a2ui-fallback-component');
      expect(div).toBeInTheDocument();
      expect(div).toHaveStyle({ padding: '16px' });
    });
  });
});
