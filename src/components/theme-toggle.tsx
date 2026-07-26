'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-button border border-warm-ivory/40 dark:border-white/10" />;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-soft-cream dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 rounded-button">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'light'
            ? 'bg-white dark:bg-neutral-800 text-primary-black dark:text-soft-cream shadow-sm'
            : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
        }`}
        title="Light Mode"
        type="button"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'dark'
            ? 'bg-white dark:bg-neutral-800 text-primary-black dark:text-soft-cream shadow-sm'
            : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
        }`}
        title="Dark Mode"
        type="button"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-1.5 rounded-lg transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-neutral-800 text-primary-black dark:text-soft-cream shadow-sm'
            : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
        }`}
        title="System Theme"
        type="button"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
