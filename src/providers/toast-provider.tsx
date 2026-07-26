'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2, X } from 'lucide-react';
import { ToastNotification, ToastType } from '@/types';

interface ToastContextValue {
  toast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  loading: (title: string, message?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
  if (type === 'error') return <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
  if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
  return <Loader2 className="w-5 h-5 text-blue-400 flex-shrink-0 animate-spin" />;
}

function ToastItem({ toast, onDismiss }: { toast: ToastNotification; onDismiss: (id: string) => void }) {
  const borderColor =
    toast.type === 'success' ? 'border-emerald-500/40' :
    toast.type === 'error' ? 'border-red-500/40' :
    toast.type === 'warning' ? 'border-amber-500/40' :
    'border-blue-500/40';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 p-4 rounded-card shadow-xl bg-white dark:bg-neutral-900 border ${borderColor} min-w-[280px] max-w-sm pointer-events-auto`}
    >
      <ToastIcon type={toast.type} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-primary-black dark:text-soft-cream">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-muted-gray mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-muted-gray hover:text-primary-black dark:hover:text-white p-0.5 flex-shrink-0"
        type="button"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const notification: ToastNotification = { id, type, title, message, duration };
      setToasts((prev) => [notification, ...prev].slice(0, 5));
      if (type !== 'loading' && duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback((title: string, message?: string) => toast('success', title, message), [toast]);
  const error = useCallback((title: string, message?: string) => toast('error', title, message), [toast]);
  const warning = useCallback((title: string, message?: string) => toast('warning', title, message), [toast]);
  const loading = useCallback((title: string, message?: string) => toast('loading', title, message, 0), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, loading, dismiss }}>
      {children}
      {/* Toast Viewport */}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
