'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Palette, Upload, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/providers/toast-provider';
import { updateBrandingAction, uploadBrandingFileAction } from '@/actions/branding';

const BrandingSchema = z.object({
  name: z.string().min(1, 'Business name is required'),
  primaryColor: z.string().min(1),
  accentColor: z.string().min(1),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  contactSms: z.string().optional(),
  bookingUrl: z.string().optional(),
  footerText: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialTiktok: z.string().optional(),
  socialWebsite: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
});

type BrandingFormData = z.infer<typeof BrandingSchema>;

interface BrandingFormProps {
  organization: any | null;
}

export default function BrandingForm({ organization }: BrandingFormProps) {
  const { success, error } = useToast();
  const [isPending, startTransition] = useTransition();
  const [logoPreview, setLogoPreview] = useState<string | null>(organization?.logoUrl ?? null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(organization?.faviconUrl ?? null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BrandingFormData>({
    resolver: zodResolver(BrandingSchema),
    defaultValues: {
      name: organization?.name ?? '',
      primaryColor: organization?.primaryColor ?? '#111111',
      accentColor: organization?.accentColor ?? '#7B1E2B',
      contactEmail: organization?.contactEmail ?? '',
      contactPhone: organization?.contactPhone ?? '',
      contactSms: organization?.contactSms ?? '',
      bookingUrl: organization?.bookingUrl ?? '',
      footerText: organization?.footerText ?? '',
      socialInstagram: organization?.socialInstagram ?? '',
      socialFacebook: organization?.socialFacebook ?? '',
      socialTiktok: organization?.socialTiktok ?? '',
      socialWebsite: organization?.socialWebsite ?? '',
      logoUrl: organization?.logoUrl ?? '',
      faviconUrl: organization?.faviconUrl ?? '',
    },
  });

  const primaryColor = watch('primaryColor');
  const accentColor = watch('accentColor');

  const handleFileUpload = async (file: File, type: 'logos' | 'favicons', field: 'logoUrl' | 'faviconUrl') => {
    // Optimistic preview
    const previewUrl = URL.createObjectURL(file);
    if (field === 'logoUrl') setLogoPreview(previewUrl);
    else setFaviconPreview(previewUrl);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const result = await uploadBrandingFileAction(fd);
    if (result.success) {
      setValue(field, result.url);
    } else {
      error('Upload Failed', result.error ?? 'Could not upload file.');
      if (field === 'logoUrl') setLogoPreview(organization?.logoUrl ?? null);
      else setFaviconPreview(organization?.faviconUrl ?? null);
    }
  };

  const onSubmit = (data: BrandingFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v ?? ''));
      const result = await updateBrandingAction(formData);
      if (result.success) {
        success('Branding Updated', 'Your white-label settings have been saved.');
      } else {
        error('Save Failed', result.error ?? 'Something went wrong.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Brand Identity */}
      <Card className="p-6 space-y-5">
        <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-border dark:border-neutral-800 pb-3 flex items-center gap-2">
          <Palette className="w-5 h-5 text-velvet-red" /> Brand Identity
        </h2>

        <Input label="Business Name" placeholder="Your Studio Name" {...register('name')} />
        {errors.name && <p className="text-xs text-cherry">{errors.name.message}</p>}

        {/* Logo Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">Logo</label>
            <div className="flex items-center gap-3">
              {logoPreview && (
                <img src={logoPreview} alt="Logo" className="h-10 w-auto rounded-button border border-border object-contain" />
              )}
              <label className="flex items-center gap-2 px-3 py-2 rounded-button border border-border dark:border-neutral-700 text-xs text-muted-gray hover:text-velvet-red cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'logos', 'logoUrl');
                  }}
                />
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">Favicon</label>
            <div className="flex items-center gap-3">
              {faviconPreview && (
                <img src={faviconPreview} alt="Favicon" className="h-10 w-10 rounded-button border border-border object-contain" />
              )}
              <label className="flex items-center gap-2 px-3 py-2 rounded-button border border-border dark:border-neutral-700 text-xs text-muted-gray hover:text-velvet-red cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Favicon</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'favicons', 'faviconUrl');
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" {...register('primaryColor')} className="w-12 h-12 rounded-button border border-border cursor-pointer" />
              <input
                type="text"
                value={primaryColor}
                {...register('primaryColor')}
                className="flex-1 h-12 px-4 rounded-input bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 text-sm font-mono text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" {...register('accentColor')} className="w-12 h-12 rounded-button border border-border cursor-pointer" />
              <input
                type="text"
                value={accentColor}
                {...register('accentColor')}
                className="flex-1 h-12 px-4 rounded-input bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 text-sm font-mono text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">Footer Text</label>
          <textarea
            {...register('footerText')}
            rows={2}
            className="w-full px-4 py-3 rounded-input bg-white dark:bg-neutral-900 border border-border dark:border-neutral-800 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60 resize-none"
            placeholder="Designed for event studios worldwide."
          />
        </div>
      </Card>

      {/* Contact Info */}
      <Card className="p-6 space-y-4">
        <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-border dark:border-neutral-800 pb-3">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Contact Email" type="email" placeholder="studio@yourname.com" {...register('contactEmail')} />
          <Input label="Phone Number" type="tel" placeholder="+63 900 000 0000" {...register('contactPhone')} />
          <Input label="SMS Number" type="tel" placeholder="+63 900 000 0000" {...register('contactSms')} />
          <Input label="Booking URL (Optional)" type="url" placeholder="https://yoursite.com/book" {...register('bookingUrl')} />
        </div>
      </Card>

      {/* Social Links */}
      <Card className="p-6 space-y-4">
        <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-border dark:border-neutral-800 pb-3">
          Social Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Instagram" type="url" placeholder="https://instagram.com/..." {...register('socialInstagram')} />
          <Input label="Facebook" type="url" placeholder="https://facebook.com/..." {...register('socialFacebook')} />
          <Input label="TikTok" type="url" placeholder="https://tiktok.com/@..." {...register('socialTiktok')} />
          <Input label="Website" type="url" placeholder="https://yourstudio.com" {...register('socialWebsite')} />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="accent" type="submit" disabled={isPending} className="flex items-center gap-2">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isPending ? 'Saving...' : 'Save Branding'}</span>
        </Button>
      </div>
    </form>
  );
}
