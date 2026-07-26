import * as React from 'react';
import { cn } from '@/utils/cn';

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-card border border-warm-ivory dark:border-neutral-800">
      <table className={cn('w-full text-left text-sm border-collapse', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-soft-cream/60 dark:bg-neutral-900 border-b border-warm-ivory dark:border-neutral-800 text-xs uppercase font-semibold text-muted-gray tracking-wider', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-warm-ivory/60 dark:divide-neutral-800', className)} {...props} />;
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'transition-colors hover:bg-warm-ivory/30 dark:hover:bg-neutral-800/50',
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('px-6 py-4 font-semibold text-left', className)} {...props} />;
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-6 py-4 text-primary-black dark:text-soft-cream', className)} {...props} />;
}
