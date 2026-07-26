'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, Archive, Copy } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export type ConfirmAction = 'delete' | 'archive' | 'duplicate';

export interface ConfirmModalProps {
  isOpen: boolean;
  action: ConfirmAction;
  entityTitle: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

const CONFIG: Record<ConfirmAction, {
  icon: React.ReactNode;
  title: string;
  description: (title: string) => string;
  confirmLabel: string;
  confirmVariant: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
}> = {
  delete: {
    icon: <Trash2 className="w-6 h-6 text-red-500" />,
    title: 'Delete Event',
    description: (title) => `Are you sure you want to permanently delete "${title}"? This action cannot be undone. All photos and videos will also be removed.`,
    confirmLabel: 'Yes, Delete Permanently',
    confirmVariant: 'accent',
  },
  archive: {
    icon: <Archive className="w-6 h-6 text-amber-500" />,
    title: 'Archive Event',
    description: (title) => `Archive "${title}"? The gallery will no longer be publicly accessible, but all media will be preserved. You can restore it anytime.`,
    confirmLabel: 'Yes, Archive Event',
    confirmVariant: 'secondary',
  },
  duplicate: {
    icon: <Copy className="w-6 h-6 text-primary-black dark:text-soft-cream" />,
    title: 'Duplicate Event',
    description: (title) => `Create a full copy of "${title}"? All event details will be duplicated. Media files are not copied — you can upload new ones.`,
    confirmLabel: 'Yes, Duplicate',
    confirmVariant: 'primary',
  },
};

export function ConfirmModal({
  isOpen,
  action,
  entityTitle,
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmModalProps) {
  const config = CONFIG[action];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className="p-4 rounded-full bg-soft-cream dark:bg-neutral-800">
          {config.icon}
        </div>

        <div className="space-y-2">
          <h3 className="font-editorial text-2xl font-bold text-primary-black dark:text-soft-cream">
            {config.title}
          </h3>
          <p className="text-sm text-muted-gray max-w-sm leading-relaxed">
            {config.description(entityTitle)}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 w-full">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : config.confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
