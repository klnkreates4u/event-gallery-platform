import React from 'react';
import { getLegalContentAction } from '@/actions/legal';
import { LegalForm } from '@/components/admin/legal-form';
import { Shield } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal Documents',
};

export default async function LegalPage() {
  const { privacyPolicy, termsOfService } = await getLegalContentAction();

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-velvet-red/10 text-velvet-red shrink-0 mt-0.5">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-editorial font-bold text-primary-black dark:text-soft-cream">
            Legal Documents
          </h1>
          <p className="text-sm text-muted-gray mt-1">
            Edit your Privacy Policy and Terms of Service. Changes are published to your live site instantly.
          </p>
        </div>
      </div>

      <LegalForm
        initialPrivacyPolicy={privacyPolicy}
        initialTermsOfService={termsOfService}
      />
    </div>
  );
}
