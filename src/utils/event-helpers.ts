// ─── Event Theme / Category Options & Pure Helpers (Client Safe) ─────────────

export const EVENT_THEMES = [
  'Wedding', 'Birthday', 'Debut', 'Corporate', 'Graduation', 'Christmas', 'Custom',
] as const;

export const EVENT_CATEGORIES = [
  'Wedding', 'Birthday', 'Debut', 'Corporate', 'Graduation',
  'Christmas', 'Gala', 'Party', 'Exhibition', 'Other',
];

export const MEDIA_CATEGORIES = [
  'Photos',
  'Videos',
  '360 Videos',
  'Booth Photos',
  'Booth Strips',
  'GIFs',
] as const;

export function generateRandomAccessCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function generateQRCodeSvgUrl(slug: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  const galleryUrl = `${baseUrl}/gallery/${slug}`;
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(galleryUrl)}&size=256x256&format=svg&color=111111&bgcolor=F7F3EE&margin=10`;
}

export function generateQRCodePngUrl(slug: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
  const galleryUrl = `${baseUrl}/gallery/${slug}`;
  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(galleryUrl)}&size=512x512&format=png&color=111111&bgcolor=F7F3EE&margin=10`;
}
