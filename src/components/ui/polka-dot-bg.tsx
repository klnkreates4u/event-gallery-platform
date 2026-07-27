import React from 'react';
import { cn } from '@/utils/cn';

type PolkaDotVariant = 'candy' | 'oil' | 'dark' | 'cherry' | 'default';

interface PolkaDotBgProps {
  className?: string;
  variant?: PolkaDotVariant;
  opacity?: number; // 0–100
}

const variantClass: Record<PolkaDotVariant, string> = {
  candy:   'polka-candy',
  oil:     'polka-oil',
  dark:    'polka-dark',
  cherry:  'polka-cherry',
  default: 'bg-polka-dots',
};

export function PolkaDotBg({ className = '', variant = 'default', opacity }: PolkaDotBgProps) {
  const opacityStyle = opacity !== undefined ? { opacity: opacity / 100 } : undefined;

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        variantClass[variant],
        variant === 'default' && 'opacity-40 dark:opacity-20',
        variant === 'candy'   && 'opacity-60 dark:opacity-30',
        variant === 'oil'     && 'opacity-50 dark:opacity-20',
        variant === 'dark'    && 'opacity-70',
        variant === 'cherry'  && 'opacity-50 dark:opacity-30',
        className
      )}
      style={opacityStyle}
      aria-hidden="true"
    />
  );
}

/** Decorative cluster of dots — use in corners, dividers, etc. */
export function PolkaDotCluster({
  className = '',
  variant = 'candy',
  size = 'md',
}: {
  className?: string;
  variant?: 'candy' | 'cherry' | 'oil';
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = { sm: 'w-16 h-16', md: 'w-24 h-24', lg: 'w-36 h-36' };
  return (
    <div
      className={cn(
        'pointer-events-none rounded-full',
        variantClass[variant],
        sizeMap[size],
        'opacity-70 dark:opacity-40',
        className
      )}
      aria-hidden="true"
    />
  );
}
