import React from 'react';
import { adaptComponentProps } from '../adapters';
import { getA2UIComponentRegistration } from '../registry';
import { DataBindingResolver } from '../../../utils/data-binding-resolver';

export function renderComponentTree(
  component: any,
  components: Map<string, any>,
  dataModel: Record<string, any>,
  showDebugInfo?: boolean
): React.ReactElement {
  const componentType = Object.keys(component)[0];
  const props = component[componentType];
  const adaptedProps = adaptComponentProps(componentType, props);

  const registration = getA2UIComponentRegistration(componentType);

  if (!registration) {
    return <div className="a2ui-error">Unknown component type: {componentType}</div>;
  }

  try {
    const bindingResolver = new DataBindingResolver(dataModel);
    const resolvedProps = bindingResolver.resolveObject(adaptedProps);

    const children = props.children?.map((childId: string) => {
      const childComponent = components.get(childId);
      if (!childComponent) {
        console.warn(`Child component ${childId} not found`);
        return null;
      }
      return renderComponentTree(
        childComponent,
        components,
        dataModel,
        showDebugInfo
      );
    });

    const Component = registration.component;

    if (props.child) {
      const childComponent = components.get(props.child);
      if (childComponent) {
        return (
          <div key={props.id} className="a2ui-component" data-component-type={componentType}>
            <Component {...resolvedProps}>
              {renderComponentTree(childComponent, components, dataModel, showDebugInfo)}
            </Component>
            {showDebugInfo && (
              <div className="a2ui-component-debug">
                {registration.displayName} ({componentType}) - ID: {props.id}
              </div>
            )}
          </div>
        );
      }
    }

    return (
      <div key={props.id} className="a2ui-component" data-component-type={componentType}>
        <Component {...resolvedProps}>
          {children}
        </Component>
        {showDebugInfo && (
          <div className="a2ui-component-debug">
            {registration.displayName} ({componentType}) - ID: {props.id}
          </div>
        )}
      </div>
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return (
      <div className="a2ui-error">
        <strong>Component Error:</strong> {componentType}
        <pre>{err.message}</pre>
      </div>
    );
  }
}
