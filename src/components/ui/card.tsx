import * as React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  /** Adds a subtle candy polka-dot corner accent */
  dotAccent?: boolean;
  /** Adds a cherry glow shadow on hover */
  cherryHover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, dotAccent = false, cherryHover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-card border border-border dark:border-[#3A2E28] bg-white dark:bg-[#261F1C] shadow-sm p-6',
          'transition-all duration-300',
          glass && 'glass-card shadow-lg',
          cherryHover && 'hover:shadow-cherry hover:-translate-y-0.5 cursor-pointer',
          dotAccent && 'polka-corner-br overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-editorial text-xl font-semibold tracking-tight text-coal dark:text-oil', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-muted-gray', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('pt-0', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center pt-4 border-t border-border/60 dark:border-[#3A2E28]/60', className)} {...props}>
      {children}
    </div>
  );
}
