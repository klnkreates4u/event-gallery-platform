'use client';

import React, { createContext, useContext } from 'react';

export interface BrandingData {
  businessName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  accentColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  contactSms: string | null;
  bookingUrl: string | null;
  footerText: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  socialTiktok: string | null;
  socialWebsite: string | null;
  privacyPolicy: string | null;
  termsOfService: string | null;
}

const BrandingContext = createContext<BrandingData | null>(null);

export function BrandingProvider({
  children,
  branding,
}: {
  children: React.ReactNode;
  branding: BrandingData | null;
}) {
  return (
    <BrandingContext.Provider value={branding}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
