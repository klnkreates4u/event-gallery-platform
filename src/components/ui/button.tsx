'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-button transition-colors focus:outline-none focus:ring-2 focus:ring-velvet-red/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-primary-black text-white hover:bg-neutral-800 dark:bg-soft-cream dark:text-primary-black dark:hover:bg-white shadow-md',
      accent:
        'bg-velvet-red text-white hover:bg-red-900 dark:bg-velvet-red dark:hover:bg-red-900 shadow-md',
      secondary:
        'bg-warm-ivory text-primary-black hover:bg-[#e2d8c9] dark:bg-neutral-800 dark:text-soft-cream dark:hover:bg-neutral-700',
      outline:
        'border border-warm-ivory text-primary-black hover:bg-warm-ivory/50 dark:border-neutral-700 dark:text-soft-cream dark:hover:bg-neutral-800',
      ghost:
        'text-primary-black hover:bg-warm-ivory/40 dark:text-soft-cream dark:hover:bg-neutral-800',
    };

    const sizes = {
      sm: 'h-9 px-4 text-xs tracking-wide uppercase',
      md: 'h-11 px-6 text-sm tracking-wide',
      lg: 'h-13 px-8 text-base tracking-wide',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
