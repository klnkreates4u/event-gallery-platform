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
  icon = <ImageOff className="w-10 h-10 text-cherry" />,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center p-14 text-center rounded-card overflow-hidden',
        'border-2 border-dashed border-border dark:border-[#3A2E28]',
        'bg-white/70 dark:bg-[#261F1C]/70',
        className
      )}
    >
      {/* Polka dot background */}
      <div
        className="absolute inset-0 polka-candy opacity-25 dark:opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Icon circle */}
      <div className="relative z-10 w-16 h-16 rounded-full bg-oil dark:bg-[#302720] flex items-center justify-center mb-4 shadow-candy/20 shadow-md">
        {icon}
      </div>

      <h4 className="relative z-10 font-editorial text-xl font-semibold text-coal dark:text-oil">
        {title}
      </h4>

      {description && (
        <p className="relative z-10 text-sm text-muted-gray max-w-sm mt-2 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="relative z-10 mt-6">{action}</div>}
    </div>
  );
}
