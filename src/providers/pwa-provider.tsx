'use client';

import { useEffect } from 'react';
import { usePWA } from '@/hooks/use-pwa';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  usePWA();
  return <>{children}</>;
}
