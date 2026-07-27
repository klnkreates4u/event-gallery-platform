import { db } from '@/database/db';
import { unstable_cache } from 'next/cache';

export async function getBranding() {
  try {
    // For single-tenant version, grab the first (and only) organization
    const org = await db.organization.findFirst();
    if (!org) return null;
    
    return {
      businessName: org.name,
      logoUrl: org.logoUrl,
      faviconUrl: org.faviconUrl,
      primaryColor: org.primaryColor || '#111111',
      accentColor: org.accentColor || '#7B1E2B',
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
      contactSms: org.contactSms,
      bookingUrl: org.bookingUrl,
      footerText: org.footerText,
      socialInstagram: org.socialInstagram,
      socialFacebook: org.socialFacebook,
      socialTiktok: org.socialTiktok,
      socialWebsite: org.socialWebsite,
      privacyPolicy: org.privacyPolicy,
      termsOfService: org.termsOfService,
    };
  } catch (error) {
    console.error('Failed to load branding:', error);
    return null;
  }
}
