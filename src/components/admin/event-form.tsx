'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, Lock } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DragDropUploader } from '@/components/admin/drag-drop-uploader';
import { AccessCodeGenerator } from '@/components/admin/access-code-generator';
import { QRGenerator } from '@/components/admin/qr-generator';
import { useToast } from '@/providers/toast-provider';
import { EventSchema, EventFormData } from '@/schemas/event';
import { generateSlug, EVENT_CATEGORIES, EVENT_THEMES, MEDIA_CATEGORIES } from '@/utils/event-helpers';

const SECTIONS = ['General', 'Access', 'Media', 'SEO'];

interface EventFormProps {
  initialEvent?: any;
  onSave: (data: EventFormData) => Promise<{ success: boolean; errors?: any }>;
}

export default function EventForm({ initialEvent, onSave }: EventFormProps) {
  const router = useRouter();
  const { success, error, loading, dismiss } = useToast();
  const [activeSection, setActiveSection] = useState('General');
  const [slug, setSlug] = useState(initialEvent?.slug ?? '');
  const [accessCode, setAccessCode] = useState(initialEvent?.accessPin ?? '');
  const [isPending, startTransition] = useTransition();

  // Existing media already saved in the DB — display-only, never re-submitted
  const [existingMediaItems] = useState<{ url: string; type: 'PHOTO' | 'VIDEO'; id?: string }[]>(
    initialEvent?.media?.map((m: any) => ({ url: m.url, type: m.type, id: m.id })) || []
  );

  // Only newly added files (not yet in the DB) — these are what gets submitted
  const [newMediaItems, setNewMediaItems] = useState<{ url: string; type: 'PHOTO' | 'VIDEO'; category?: string }[]>([]);

  // Album category state for photo/video upload organization
  const [albums, setAlbums] = useState<string[]>(() => {
    const defaultCats = ['Photos', 'Videos', '360 Videos', 'Booth Photos', 'Booth Strips', 'GIFs'];
    const existingCats = initialEvent?.media?.map((m: any) => m.category).filter(Boolean) || [];
    return Array.from(new Set([...defaultCats, ...existingCats]));
  });
  const [photoAlbumCategory, setPhotoAlbumCategory] = useState<string>('Photos');
  const [videoAlbumCategory, setVideoAlbumCategory] = useState<string>('Videos');
  const [gifAlbumCategory, setGifAlbumCategory] = useState<string>('GIFs');

  const [selectedAddCategory, setSelectedAddCategory] = useState('');
  const [showAddAlbumPhoto, setShowAddAlbumPhoto] = useState(false);
  const [showAddAlbumVideo, setShowAddAlbumVideo] = useState(false);
  const [showAddAlbumGif, setShowAddAlbumGif] = useState(false);

  // Custom Theme state
  const [isCustomTheme, setIsCustomTheme] = useState<boolean>(
    initialEvent?.theme && !['Wedding', 'Birthday', 'Debut', 'Corporate', 'Graduation', 'Christmas'].includes(initialEvent.theme)
  );
  const [customThemeName, setCustomThemeName] = useState<string>(
    initialEvent?.theme && !['Wedding', 'Birthday', 'Debut', 'Corporate', 'Graduation', 'Christmas'].includes(initialEvent.theme)
      ? initialEvent.theme
      : ''
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: initialEvent?.title ?? '',
      slug: initialEvent?.slug ?? '',
      eventDate: initialEvent?.eventDate
        ? new Date(initialEvent.eventDate).toISOString().split('T')[0]
        : '',
      venue: initialEvent?.venue ?? '',
      category: initialEvent?.category ?? 'Wedding',
      theme: initialEvent?.theme ?? 'Wedding',
      description: initialEvent?.description ?? '',
      story: initialEvent?.story ?? '',
      thankYouMessage: initialEvent?.thankYouMessage ?? '',
      accessMode: initialEvent?.accessMode ?? 'PUBLIC',
      accessPin: initialEvent?.accessPin ?? '',
      expiresAt: initialEvent?.expiresAt
        ? new Date(initialEvent.expiresAt).toISOString().slice(0, 16)
        : '',
      seoTitle: initialEvent?.seoTitle ?? '',
      seoDescription: initialEvent?.seoDescription ?? '',
      tags: initialEvent?.tags ?? '',
      isPublic: initialEvent?.isPublic ?? true,
      coverImageUrl: initialEvent?.coverImageUrl ?? '',
      coverVideoUrl: initialEvent?.coverVideoUrl ?? '',
      // Start with empty array — existing media is already in the DB and must not be re-submitted
      mediaItems: [],
    },
  });

  const accessMode = watch('accessMode');
  const titleValue = watch('title');
  const coverImageUrl = watch('coverImageUrl');
  const coverVideoUrl = watch('coverVideoUrl');

  const { onBlur: titleOnBlur, ...titleRegister } = register('title');

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    titleOnBlur(e);
    if (titleValue && !slug) {
      const generated = generateSlug(titleValue);
      setSlug(generated);
      setValue('slug', generated);
    }
  };

  const handleMediaUpload = (urls: string[], type: 'PHOTO' | 'VIDEO', category: string) => {
    const newItems = urls.map((url) => ({ url, type, category }));
    setNewMediaItems((prev) => {
      const updated = [...prev, ...newItems];
      setValue('mediaItems', updated);
      return updated;
    });
  };

  const handleRemoveNewMedia = (url: string) => {
    setNewMediaItems((prev) => {
      const updated = prev.filter((item) => item.url !== url);
      setValue('mediaItems', updated);
      return updated;
    });
  };

  // Keep access pin in sync with helper state
  useEffect(() => {
    setValue('accessPin', accessCode);
  }, [accessCode, setValue]);

  const onSubmit = (data: EventFormData) => {
    const toastId = loading(
      initialEvent ? 'Updating event...' : 'Creating event...',
      initialEvent ? 'Saving changes to Neon DB' : 'Setting up your new gallery'
    );

    startTransition(async () => {
      const payload = {
        ...data,
        slug: slug || data.slug,
        accessPin: accessMode === 'ACCESS_CODE' ? accessCode : null,
      };

      const result = await onSave(payload);
      dismiss(toastId);

      if (result.success) {
        success(
          initialEvent ? 'Event Updated!' : 'Event Created!',
          `"${data.title}" gallery has been saved.`
        );
        router.push('/admin/dashboard/events');
      } else {
        error(
          'Failed to Save Event',
          result.errors?.slug?.[0] || result.errors?.global?.[0] || 'Please check your inputs and try again.'
        );
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/events">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5" type="button">
              <ArrowLeft className="w-4 h-4" />
              <span>Events</span>
            </Button>
          </Link>
          <div>
            <h1 className="font-editorial text-2xl font-bold text-primary-black dark:text-soft-cream">
              {initialEvent ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-xs text-muted-gray mt-0.5">
              {initialEvent ? `Updating: ${initialEvent.title}` : 'Fill in event details to create a new gallery'}
            </p>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-soft-cream dark:bg-neutral-900 rounded-button border border-warm-ivory dark:border-neutral-800 w-fit">
        {SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => setActiveSection(section)}
            className={`px-4 py-1.5 rounded-button text-xs font-semibold transition-all ${
              activeSection === section
                ? 'bg-white dark:bg-neutral-800 text-primary-black dark:text-soft-cream shadow-sm'
                : 'text-muted-gray hover:text-primary-black dark:hover:text-soft-cream'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ─── GENERAL SECTION ─────────────────────────── */}
        {activeSection === 'General' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <Card className="p-6 space-y-5">
              <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-warm-ivory dark:border-neutral-800 pb-3">
                Event Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Event Title *"
                  placeholder="e.g. Elena & Julian Wedding"
                  error={errors.title?.message}
                  {...titleRegister}
                  onBlur={handleTitleBlur}
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                    Gallery Slug *
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setSlug(val);
                      setValue('slug', val);
                    }}
                    placeholder="elena-julian-wedding"
                    className="w-full h-12 px-4 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-primary-black dark:text-soft-cream font-mono text-sm focus:outline-none focus:ring-2 focus:ring-velvet-red/60 transition-all"
                  />
                  {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                  <p className="text-[11px] text-muted-gray">URL: /gallery/{slug || 'your-slug'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  type="date"
                  label="Event Date *"
                  error={errors.eventDate?.message}
                  {...register('eventDate')}
                />
                <Input label="Venue" placeholder="Metropolitan Club, NY" {...register('venue')} />
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="w-full h-12 px-4 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60"
                  >
                    {EVENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Brief event description shown on the gallery welcome page..."
                  className="w-full px-4 py-3 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Event Story
                </label>
                <textarea
                  {...register('story')}
                  rows={4}
                  placeholder="Tell the story behind this event in detail..."
                  className="w-full px-4 py-3 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Thank You Message
                </label>
                <textarea
                  {...register('thankYouMessage')}
                  rows={2}
                  placeholder="Thank you for celebrating this special day with us..."
                  className="w-full px-4 py-3 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60 resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Gallery Theme
                </label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_THEMES.map((theme) => {
                    const themeValue = watch('theme');
                    const isSelected =
                      theme === 'Custom'
                        ? isCustomTheme
                        : !isCustomTheme && themeValue === theme;

                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => {
                          if (theme === 'Custom') {
                            setIsCustomTheme(true);
                            setValue('theme', customThemeName || 'Custom');
                          } else {
                            setIsCustomTheme(false);
                            setValue('theme', theme);
                          }
                        }}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-primary-black text-white dark:bg-soft-cream dark:text-primary-black border-primary-black dark:border-soft-cream shadow-sm'
                            : 'border-warm-ivory dark:border-neutral-700 text-muted-gray hover:border-primary-black dark:hover:border-soft-cream'
                        }`}
                      >
                        {theme}
                      </button>
                    );
                  })}
                </div>

                {isCustomTheme && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray mb-1">
                      Custom Theme Name
                    </label>
                    <input
                      type="text"
                      value={customThemeName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomThemeName(val);
                        setValue('theme', val || 'Custom');
                      }}
                      placeholder="e.g. Retro Neon, Vintage Gold, Velvet Luxe..."
                      className="w-full h-11 px-4 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60"
                    />
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── ACCESS SECTION ─────────────────────────── */}
        {activeSection === 'Access' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <Card className="p-6 space-y-5">
              <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-warm-ivory dark:border-neutral-800 pb-3">
                Access & Security
              </h2>

              {/* Visibility Mode */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Gallery Access Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'PUBLIC', label: 'Public', desc: 'Anyone with the link can view' },
                    { value: 'ACCESS_CODE', label: 'Access Code (PIN)', desc: 'Guests enter a PIN to unlock' },
                    { value: 'QR_ONLY', label: 'QR Code Only', desc: 'Only accessible via QR scan' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`p-4 rounded-card border-2 cursor-pointer transition-all ${
                        accessMode === opt.value
                          ? 'border-velvet-red bg-velvet-red/5'
                          : 'border-warm-ivory dark:border-neutral-800 hover:border-velvet-red/50'
                      }`}
                    >
                      <input type="radio" {...register('accessMode')} value={opt.value} className="hidden" />
                      <p className="text-sm font-semibold text-primary-black dark:text-soft-cream">
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-muted-gray mt-0.5">{opt.desc}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Access Code field */}
              {accessMode === 'ACCESS_CODE' && (
                <AccessCodeGenerator value={accessCode} onChange={setAccessCode} />
              )}

              {/* QR Preview */}
              {slug && <QRGenerator slug={slug || 'your-event-slug'} eventTitle={titleValue} />}

              {/* Expiry */}
              <Input type="datetime-local" label="Gallery Expiration Date (Optional)" {...register('expiresAt')} />

              {/* Visibility Toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isPublic')}
                  className="w-4 h-4 accent-velvet-red rounded-sm"
                />
                <div>
                  <p className="text-sm font-semibold text-primary-black dark:text-soft-cream">
                    Make Event Public
                  </p>
                  <p className="text-xs text-muted-gray">
                    Listed in public gallery search. Uncheck to hide from search.
                  </p>
                </div>
              </label>
            </Card>
          </motion.div>
        )}

        {/* ─── MEDIA SECTION ─────────────────────────── */}
        {activeSection === 'Media' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <Card className="p-6 space-y-5">
              <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-warm-ivory dark:border-neutral-800 pb-3">
                Cover Media
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                    Cover Image
                  </label>
                  <DragDropUploader
                    accept="photo"
                    multiple={false}
                    maxFileSizeMb={20}
                    initialUrls={coverImageUrl ? [coverImageUrl] : []}
                    onUploadComplete={(urls) => setValue('coverImageUrl', urls[0])}
                    onRemoveFile={() => setValue('coverImageUrl', '')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                    Hero Cover Video (MP4 · Max 30s)
                  </label>
                  <DragDropUploader
                    accept="video"
                    multiple={false}
                    maxFileSizeMb={100}
                    initialUrls={coverVideoUrl ? [coverVideoUrl] : []}
                    onUploadComplete={(urls) => setValue('coverVideoUrl', urls[0])}
                    onRemoveFile={() => setValue('coverVideoUrl', '')}
                  />
                </div>
              </div>
            </Card>
            <Card className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-ivory dark:border-neutral-800 pb-3">
                <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">
                  Gallery Photos
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-gray whitespace-nowrap">
                    Target Album:
                  </label>
                  <select
                    value={photoAlbumCategory}
                    onChange={(e) => setPhotoAlbumCategory(e.target.value)}
                    className="h-9 px-3 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-xs font-semibold text-primary-black dark:text-soft-cream focus:outline-none"
                  >
                    {albums.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {!showAddAlbumPhoto ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAlbumPhoto(true);
                        const filtered = ['360 Videos', 'Booth Photos', 'Booth Strips', 'GIFs'];
                        setSelectedAddCategory(filtered[0]);
                      }}
                      className="px-2 py-1 text-xs font-semibold text-velvet-red hover:underline"
                    >
                      + New Album
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 p-1 rounded-md border border-warm-ivory dark:border-neutral-700">
                      <select
                        value={selectedAddCategory}
                        onChange={(e) => setSelectedAddCategory(e.target.value)}
                        className="h-7 px-2 text-xs rounded border border-warm-ivory bg-white dark:bg-neutral-900 focus:outline-none dark:border-neutral-700 text-primary-black dark:text-soft-cream"
                      >
                        {['360 Videos', 'Booth Photos', 'Booth Strips', 'GIFs']
                          .map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))
                        }
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedAddCategory) {
                            if (!albums.includes(selectedAddCategory)) {
                              setAlbums((prev) => [...prev, selectedAddCategory]);
                            }
                            setPhotoAlbumCategory(selectedAddCategory);
                          }
                          setSelectedAddCategory('');
                          setShowAddAlbumPhoto(false);
                        }}
                        className="px-2 py-1 text-[10px] bg-velvet-red hover:bg-velvet-red/90 text-white rounded font-bold transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddCategory('');
                          setShowAddAlbumPhoto(false);
                        }}
                        className="px-1 text-[10px] text-muted-gray hover:text-primary-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing photos already in DB (read-only display) */}
              {existingMediaItems.filter((i) => i.type === 'PHOTO').length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-gray">
                    Existing Photos ({existingMediaItems.filter((i) => i.type === 'PHOTO').length})
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                    {existingMediaItems
                      .filter((i) => i.type === 'PHOTO')
                      .map((item) => (
                        <div key={item.url} className="relative aspect-square rounded-button overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-warm-ivory dark:border-neutral-700">
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                  </div>
                  <p className="text-[11px] text-muted-gray">To remove existing photos, use the Media Library.</p>
                </div>
              )}

              {/* New photos to be added */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Add New Photos to "{photoAlbumCategory}" Album
                </p>
                <DragDropUploader
                  accept="photo"
                  multiple
                  maxFileSizeMb={20}
                  initialUrls={[]}
                  onUploadComplete={(urls) => handleMediaUpload(urls, 'PHOTO', photoAlbumCategory)}
                  onRemoveFile={handleRemoveNewMedia}
                />
              </div>
            </Card>

            <Card className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-ivory dark:border-neutral-800 pb-3">
                <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">
                  Gallery Videos (MP4 · Max 30s each)
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-gray whitespace-nowrap">
                    Target Album:
                  </label>
                  <select
                    value={videoAlbumCategory}
                    onChange={(e) => setVideoAlbumCategory(e.target.value)}
                    className="h-9 px-3 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-xs font-semibold text-primary-black dark:text-soft-cream focus:outline-none"
                  >
                    {albums.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {!showAddAlbumVideo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAlbumVideo(true);
                        const filtered = ['360 Videos', 'Booth Photos', 'Booth Strips', 'GIFs'];
                        setSelectedAddCategory(filtered[0]);
                      }}
                      className="px-2 py-1 text-xs font-semibold text-velvet-red hover:underline"
                    >
                      + New Album
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 p-1 rounded-md border border-warm-ivory dark:border-neutral-700">
                      <select
                        value={selectedAddCategory}
                        onChange={(e) => setSelectedAddCategory(e.target.value)}
                        className="h-7 px-2 text-xs rounded border border-warm-ivory bg-white dark:bg-neutral-900 focus:outline-none dark:border-neutral-700 text-primary-black dark:text-soft-cream"
                      >
                        {['360 Videos', 'Booth Photos', 'Booth Strips', 'GIFs']
                          .map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))
                        }
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedAddCategory) {
                            if (!albums.includes(selectedAddCategory)) {
                              setAlbums((prev) => [...prev, selectedAddCategory]);
                            }
                            setVideoAlbumCategory(selectedAddCategory);
                          }
                          setSelectedAddCategory('');
                          setShowAddAlbumVideo(false);
                        }}
                        className="px-2 py-1 text-[10px] bg-velvet-red hover:bg-velvet-red/90 text-white rounded font-bold transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddCategory('');
                          setShowAddAlbumVideo(false);
                        }}
                        className="px-1 text-[10px] text-muted-gray hover:text-primary-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing videos already in DB (read-only display) */}
              {existingMediaItems.filter((i) => i.type === 'VIDEO').length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-gray">
                    Existing Videos ({existingMediaItems.filter((i) => i.type === 'VIDEO').length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {existingMediaItems
                      .filter((i) => i.type === 'VIDEO')
                      .map((item) => (
                        <div key={item.url} className="flex items-center gap-2 px-3 py-2 rounded-button border border-warm-ivory dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-muted-gray">
                          <span>🎬</span>
                          <span className="truncate max-w-[140px]">{item.url.split('/').pop()}</span>
                        </div>
                      ))}
                  </div>
                  <p className="text-[11px] text-muted-gray">To remove existing videos, use the Media Library.</p>
                </div>
              )}

              {/* New videos to be added */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Add New Videos to "{videoAlbumCategory}" Album
                </p>
                <DragDropUploader
                  accept="video"
                  multiple
                  maxFileSizeMb={100}
                  initialUrls={[]}
                  onUploadComplete={(urls) => handleMediaUpload(urls, 'VIDEO', videoAlbumCategory)}
                  onRemoveFile={handleRemoveNewMedia}
                />
              </div>
            </Card>

            <Card className="p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-warm-ivory dark:border-neutral-800 pb-3">
                <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream">
                  Gallery GIFs (GIF format only)
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-gray whitespace-nowrap">
                    Target Album:
                  </label>
                  <select
                    value={gifAlbumCategory}
                    onChange={(e) => setGifAlbumCategory(e.target.value)}
                    className="h-9 px-3 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-xs font-semibold text-primary-black dark:text-soft-cream focus:outline-none"
                  >
                    {albums.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {!showAddAlbumGif ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAlbumGif(true);
                        const filtered = ['360 Videos', 'Booth Photos', 'Booth Strips'];
                        setSelectedAddCategory(filtered[0]);
                      }}
                      className="px-2 py-1 text-xs font-semibold text-velvet-red hover:underline"
                    >
                      + New Album
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-800 p-1 rounded-md border border-warm-ivory dark:border-neutral-700">
                      <select
                        value={selectedAddCategory}
                        onChange={(e) => setSelectedAddCategory(e.target.value)}
                        className="h-7 px-2 text-xs rounded border border-warm-ivory bg-white dark:bg-neutral-900 focus:outline-none dark:border-neutral-700 text-primary-black dark:text-soft-cream"
                      >
                        {['360 Videos', 'Booth Photos', 'Booth Strips']
                          .map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))
                        }
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedAddCategory) {
                            if (!albums.includes(selectedAddCategory)) {
                              setAlbums((prev) => [...prev, selectedAddCategory]);
                            }
                            setGifAlbumCategory(selectedAddCategory);
                          }
                          setSelectedAddCategory('');
                          setShowAddAlbumGif(false);
                        }}
                        className="px-2 py-1 text-[10px] bg-velvet-red hover:bg-velvet-red/90 text-white rounded font-bold transition-colors"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddCategory('');
                          setShowAddAlbumGif(false);
                        }}
                        className="px-1 text-[10px] text-muted-gray hover:text-primary-black"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing GIFs */}
              {existingMediaItems.filter((i) => i.url.toLowerCase().endsWith('.gif')).length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-gray">
                    Existing GIFs ({existingMediaItems.filter((i) => i.url.toLowerCase().endsWith('.gif')).length})
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                    {existingMediaItems
                      .filter((i) => i.url.toLowerCase().endsWith('.gif'))
                      .map((item) => (
                        <div key={item.url} className="relative aspect-square rounded-button overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-warm-ivory dark:border-neutral-700">
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                  </div>
                  <p className="text-[11px] text-muted-gray">To remove existing GIFs, use the Media Library.</p>
                </div>
              )}

              {/* New GIFs */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  Add New GIFs to "{gifAlbumCategory}" Album
                </p>
                <DragDropUploader
                  accept="photo"
                  multiple
                  maxFileSizeMb={20}
                  initialUrls={[]}
                  onUploadComplete={(urls) => handleMediaUpload(urls, 'PHOTO', gifAlbumCategory)}
                  onRemoveFile={handleRemoveNewMedia}
                />
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── SEO SECTION ─────────────────────────── */}
        {activeSection === 'SEO' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <Card className="p-6 space-y-5">
              <h2 className="font-editorial text-lg font-semibold text-primary-black dark:text-soft-cream border-b border-warm-ivory dark:border-neutral-800 pb-3">
                SEO & Discoverability
              </h2>
              <Input
                label="SEO Page Title"
                placeholder="e.g. Elena & Julian Wedding Gallery | LuxeGallery"
                {...register('seoTitle')}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-gray">
                  SEO Meta Description
                </label>
                <textarea
                  {...register('seoDescription')}
                  rows={3}
                  placeholder="Short description for search engines (under 160 characters)..."
                  className="w-full px-4 py-3 rounded-input bg-white dark:bg-neutral-900 border border-warm-ivory dark:border-neutral-800 text-sm text-primary-black dark:text-soft-cream focus:outline-none focus:ring-2 focus:ring-velvet-red/60 resize-none"
                />
              </div>
              <Input label="Tags (comma-separated)" placeholder="wedding, napa valley, sunset, romantic" {...register('tags')} />
            </Card>
          </motion.div>
        )}

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between gap-4 p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-warm-ivory dark:border-neutral-800 rounded-card shadow-xl">
          <p className="text-xs text-muted-gray hidden sm:block">
            {slug ? `Gallery URL: /gallery/${slug}` : 'Set event title to generate slug'}
          </p>
          <div className="flex items-center gap-3 ml-auto">
            <Link href="/admin/dashboard/events">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button variant="accent" type="submit" disabled={isPending} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>{isPending ? 'Saving...' : initialEvent ? 'Save Changes' : 'Create Event'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
