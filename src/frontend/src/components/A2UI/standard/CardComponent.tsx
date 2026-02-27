import React from 'react';

interface CardComponentProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'error';
  shadow?: boolean;
}

export function CardComponent({
  title,
  description,
  children,
  className = '',
  variant = 'default',
  shadow = false
}: CardComponentProps) {
  const variantClasses: Record<string, string> = {
    default: 'bg-white rounded-lg shadow-sm border border-gray-200',
    elevated: 'bg-white rounded-xl shadow-md border border-gray-300',
    outlined: 'bg-white rounded-lg shadow-none border-2 border-gray-300',
    error: 'bg-red-50 rounded-lg shadow-md border-2 border-red-300',
  };

  const shadowClass = shadow ? 'shadow-lg' : '';

  return (
    <div className={`${variantClasses[variant]} ${shadowClass} ${className}`}>
      {(title || description) && (
        <div className="p-4 pb-2">
          {title && (
            <h3 className={`text-lg font-semibold mb-1 ${
              variant === 'error' ? 'text-red-900' : 'text-gray-900'
            }`}>
              {title}
            </h3>
          )}
          {description && (
            <p className={`text-sm ${
              variant === 'error' ? 'text-red-700' : 'text-gray-600'
            }`}>
              {description}
            </p>
          )}
        </div>
      )}
      {children && <div className="p-4 pt-2">{children}</div>}
    </div>
  );
}
