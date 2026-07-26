'use client';

import React, { useState } from 'react';
import { KeyRound, RefreshCw, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateRandomAccessCode } from '@/utils/event-helpers';

export interface AccessCodeGeneratorProps {
  value: string;
  onChange: (code: string) => void;
}

export function AccessCodeGenerator({ value, onChange }: AccessCodeGeneratorProps) {
  const [showPin, setShowPin] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    onChange(generateRandomAccessCode(6));
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
        Gallery Access Code
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-gray" />
          <input
            type={showPin ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase().slice(0, 8))}
            placeholder="e.g. LOVE2026"
            className="w-full h-12 pl-10 pr-4 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-primary-black dark:text-soft-cream font-mono tracking-widest text-sm focus:outline-none focus:ring-2 focus:ring-velvet-red/60 transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="p-3 rounded-button border border-warm-ivory dark:border-neutral-800 text-muted-gray hover:text-primary-black dark:hover:text-white transition-colors"
          title={showPin ? 'Hide code' : 'Show code'}
        >
          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="p-3 rounded-button border border-warm-ivory dark:border-neutral-800 text-muted-gray hover:text-primary-black dark:hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleGenerate}
          className="h-12 px-4 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate</span>
        </Button>
      </div>
      <p className="text-[11px] text-muted-gray">
        Examples: LOVE2026 · ABC392 · WED001 · {'{'}6 char random{'}'}
      </p>
    </div>
  );
}
