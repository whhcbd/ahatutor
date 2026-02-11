import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'ghost'
  | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border-transparent',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 border-transparent',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-transparent',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 border-transparent',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-transparent',
  link: 'bg-transparent text-blue-600 hover:text-blue-700 hover:underline border-transparent p-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
  xl: 'px-6 py-3 text-lg',
};

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      icon,
      iconPosition = 'left',
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
          'border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon && iconPosition === 'left' ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
        {icon && iconPosition === 'right' && !loading ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
