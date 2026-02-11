import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  illustration?: ReactNode;
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
  illustration,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      {illustration ? (
        <div className="mb-6">{illustration}</div>
      ) : Icon ? (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
      ) : null}

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-500 max-w-md mb-6">{description}</p>
      )}

      {action && <div>{action}</div>}
    </div>
  );
}

// Inline version for smaller spaces
export interface EmptyStateInlineProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyStateInline({
  title,
  description,
  icon: Icon,
  action,
  className = '',
}: EmptyStateInlineProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      {Icon && <Icon className="w-8 h-8 text-gray-300 mb-3" />}
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      {description && <p className="text-xs text-gray-400 mb-3">{description}</p>}
      {action}
    </div>
  );
}
