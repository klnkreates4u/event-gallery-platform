export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  VIEWER: 'VIEWER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const AccessMode = {
  PUBLIC: 'PUBLIC',
  ACCESS_CODE: 'ACCESS_CODE',
  QR_ONLY: 'QR_ONLY',
} as const;

export type AccessMode = (typeof AccessMode)[keyof typeof AccessMode];

export const MediaType = {
  PHOTO: 'PHOTO',
  VIDEO: 'VIDEO',
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const EventStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

export const StorageType = {
  LOCAL: 'LOCAL',
  CLOUDFLARE_R2: 'CLOUDFLARE_R2',
  GOOGLE_DRIVE: 'GOOGLE_DRIVE',
  DROPBOX: 'DROPBOX',
  CLOUDINARY: 'CLOUDINARY',
  AMAZON_S3: 'AMAZON_S3',
  BACKBLAZE: 'BACKBLAZE',
} as const;

export type StorageType = (typeof StorageType)[keyof typeof StorageType];

export const GalleryActivityType = {
  VIEW: 'VIEW',
  DOWNLOAD: 'DOWNLOAD',
  QR_SCAN: 'QR_SCAN',
  SHARE: 'SHARE',
} as const;

export type GalleryActivityType = (typeof GalleryActivityType)[keyof typeof GalleryActivityType];
