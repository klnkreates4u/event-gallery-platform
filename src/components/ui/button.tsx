'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'candy';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  shine?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', shine = false, children, ...props }, ref) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-semibold rounded-button transition-all focus:outline-none focus:ring-2 focus:ring-cherry/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer overflow-hidden';

    const variants = {
      // Coal (near-black) bg — default CTA
      primary:
        'bg-coal text-oil hover:bg-[#1a1412] dark:bg-[#F7DCE6] dark:text-black dark:hover:bg-white shadow-coal/20 shadow-md',
      // Cherry (red) bg — primary action
      accent:
        'bg-cherry text-white hover:bg-[#420B0B] dark:bg-[#F7DCE6] dark:text-black dark:hover:bg-white shadow-cherry shadow-md btn-shine',
      // Oil (cream) bg — secondary
      secondary:
        'bg-oil text-coal hover:bg-[#fde0c2] dark:bg-[#302720] dark:text-oil dark:hover:bg-[#3d3028]',
      // Cherry outline
      outline:
        'border-2 border-cherry/50 text-cherry hover:bg-cherry hover:text-white dark:border-[#F7DCE6]/40 dark:text-[#F7DCE6] dark:hover:bg-[#F7DCE6] dark:hover:text-black transition-colors',
      // Ghost
      ghost:
        'text-coal hover:bg-oil/60 dark:text-oil dark:hover:bg-[#302720]',
      // Candy pink — special highlights
      candy:
        'bg-candy text-coal hover:bg-[#c87fa2] dark:bg-[#F7DCE6] dark:text-black dark:hover:bg-white shadow-candy shadow-sm',
    };

    const sizes = {
      sm: 'h-9 px-4 text-xs tracking-wide',
      md: 'h-11 px-6 text-sm tracking-wide',
      lg: 'h-13 px-8 text-base tracking-wide',
    };

    return (
      <motion.button
        ref={ref}
        suppressHydrationWarning
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className={cn(baseStyles, variants[variant], sizes[size], shine && 'btn-shine', className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
