import { getA2UIComponent } from './registry';
import type { A2UIComponent } from '@shared/types/a2ui.types';

interface A2UIComponentRendererProps {
  component: A2UIComponent;
  dataModel?: Record<string, any>;
  onAction?: (action: {
    type: string;
    componentId: string;
    action: string;
    data?: Record<string, any>;
  }) => void;
}

export function A2UIComponentRenderer({ 
  component, 
  dataModel,
  onAction 
}: A2UIComponentRendererProps) {
  const ReactComponent = getA2UIComponent(component.type);
  
  if (!ReactComponent) {
    return (
      <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.732-3.732L2.468 7.08c-.77 1.333.192 2.694 1.732 3.732l10 5.732c.77 1.333 2.694 1.732 3.732l5.732-10c1.333-.77 1.732-2.694 1.732-3.732L21.468 12.932c.77-1.333-.192-2.694-1.732-3.732l-10-5.732z" />
          </svg>
          <span className="font-semibold text-red-700">未注册的组件</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-red-600">
            组件类型: <code className="bg-red-100 px-1 py-0.5 rounded">{component.type}</code>
          </p>
          <p className="text-xs text-red-500">
            该组件未在前端注册表中，请检查组件注册表或联系开发团队。
          </p>
        </div>
      </div>
    );
  }
  
  const componentProps = {
    ...component.properties,
    dataModel,
    onAction
  };

  return <ReactComponent {...componentProps} />;
}

export default A2UIComponentRenderer;
