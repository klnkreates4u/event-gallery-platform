import { z } from 'zod';

export const EventSchema = z.object({
  title: z.string().min(3, 'Event title must be at least 3 characters').max(120),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  eventDate: z.string().min(1, 'Event date is required'),
  venue: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  theme: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  story: z.string().optional().nullable(),
  thankYouMessage: z.string().optional().nullable(),
  accessMode: z.enum(['PUBLIC', 'ACCESS_CODE', 'QR_ONLY']).default('PUBLIC'),
  accessPin: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  isPublic: z.boolean().default(true),
  coverImageUrl: z.string().optional().nullable(),
  coverVideoUrl: z.string().optional().nullable(),
  themePrimaryColor: z.string().optional().nullable(),
  themeSecondaryColor: z.string().optional().nullable(),
  themeAccentColor: z.string().optional().nullable(),
  themeBackgroundColor: z.string().optional().nullable(),
  themeBorderColor: z.string().optional().nullable(),
  themeButtonColor: z.string().optional().nullable(),
  mediaItems: z.array(z.object({
    url: z.string(),
    type: z.enum(['PHOTO', 'VIDEO']),
    title: z.string().optional(),
    category: z.string().optional(),
    sizeBytes: z.number().optional(),
  })).optional(),
});

export type EventFormData = z.infer<typeof EventSchema>;
