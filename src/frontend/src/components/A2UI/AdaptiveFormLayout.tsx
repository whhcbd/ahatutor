import React, { useState, useEffect } from 'react';
import { getLayoutRules } from '../../constants/visualization-layout';
import { FormField } from './DynamicFormGenerator';

interface AdaptiveFormLayoutProps {
  fields: FormField[];
  children: React.ReactNode;
}

type FormComplexity = 'simple' | 'medium' | 'complex';

export function AdaptiveFormLayout({ fields, children }: AdaptiveFormLayoutProps) {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  const complexity = calculateComplexity(fields);
  const layoutRules = getLayoutRules(windowWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getColumns = (): number => {
    const columns = layoutRules.grid.columns;
    
    switch (complexity) {
      case 'simple':
        return Math.min(columns, 1);
      case 'medium':
        return Math.min(columns, 2);
      case 'complex':
        return columns;
      default:
        return columns;
    }
  };

  return (
    <div 
      style={{ 
        maxWidth: layoutRules.container.maxWidth,
        padding: layoutRules.container.padding,
        margin: layoutRules.container.margin,
      }}
      className="mx-auto"
    >
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
          gap: layoutRules.grid.gap,
        }}
        className="adaptive-form-grid"
      >
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && index < fields.length) {
            const field = fields[index];
            const span = getFieldSpan(field, complexity);
            
            if (span > 1) {
              return (
                <div 
                  key={index}
                  style={{ gridColumn: `span ${Math.min(span, getColumns())}` }}
                >
                  {child}
                </div>
              );
            }
            return child;
          }
          return child;
        })}
      </div>
    </div>
  );
}

function calculateComplexity(fields: FormField[]): FormComplexity {
  let score = 0;

  fields.forEach(field => {
    if (field.type === 'textarea') score += 3;
    else if (field.type === 'multiselect') score += 2;
    else if (field.type === 'range') score += 2;
    else if (field.type === 'select') score += 1;
    else score += 1;
  });

  if (score <= 5) return 'simple';
  if (score <= 10) return 'medium';
  return 'complex';
}

function getFieldSpan(field: FormField, complexity: FormComplexity): number {
  if (complexity === 'simple') return 1;

  switch (field.type) {
    case 'textarea':
    case 'multiselect':
      return 2;
    case 'range':
      return 2;
    case 'select':
      if (field.options && field.options.length > 5) return 2;
      return 1;
    default:
      return 1;
  }
}

export function useFormLayout() {
  const [complexity, setComplexity] = useState<FormComplexity>('simple');
  const [layoutMode, setLayoutMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const rules = getLayoutRules(width);
      setLayoutMode(rules.typography.fontSize.md === '1rem' ? 'desktop' : 'tablet');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateComplexity = (fields: FormField[]) => {
    setComplexity(calculateComplexity(fields));
  };

  const getRecommendedLayout = () => {
    switch (complexity) {
      case 'simple':
        return {
          columns: layoutMode === 'mobile' ? 1 : layoutMode === 'tablet' ? 1 : 2,
          width: '100%',
          padding: '16px',
        };
      case 'medium':
        return {
          columns: layoutMode === 'mobile' ? 1 : layoutMode === 'tablet' ? 2 : 3,
          width: '90%',
          padding: '20px',
        };
      case 'complex':
        return {
          columns: layoutMode === 'mobile' ? 1 : layoutMode === 'tablet' ? 2 : 3,
          width: '100%',
          padding: '24px',
        };
    }
  };

  return {
    complexity,
    layoutMode,
    updateComplexity,
    getRecommendedLayout,
  };
}
