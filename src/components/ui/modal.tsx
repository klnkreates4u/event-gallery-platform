'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-modal bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 shadow-2xl p-6 sm:p-8',
              className
            )}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-gray hover:text-primary-black dark:hover:text-white hover:bg-warm-ivory/50 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            {(title || description) && (
              <div className="mb-6 pr-6">
                {title && (
                  <h3 className="font-editorial text-2xl font-semibold text-primary-black dark:text-soft-cream">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-muted-gray mt-1">
                    {description}
                  </p>
                )}
              </div>
            )}

            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
