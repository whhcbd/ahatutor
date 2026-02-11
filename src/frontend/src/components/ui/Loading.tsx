import { Loader2 } from 'lucide-react';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps {
  size?: LoadingSize;
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses: Record<LoadingSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function Loading({ size = 'md', text, className = '', fullScreen = false }: LoadingProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-blue-600')} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

// Loading Spinner - inline version
export function LoadingSpinner({ size = 'md', className = '' }: { size?: LoadingSize; className?: string }) {
  return <Loader2 className={cn(sizeClasses[size], 'animate-spin text-blue-600', className)} />;
}

// Loading Skeleton
export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      {...props}
    />
  );
}

// Skeleton Card
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl p-4 space-y-3', className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}

// Loading Overlay for specific containers
export function LoadingOverlay({ show, text = '加载中...' }: { show: boolean; text?: string }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
      <Loading text={text} />
    </div>
  );
}
