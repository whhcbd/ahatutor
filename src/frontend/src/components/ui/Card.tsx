import { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-white border border-gray-200 shadow-sm',
  bordered: 'bg-white border-2 border-gray-200',
  elevated: 'bg-white border border-gray-100 shadow-md',
  flat: 'bg-gray-50 border-0',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
}: CardProps) {
  const classes = [
    'rounded-xl transition-all duration-200',
    variantClasses[variant],
    paddingClasses[padding],
    hoverable && 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
    onClick && 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}

// Card Header
export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;
}

// Card Title
export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

// Card Description
export function CardDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>;
}

// Card Content
export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

// Card Footer
export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>{children}</div>;
}
