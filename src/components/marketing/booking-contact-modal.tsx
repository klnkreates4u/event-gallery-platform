'use client';

import React from 'react';
import { Phone, MessageCircle, Facebook, Instagram, Mail, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/modal';

export interface BookingContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactData?: {
    phone?: string | null;
    sms?: string | null;
    email?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    bookingUrl?: string | null;
  } | null;
}

export function BookingContactModal({ isOpen, onClose, contactData }: BookingContactModalProps) {
  const hasContactInfo = contactData && Object.values(contactData).some(val => val && val.length > 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Us"
      description="Choose your preferred way to get in touch with our studio to book your next event."
    >
      {!hasContactInfo ? (
        <div className="py-8 text-center text-sm text-muted-gray">
          No contact information has been configured yet.
        </div>
      ) : (
        <div className="space-y-3 pt-2">
          {contactData.bookingUrl && (
            <a
              href={contactData.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-velvet-red/20 bg-velvet-red/5 hover:bg-velvet-red/10 transition-colors text-primary-black dark:text-soft-cream group"
            >
              <div className="w-10 h-10 rounded-full bg-velvet-red/10 flex items-center justify-center text-velvet-red group-hover:scale-110 transition-transform">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Book Online</div>
                <div className="text-xs text-muted-gray truncate">Visit our booking page</div>
              </div>
            </a>
          )}
          
          {contactData.phone && (
            <a
              href={`tel:${contactData.phone.replace(/[^\d+]/g, '')}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-soft-cream dark:hover:bg-neutral-800 transition-colors text-primary-black dark:text-soft-cream group"
            >
              <div className="w-10 h-10 rounded-full bg-soft-cream dark:bg-neutral-800 flex items-center justify-center text-primary-black dark:text-soft-cream group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Call Us</div>
                <div className="text-xs text-muted-gray truncate">{contactData.phone}</div>
              </div>
            </a>
          )}

          {contactData.sms && (
            <a
              href={`sms:${contactData.sms.replace(/[^\d+]/g, '')}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-soft-cream dark:hover:bg-neutral-800 transition-colors text-primary-black dark:text-soft-cream group"
            >
              <div className="w-10 h-10 rounded-full bg-soft-cream dark:bg-neutral-800 flex items-center justify-center text-primary-black dark:text-soft-cream group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Text Us</div>
                <div className="text-xs text-muted-gray truncate">{contactData.sms}</div>
              </div>
            </a>
          )}

          {contactData.email && (
            <a
              href={`mailto:${contactData.email}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-soft-cream dark:hover:bg-neutral-800 transition-colors text-primary-black dark:text-soft-cream group"
            >
              <div className="w-10 h-10 rounded-full bg-soft-cream dark:bg-neutral-800 flex items-center justify-center text-primary-black dark:text-soft-cream group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Email Us</div>
                <div className="text-xs text-muted-gray truncate">{contactData.email}</div>
              </div>
            </a>
          )}

          {contactData.instagram && (
            <a
              href={contactData.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-soft-cream dark:hover:bg-neutral-800 transition-colors text-primary-black dark:text-soft-cream group"
            >
              <div className="w-10 h-10 rounded-full bg-soft-cream dark:bg-neutral-800 flex items-center justify-center text-primary-black dark:text-soft-cream group-hover:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Instagram</div>
                <div className="text-xs text-muted-gray truncate">Follow & DM us</div>
              </div>
            </a>
          )}

          {contactData.facebook && (
            <a
              href={contactData.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-soft-cream dark:hover:bg-neutral-800 transition-colors text-primary-black dark:text-soft-cream group"
            >
              <div className="w-10 h-10 rounded-full bg-soft-cream dark:bg-neutral-800 flex items-center justify-center text-primary-black dark:text-soft-cream group-hover:scale-110 transition-transform">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Facebook</div>
                <div className="text-xs text-muted-gray truncate">Connect with us</div>
              </div>
            </a>
          )}
        </div>
      )}
    </Modal>
  );
}
