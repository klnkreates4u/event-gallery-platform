import * as React from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = <ImageOff className="w-10 h-10 text-muted-gray" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-card border border-dashed border-warm-ivory dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50',
        className
      )}
    >
      <div className="p-4 rounded-full bg-soft-cream dark:bg-neutral-800 mb-4">
        {icon}
      </div>
      <h4 className="font-editorial text-xl font-semibold text-primary-black dark:text-soft-cream">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-muted-gray max-w-sm mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
