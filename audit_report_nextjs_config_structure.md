# Audit — Next.js Structure & Config

## Issues Found

### 🔴 Critical

#### 1. `<img ...>` used instead of `next/image`
- **File:** `src/app/page.tsx`, `src/components/admin/events-table.tsx`, `src/components/admin/media-library-client.tsx`, `src/components/admin/event-form.tsx`, etc.
- **Issue:** The application uses standard HTML `<img src={...} />` tags for rendering event covers and thumbnails instead of the optimized `<Image />` component provided by Next.js, despite having `remotePatterns` properly configured in `next.config.mjs`.
- **Impact:** For a media-heavy gallery application, rendering full-size original images as thumbnails will cause massive bandwidth usage, extremely slow page loads, and poor Core Web Vitals (LCP, CLS).
- **Fix:** Replace all `<img />` tags with `import Image from 'next/image'` and use `<Image src={...} fill sizes="..." />` or specify exact width/height for responsive, optimized WebP/AVIF delivery.

#### 2. Landing Page (`src/app/page.tsx`) forces full Client-Side Rendering
- **File:** `src/app/page.tsx`
- **Issue:** The entire root landing page is marked with `'use client';` at the top level.
- **Impact:** Defeats the primary architectural benefit of Next.js App Router (Server Components). The entire page, including static text, layout, and decorative elements, is bundled and shipped to the client as JavaScript. This increases the initial JavaScript payload size, delays time-to-interactive, and negatively impacts SEO.
- **Fix:** Remove `'use client'` from the page. Extract the interactive components (e.g., the search bar and live results dropdown) into a dedicated Client Component (e.g., `<LiveSearch />`) and import it into the Server Component page.

### 🟠 High

#### 3. Missing dynamic SEO Metadata on Gallery Pages
- **File:** `src/app/gallery/[slug]/page.tsx` & `src/app/gallery/[slug]/photos/page.tsx`
- **Issue:** These dynamic Server Components do not export a `generateMetadata` function.
- **Impact:** When guests share a gallery link via text or social media (iMessage, Facebook, WhatsApp), the link preview will show the generic site title and description instead of the specific event's title and cover image. This significantly degrades the social sharing experience and branding.
- **Fix:** Export `generateMetadata` to fetch the event and construct proper Open Graph tags.
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await GalleryService.getEventBySlug(slug);
  return {
    title: event?.seoTitle || event?.title,
    description: event?.seoDescription || event?.description,
    openGraph: { images: [event?.coverImageUrl] }
  };
}
```

#### 4. Fragile Route Protection in Middleware
- **File:** `middleware.ts` (lines 7 & 16)
- **Issue:** The middleware specifically checks `req.nextUrl.pathname.startsWith('/admin/dashboard')` to protect authenticated routes.
- **Impact:** If developers add new administrative routes in the future under `/admin/settings` or `/admin/users` (outside the `dashboard` folder), they will be exposed to the public by default.
- **Fix:** Protect the entire `/admin` prefix and explicitly allow the `/admin` login page itself.
```typescript
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAuthPage = req.nextUrl.pathname === '/admin';
  if (isAdminRoute && !isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }
```

### 🟡 Medium

#### 5. Search Page forces full Client-Side Rendering
- **File:** `src/app/search/page.tsx`
- **Issue:** The entire search page is a Client Component.
- **Impact:** Same as the landing page, this increases bundle size. Search in Next.js App Router is best handled as a Server Component that accepts `searchParams`, fetches data server-side, and passes the results to a Client Component for rendering, providing faster initial load and proper SEO indexing for search result pages.
- **Fix:** Convert the page to a Server Component, parse `searchParams` on the server, fetch data via Prisma, and pass the results to a Client Component.

### 🟢 Low

#### 6. Layout unnecessarily forces dynamic rendering
- **File:** `src/app/layout.tsx` (line 15)
- **Issue:** `export const dynamic = 'force-dynamic';` is used to allow `getBranding()` to run on every request.
- **Impact:** Disables static generation (SSG) for the entire application, including pages that could otherwise be heavily cached. Since branding rarely changes, this results in unnecessary database queries and rendering overhead on every page load.
- **Fix:** Utilize Next.js `unstable_cache` or standard `fetch` cache tags for `getBranding()`, and remove `force-dynamic` to allow Next.js to aggressively cache static pages. Invalidate the cache in the branding update Server Action using `revalidateTag`.

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 2 |
| 🟡 Medium | 1 |
| 🟢 Low | 1 |
| **Total** | **6** |
