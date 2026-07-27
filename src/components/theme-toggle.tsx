'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'header';
}

export function ThemeToggle({ variant = 'default', className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn("w-9 h-9 rounded-button", variant === 'header' ? 'border border-white/10' : 'border border-border/40 dark:border-white/10')} />;
  }

  const containerClasses = variant === 'header'
    ? 'flex items-center gap-1 p-1 bg-white/10 border border-white/20 rounded-button text-white'
    : 'flex items-center gap-1 p-1 bg-soft-cream dark:bg-neutral-900 border border-border dark:border-neutral-800 rounded-button';

  const activeClasses = variant === 'header'
    ? 'bg-white text-cherry shadow-sm'
    : 'bg-white dark:bg-neutral-800 text-primary-black dark:text-soft-cream shadow-sm';

  const inactiveClasses = variant === 'header'
    ? 'text-white/70 hover:text-white'
    : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream';

  return (
    <div className={cn(containerClasses, className)}>
      <button
        onClick={() => setTheme('light')}
        suppressHydrationWarning
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'light' ? activeClasses : inactiveClasses
        }`}
        title="Light Mode"
        type="button"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        suppressHydrationWarning
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'dark' ? activeClasses : inactiveClasses
        }`}
        title="Dark Mode"
        type="button"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        suppressHydrationWarning
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'system' ? activeClasses : inactiveClasses
        }`}
        title="System Theme"
        type="button"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
