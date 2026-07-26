export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZER' | 'VIEWER';

export type AccessMode = 'PUBLIC' | 'ACCESS_CODE' | 'QR_ONLY';

export type MediaType = 'photo' | 'video';

export type EventTheme =
  | 'Wedding'
  | 'Birthday'
  | 'Debut'
  | 'Corporate'
  | 'Graduation'
  | 'Christmas'
  | 'Custom';

export type StorageProviderType =
  | 'LOCAL'
  | 'CLOUDFLARE_R2'
  | 'GOOGLE_DRIVE'
  | 'DROPBOX'
  | 'CLOUDINARY'
  | 'AMAZON_S3'
  | 'BACKBLAZE';

export type FilterCategory =
  | 'All'
  | 'Photos'
  | 'Videos'
  | 'Highlights'
  | 'Portrait'
  | 'Landscape'
  | 'Booth Strips'
  | 'Family'
  | 'Friends'
  | 'Ceremony'
  | 'Reception'
  | 'Newest'
  | 'Oldest';

export type ToastType = 'success' | 'error' | 'warning' | 'loading';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface UserSession {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  organizationId?: string;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  caption?: string;
  category: string;
  url: string;
  thumbnailUrl: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  width?: number;
  height?: number;
  durationSeconds?: number;
  sortOrder?: number;
  isCover?: boolean;
  isHero?: boolean;
  sizeBytes?: number;
  createdAt: string;
}

export interface EventDetails {
  id: string;
  title: string;
  slug: string;
  description?: string;
  story?: string;
  eventDate: string;
  venue?: string;
  category?: string;
  theme?: EventTheme;
  coverImageUrl: string;
  coverVideoUrl?: string;
  coverVideoPoster?: string;
  accessPin?: string;
  accessMode: AccessMode;
  thankYouMessage?: string;
  isPublic: boolean;
  isArchived?: boolean;
  expiresAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string;
  photosCount: number;
  videosCount: number;
  media: MediaItem[];
}

export interface GalleryEventItem {
  id: string;
  title: string;
  slug: string;
  description?: string;
  eventDate: string;
  venue?: string;
  category?: string;
  theme?: EventTheme;
  coverImageUrl?: string;
  accessPin?: string;
  accessMode?: AccessMode;
  isPublic: boolean;
  isArchived?: boolean;
  photosCount?: number;
  videosCount?: number;
  expiresAt?: string;
  viewsCount?: number;
  downloadsCount?: number;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  eventTitle: string;
  avatarUrl: string;
}

export interface BrandingSettings {
  businessName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  accentColor: string;
  bookingUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  footerText?: string;
  socialInstagram?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  socialWebsite?: string;
}

export interface AdminEventFormData {
  title: string;
  slug: string;
  eventDate: string;
  venue?: string;
  category?: string;
  theme?: EventTheme;
  description?: string;
  story?: string;
  thankYouMessage?: string;
  accessMode: AccessMode;
  accessPin?: string;
  expiresAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string;
  isPublic: boolean;
}

export interface AnalyticsOverview {
  totalVisitors: number;
  totalDownloads: number;
  totalViews: number;
  mostViewedGallery?: GalleryEventItem;
  mostDownloadedCount: number;
  deviceTypes: { label: string; value: number }[];
  trafficSources: { label: string; value: number }[];
  monthlyVisitors: { month: string; value: number }[];
  monthlyUploads: { month: string; value: number }[];
}
