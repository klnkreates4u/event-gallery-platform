import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { getBranding } from '@/services/branding';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { Scale, ArrowLeft, Clock, Shield, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

const defaultTermsOfService = (businessName: string) => `
<h2>1. Acceptance of Terms</h2>
<p>By viewing, downloading, or sharing media from our galleries, you agree to these terms. If you do not agree to these terms, please do not use our services.</p>

<h2>2. Use of Event Galleries</h2>
<p>Our website provides temporary hosting for photos and videos taken at events. You are permitted to view and download the media for personal, non-commercial use. You agree not to use the media for any unlawful purpose or in any way that violates the rights of others.</p>

<h2>3. Gallery Expiration</h2>
<p>Galleries are not hosted indefinitely. Each event gallery has a specific expiration date. We strongly advise you to download and back up your favorite media before the expiration date. <strong>${businessName}</strong> is not responsible for any loss of media after a gallery has expired or been removed from the platform.</p>

<h2>4. User Conduct</h2>
<p>When interacting with our platform, you agree not to attempt to bypass any security measures, including gallery PIN codes or download restrictions. Unauthorized access to private galleries is strictly prohibited.</p>

<h2>5. Intellectual Property</h2>
<p>All media provided through this platform remains the property of the respective event organizers or <strong>${businessName}</strong>, depending on the agreed-upon contract. Your right to download and use the media is granted as a license for personal use only.</p>

<h2>6. Changes to Terms</h2>
<p>We reserve the right to modify these Terms of Service at any time. Any changes will be effective immediately upon posting to this page.</p>

<h2>7. Limitation of Liability</h2>
<p><strong>${businessName}</strong> shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use or inability to use our platform or the media hosted on it.</p>
`;

export default async function TermsPage() {
  const branding = await getBranding();
  const businessName = branding?.businessName || 'Our Studio';

  const rawContent = branding?.termsOfService || defaultTermsOfService(businessName);

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-neutral-950">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-coal dark:bg-[#161210] text-oil py-14 px-6 overflow-hidden">
        <div className="absolute inset-0 polka-dark opacity-50 pointer-events-none" aria-hidden="true" />
        <div className="h-px absolute top-0 left-0 right-0 bg-gradient-to-r from-transparent via-cherry/60 to-transparent" />
        <div className="max-w-3xl mx-auto">
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cherry/20 text-cherry">
              <Scale className="w-5 h-5" />
            </div>
            <Link href="/" className="text-sm text-oil/50 hover:text-oil transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
          <h1 className="relative z-10 text-3xl md:text-4xl font-editorial font-bold text-oil mb-3">
            Terms of Service
          </h1>
          <p className="relative z-10 text-oil/60 text-sm md:text-base max-w-xl">
            Please read these terms carefully before using our event gallery platform.
          </p>
          <div className="relative z-10 flex items-center gap-2 mt-5 text-xs text-oil/40">
            <Clock className="w-3.5 h-3.5" />
            <span>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {/* Quick Nav */}
        <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-border dark:border-[#3A2E28]">
          <Link href="/privacy" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border dark:border-[#3A2E28] text-muted-gray hover:border-cherry hover:text-cherry transition-colors">
            <Shield className="w-3.5 h-3.5" /> Privacy Policy
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-cherry bg-cherry/10 text-cherry font-medium">
            <Scale className="w-3.5 h-3.5" /> Terms of Service
          </span>
        </div>

        {/* Main Content */}
        <div
          className="legal-content text-primary-black dark:text-soft-cream"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawContent) }}
        />

        {/* Footer Note */}
        <div className="mt-12 p-5 rounded-xl bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 text-sm text-muted-gray">
          <p>If you have any questions about these Terms of Service, please <Link href="/privacy" className="text-velvet-red hover:underline">contact us</Link> or email us at <strong className="text-primary-black dark:text-soft-cream">{branding?.contactEmail || 'our contact email'}</strong>.</p>
        </div>
      </main>

      {/* Legal Content Styles */}
      <style>{`
        .legal-content h2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: inherit;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--color-warm-ivory, #f0ebe3);
          font-family: var(--font-editorial, serif);
        }
        .legal-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: inherit;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .legal-content p {
          font-size: 0.9375rem;
          line-height: 1.75;
          margin-bottom: 1rem;
          color: #555;
        }
        .dark .legal-content p {
          color: #a0a0a0;
        }
        .legal-content strong {
          color: inherit;
          font-weight: 600;
        }
        .legal-content ul, .legal-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .legal-content li {
          font-size: 0.9375rem;
          line-height: 1.75;
          margin-bottom: 0.25rem;
          color: #555;
        }
        .dark .legal-content li {
          color: #a0a0a0;
        }
        .legal-content a {
          color: #7B1E2B;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>

      <Footer />
    </div>
  );
}
