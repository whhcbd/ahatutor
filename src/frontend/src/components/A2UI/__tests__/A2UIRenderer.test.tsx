import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { A2UIRenderer, A2UIStreamRenderer, A2UILazyRenderer } from './A2UIRenderer';
import { registerA2UIComponent, unregisterA2UIComponent } from './registry';
import type { A2UIPayload, A2UIComponent } from '@shared/types/a2ui.types';

const TestComponent = ({ label }: { label?: string }) =>
  React.createElement('div', { 'data-testid': 'test-component' }, label || 'Test');

describe('A2UIRenderer', () => {
  beforeEach(() => {
    unregisterA2UIComponent('test-component');
    registerA2UIComponent('test-component', TestComponent);
  });

  afterEach(() => {
    unregisterA2UIComponent('test-component');
  });

  describe('Basic Rendering', () => {
    it('should render payload with single component', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'test-component',
            properties: { label: 'Component 1' }
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload }));

      expect(screen.getByText('Component 1')).toBeInTheDocument();
    });

    it('should render payload with multiple components', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'test-component',
            properties: { label: 'Component 1' }
          },
          {
            id: 'comp-2',
            type: 'test-component',
            properties: { label: 'Component 2' }
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload }));

      expect(screen.getByText('Component 1')).toBeInTheDocument();
      expect(screen.getByText('Component 2')).toBeInTheDocument();
    });

    it('should render empty payload without errors', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'empty-payload',
        children: []
      };

      const { container } = render(React.createElement(A2UIRenderer, { payload }));

      expect(container.querySelector('.a2ui-content')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error for unknown component type', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'unknown-type',
            properties: {}
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload }));

      expect(screen.getByText('未知组件类型: unknown-type')).toBeInTheDocument();
    });

    it('should show error count when components fail', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'unknown-1',
            properties: {}
          },
          {
            id: 'comp-2',
            type: 'unknown-2',
            properties: {}
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload }));

      expect(screen.getByText(/渲染警告/)).toBeInTheDocument();
      expect(screen.getByText(/2 个组件渲染失败/)).toBeInTheDocument();
    });

    it('should call onComponentError callback', () => {
      const onError = vi.fn();
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'unknown-type',
            properties: {}
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload, onComponentError: onError }));

      expect(onError).toHaveBeenCalledWith('comp-1', expect.any(Error));
    });

    it('should render custom fallback component', () => {
      const Fallback = ({ component }: { component: A2UIComponent }) =>
        React.createElement('div', { 'data-testid': 'fallback' }, `Fallback for ${component.type}`);

      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'unknown-type',
            properties: {}
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload, fallback: Fallback }));

      expect(screen.getByTestId('fallback')).toBeInTheDocument();
      expect(screen.getByText('Fallback for unknown-type')).toBeInTheDocument();
    });
  });

  describe('Debug Mode', () => {
    it('should show debug info when showDebugInfo is true', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'test-component',
            properties: { label: 'Test' }
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload, showDebugInfo: true }));

      expect(screen.getByText('A2UI Debug Info')).toBeInTheDocument();
      expect(screen.getByText('test-component (ID: comp-1)')).toBeInTheDocument();
    });

    it('should not show debug info when showDebugInfo is false', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'test-component',
            properties: {}
          }
        ]
      };

      render(React.createElement(A2UIRenderer, { payload, showDebugInfo: false }));

      expect(screen.queryByText('A2UI Debug Info')).not.toBeInTheDocument();
    });
  });

  describe('Component Attributes', () => {
    it('should add data attributes to component container', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: [
          {
            id: 'comp-1',
            type: 'test-component',
            properties: {}
          }
        ]
      };

      const { container } = render(React.createElement(A2UIRenderer, { payload }));

      expect(container.querySelector('[data-component-type="test-component"]')).toBeInTheDocument();
      expect(container.querySelector('[data-component-id="comp-1"]')).toBeInTheDocument();
    });

    it('should add data-payload-id to renderer container', () => {
      const payload: A2UIPayload = {
        type: 'card',
        id: 'test-payload',
        children: []
      };

      const { container } = render(React.createElement(A2UIRenderer, { payload }));

      expect(container.querySelector('[data-payload-id="test-payload"]')).toBeInTheDocument();
    });
  });
});

describe('A2UIStreamRenderer', () => {
  beforeEach(() => {
    unregisterA2UIComponent('test-component');
    registerA2UIComponent('test-component', TestComponent);
  });

  afterEach(() => {
    unregisterA2UIComponent('test-component');
  });

  it('should render single payload', () => {
    const payload: A2UIPayload = {
      type: 'card',
      id: 'payload-1',
      children: [
        {
          id: 'comp-1',
          type: 'test-component',
          properties: { label: 'Test' }
        }
      ]
    };

    render(React.createElement(A2UIStreamRenderer, { payloads: [payload] }));

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should merge multiple payloads', () => {
    const payload1: A2UIPayload = {
      type: 'card',
      id: 'payload-1',
      children: [
        {
          id: 'comp-1',
          type: 'test-component',
          properties: { label: 'Component 1' }
        }
      ]
    };

    const payload2: A2UIPayload = {
      type: 'card',
      id: 'payload-2',
      children: [
        {
          id: 'comp-2',
          type: 'test-component',
          properties: { label: 'Component 2' }
        }
      ]
    };

    render(React.createElement(A2UIStreamRenderer, { payloads: [payload1, payload2] }));

    expect(screen.getByText('Component 1')).toBeInTheDocument();
    expect(screen.getByText('Component 2')).toBeInTheDocument();
  });

  it('should render empty state when no payloads', () => {
    const { container } = render(React.createElement(A2UIStreamRenderer, { payloads: [] }));

    expect(container.querySelector('.a2ui-content')).toBeInTheDocument();
  });
});

describe('A2UILazyRenderer', () => {
  beforeEach(() => {
    unregisterA2UIComponent('test-component');
    registerA2UIComponent('test-component', TestComponent);
  });

  afterEach(() => {
    unregisterA2UIComponent('test-component');
  });

  it('should show loading state initially', () => {
    const payload: A2UIPayload = {
      type: 'card',
      id: 'test-payload',
      children: [
        {
          id: 'comp-1',
          type: 'test-component',
          properties: { label: 'Test' }
        }
      ]
    };

    const { container } = render(React.createElement(A2UILazyRenderer, { payload }));

    expect(container.querySelector('.a2ui-lazy-renderer')).toBeInTheDocument();
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('should render when component becomes visible', async () => {
    const payload: A2UIPayload = {
      type: 'card',
      id: 'test-payload',
      children: [
        {
          id: 'comp-1',
          type: 'test-component',
          properties: { label: 'Test' }
        }
      ]
    };

    const { container } = render(React.createElement(A2UILazyRenderer, { payload }));

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('should accept custom threshold', () => {
    const payload: A2UIPayload = {
      type: 'card',
      id: 'test-payload',
      children: []
    };

    render(React.createElement(A2UILazyRenderer, { payload, threshold: 0.5 }));

    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });
});
