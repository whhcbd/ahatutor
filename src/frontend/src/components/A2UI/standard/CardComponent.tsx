import React from 'react';

interface CardComponentProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function CardComponent({ 
  title, 
  description, 
  children, 
  className = '',
  variant = 'default' 
}: CardComponentProps) {
  const variantClasses: Record<string, string> = {
    default: 'bg-white rounded-lg shadow-sm border border-gray-200',
    elevated: 'bg-white rounded-xl shadow-md border border-gray-300',
    outlined: 'bg-white rounded-lg shadow-none border-2 border-gray-300',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {(title || description) && (
        <div className="p-4 pb-2">
          {title && <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      )}
      {children && <div className="p-4 pt-2">{children}</div>}
    </div>
  );
}
