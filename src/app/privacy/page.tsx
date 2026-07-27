import React from 'react';
import { getBranding } from '@/services/branding';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { Shield, ArrowLeft, Clock, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

const defaultPrivacyPolicy = (businessName: string, contactEmail: string) => `
<h2>1. Introduction</h2>
<p>Welcome to <strong>${businessName}</strong>. We are committed to protecting your personal data in accordance with Republic Act No. 10173, also known as the Data Privacy Act of 2012, and the guidelines issued by the National Privacy Commission of the Philippines.</p>

<h2>2. What Information We Collect</h2>
<p>We temporarily collect and host media (photos, videos, boomerangs) captured during your event. When you access our galleries, we may also collect standard internet log information such as IP addresses for security and analytics purposes. <strong>We do not require guests to create an account or provide personal information to access galleries.</strong></p>

<h2>3. How We Use Your Information</h2>
<p>The media captured during your event is hosted on this website strictly for the purpose of allowing you and your guests to view, share, and download the content. We do not use your event photos for marketing purposes without the explicit prior consent of the event organizer.</p>

<h2>4. No Accounts Required</h2>
<p>Guests do not need to create an account or provide personal information such as name or email to view or download media from public or PIN-protected event galleries. Any PIN protection is set by the event organizer and is handled securely.</p>

<h2>5. Data Retention and Deletion</h2>
<p>Event galleries are hosted temporarily. Each gallery is assigned an expiration date determined by the event organizer or <strong>${businessName}</strong>. Guests are expected to download their media before this date. Once a gallery expires, it will be automatically removed from public access and its associated media files will be securely deleted from our systems.</p>

<h2>6. Data Sharing</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share anonymized usage data with analytics providers to help us improve the platform.</p>

<h2>7. Your Rights Under RA 10173</h2>
<p>Under the Data Privacy Act of 2012, you have the following rights:</p>
<ul>
  <li><strong>Right to be Informed</strong> — you are informed of how your data is being used.</li>
  <li><strong>Right to Access</strong> — you may request information about what data we hold about you.</li>
  <li><strong>Right to Erasure</strong> — you may request the deletion of your personal information.</li>
  <li><strong>Right to Data Portability</strong> — you may request your data in a commonly used format.</li>
  <li><strong>Right to Object</strong> — you may object to the processing of your data.</li>
</ul>

<h2>8. Security</h2>
<p>We implement reasonable security measures to protect your media from unauthorized access. However, please note that no method of transmission over the internet or electronic storage is 100% secure.</p>

<h2>9. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. We encourage you to review this page periodically.</p>

<h2>10. Contact Us</h2>
<p>If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at <a href="mailto:${contactEmail || ''}">${contactEmail || 'our contact email'}</a>. You may also file a complaint with the <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer">National Privacy Commission of the Philippines</a>.</p>
`;

export default async function PrivacyPage() {
  const branding = await getBranding();
  const businessName = branding?.businessName || 'Our Studio';
  const contactEmail = branding?.contactEmail || '';

  const rawContent = branding?.privacyPolicy || defaultPrivacyPolicy(businessName, contactEmail);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Banner */}
      <div className="relative bg-coal dark:bg-[#161210] text-oil py-14 px-6 overflow-hidden">
        <div className="absolute inset-0 polka-dark opacity-50 pointer-events-none" aria-hidden="true" />
        <div className="h-px absolute top-0 left-0 right-0 bg-gradient-to-r from-transparent via-cherry/60 to-transparent" />
        <div className="max-w-3xl mx-auto">
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-cherry/20 text-cherry">
              <Shield className="w-5 h-5" />
            </div>
            <Link href="/" className="text-sm text-oil/50 hover:text-oil transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
          <h1 className="relative z-10 text-3xl md:text-4xl font-editorial font-bold text-oil mb-3">
            Privacy Policy
          </h1>
          <p className="relative z-10 text-oil/60 text-sm md:text-base max-w-xl">
            Your privacy matters to us. This policy explains how we collect, use, and protect your information in compliance with Philippine law.
          </p>
          <div className="relative z-10 flex flex-wrap items-center gap-4 mt-5 text-xs text-oil/40">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Compliant with RA 10173 — Data Privacy Act of 2012
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {/* Quick Nav */}
        <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-border dark:border-[#3A2E28]">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-cherry bg-cherry/10 text-cherry font-medium">
            <Shield className="w-3.5 h-3.5" /> Privacy Policy
          </span>
          <Link href="/terms" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border dark:border-[#3A2E28] text-muted-gray hover:border-cherry hover:text-cherry transition-colors">
            <Scale className="w-3.5 h-3.5" /> Terms of Service
          </Link>
        </div>

        {/* Main Content */}
        <div
          className="legal-content text-primary-black dark:text-soft-cream"
          dangerouslySetInnerHTML={{ __html: rawContent }}
        />

        {/* Footer Note */}
        <div className="mt-12 p-5 rounded-xl bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 text-sm text-muted-gray">
          <p>Questions about this policy? Contact us at <strong className="text-primary-black dark:text-soft-cream">{contactEmail || 'our contact email'}</strong>. Complaints may also be filed with the <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-velvet-red hover:underline">National Privacy Commission</a>.</p>
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
