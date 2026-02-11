import { ReactNode } from 'react';
import { Check, X, AlertTriangle, Info, Zap } from 'lucide-react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'purple'
  | 'orange'
  | 'green';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: 'none' | 'check' | 'x' | 'alert' | 'info' | 'zap';
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const iconComponents = {
  none: null,
  check: Check,
  x: X,
  alert: AlertTriangle,
  info: Info,
  zap: Zap,
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon = 'none',
  dot = false,
  className = '',
}: BadgeProps) {
  const IconComponent = iconComponents[icon];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {IconComponent && <IconComponent className="w-3 h-3" />}
      {children}
    </span>
  );
}

// Status Badge - specialized badge for status
export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  online: { variant: 'success' as BadgeVariant, label: '在线', icon: 'check' as const },
  offline: { variant: 'default' as BadgeVariant, label: '离线', icon: 'x' as const },
  busy: { variant: 'danger' as BadgeVariant, label: '忙碌', icon: 'alert' as const },
  away: { variant: 'warning' as BadgeVariant, label: '离开', icon: 'none' as const },
};

export function StatusBadge({ status, showLabel = true, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} icon={showLabel ? 'none' : config.icon} className={className}>
      {showLabel ? config.label : null}
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
    </Badge>
  );
}

// Count Badge - for showing counts
export interface CountBadgeProps {
  count: number;
  max?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function CountBadge({ count, max = 99, variant = 'danger', size = 'sm', className = '' }: CountBadgeProps) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge variant={variant} size={size} className={`min-w-[1.25rem] text-center ${className}`}>
      {displayCount}
    </Badge>
  );
}
