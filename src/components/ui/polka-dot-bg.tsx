import React from 'react';

export function PolkaDotBg({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 bg-polka-dots pointer-events-none opacity-40 dark:opacity-25 ${className}`}
      aria-hidden="true"
    />
  );
}
