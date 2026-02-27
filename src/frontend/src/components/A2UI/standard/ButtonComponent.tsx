import React from 'react';

export interface ButtonComponentProps {
  child?: React.ReactNode;
  label?: string;
  primary?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  action?: {
    name: string;
    context?: Record<string, any>;
  };
  onClick?: (action: any) => void;
  className?: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'info';
}

export function ButtonComponent({
  child,
  label,
  primary = false,
  destructive = false,
  disabled = false,
  size = 'md',
  action,
  onClick,
  className,
  variant = 'contained',
  color = 'primary'
}: ButtonComponentProps): React.ReactElement {
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const colorClasses: Record<string, string> = {
    primary: variant === 'contained' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'text-blue-600 hover:bg-blue-50',
    secondary: variant === 'contained' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'text-gray-600 hover:bg-gray-50',
    error: variant === 'contained' ? 'bg-red-600 hover:bg-red-700 text-white' : 'text-red-600 hover:bg-red-50',
    success: variant === 'contained' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-green-600 hover:bg-green-50',
    info: variant === 'contained' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'text-blue-500 hover:bg-blue-50',
  };

  const variantClasses = primary
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : destructive
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : colorClasses[color] || colorClasses.primary;

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'cursor-pointer hover:opacity-90 active:scale-95 transition-all';

  const baseClasses = [
    'a2ui-button',
    'rounded-lg font-medium',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'border-none',
    'inline-flex items-center justify-center',
    'transition-all duration-200'
  ];

  const classes = [
    ...baseClasses,
    variantClasses,
    sizeClasses[size],
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (disabled) {
      return;
    }

    if (action) {
      onClick?.(action);
    } else {
      onClick?.(null);
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {child || label}
    </button>
  );
}
