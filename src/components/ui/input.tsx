import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-muted-gray pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'w-full h-12 px-4 rounded-input bg-white dark:bg-neutral-900/90 border border-warm-ivory dark:border-neutral-800 text-primary-black dark:text-soft-cream placeholder:text-muted-gray text-sm transition-all focus:outline-none focus:ring-2 focus:ring-velvet-red/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
              icon && 'pl-11',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
