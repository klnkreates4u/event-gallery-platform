'use server';

import { z } from 'zod';
import { auth } from '@/../auth';
import { db } from '@/database/db';
import { revalidatePath } from 'next/cache';
import { StorageService } from '@/services/storage';

const BrandingSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(120),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color'),
  contactEmail: z.string().email('Invalid email').or(z.literal('')).optional(),
  contactPhone: z.string().max(40).optional(),
  contactSms: z.string().max(40).optional(),
  bookingUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  footerText: z.string().max(300).optional(),
  socialInstagram: z.string().url('Invalid URL').or(z.literal('')).optional(),
  socialFacebook: z.string().url('Invalid URL').or(z.literal('')).optional(),
  socialTiktok: z.string().url('Invalid URL').or(z.literal('')).optional(),
  socialWebsite: z.string().url('Invalid URL').or(z.literal('')).optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

export async function updateBrandingAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

  const raw = {
    name: formData.get('name') as string,
    primaryColor: formData.get('primaryColor') as string,
    accentColor: formData.get('accentColor') as string,
    contactEmail: formData.get('contactEmail') as string ?? '',
    contactPhone: formData.get('contactPhone') as string ?? '',
    contactSms: formData.get('contactSms') as string ?? '',
    bookingUrl: formData.get('bookingUrl') as string ?? '',
    footerText: formData.get('footerText') as string ?? '',
    socialInstagram: formData.get('socialInstagram') as string ?? '',
    socialFacebook: formData.get('socialFacebook') as string ?? '',
    socialTiktok: formData.get('socialTiktok') as string ?? '',
    socialWebsite: formData.get('socialWebsite') as string ?? '',
    logoUrl: formData.get('logoUrl') as string ?? '',
    faviconUrl: formData.get('faviconUrl') as string ?? '',
  };

  const parsed = BrandingSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? 'Validation error';
    return { success: false, error: msg };
  }

  await db.organization.update({
    where: { id: session.user.organizationId },
    data: parsed.data,
  });

  revalidatePath('/', 'layout');
  revalidatePath('/admin/dashboard/branding');
  return { success: true };
}

export async function uploadBrandingFileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.organizationId) return { success: false, error: 'Unauthorized' };

  const file = formData.get('file') as File | null;
  const type = (formData.get('type') as 'logos' | 'favicons') ?? 'logos';

  if (!file) return { success: false, error: 'No file provided' };

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await StorageService.uploadBuffer(buffer, file.name, type);

  revalidatePath('/', 'layout');
  revalidatePath('/admin/dashboard/branding');
  return { success: true, url };
}
