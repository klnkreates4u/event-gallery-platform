import React from 'react';
import { Sparkles, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import { useBranding } from '@/providers/branding-provider';
import { BookingContactModal } from './booking-contact-modal';

export interface BookingCTAProps {
  headline?: string;
  subtitle?: string;
  bookLink?: string;
  quoteLink?: string;
}

export function BookingCTA({
  headline = 'Love this experience?',
  subtitle = 'Create unforgettable memories with your own event.',
  bookLink = siteConfig.contact.website || '#',
  quoteLink = `mailto:${siteConfig.contact.email}`,
}: BookingCTAProps) {
  const branding = useBranding();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const contactData = branding ? {
    phone: branding.contactPhone,
    sms: branding.contactSms,
    email: branding.contactEmail,
    facebook: branding.socialFacebook,
    instagram: branding.socialInstagram,
    bookingUrl: branding.bookingUrl,
  } : null;

  return (
    <section className="my-12">
      <Card glass className="p-8 md:p-12 text-center relative overflow-hidden shadow-2xl border-velvet-red/20">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-velvet-red/10 text-velvet-red text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Concierge</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-primary-black dark:text-soft-cream">
            {headline}
          </h2>

          <p className="text-sm sm:text-base text-muted-gray leading-relaxed max-w-lg mx-auto font-light">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              type="button"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your Event</span>
            </Button>

            <a href={quoteLink} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Request a Quote</span>
              </Button>
            </a>
          </div>
        </div>
      </Card>

      <BookingContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contactData={contactData}
      />
    </section>
  );
}
