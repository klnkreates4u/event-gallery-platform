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
          {/* Backdrop — coal-cherry tinted */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-coal/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-modal bg-white dark:bg-[#261F1C]',
              'border border-border dark:border-[#3A2E28]',
              'shadow-2xl p-6 sm:p-8 overflow-hidden',
              className
            )}
          >
            {/* Polka dot corner decoration (top-right) */}
            <div
              className="absolute top-0 right-0 w-20 h-20 polka-candy opacity-30 dark:opacity-15 rounded-tr-modal pointer-events-none"
              aria-hidden="true"
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-gray hover:text-cherry hover:bg-candy/20 dark:hover:bg-candy/10 transition-all z-10"
              aria-label="Close modal"
              type="button"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {(title || description) && (
              <div className="mb-6 pr-8">
                {title && (
                  <h3 className="font-editorial text-2xl font-semibold text-coal dark:text-oil">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm text-muted-gray mt-1.5 leading-relaxed">
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
