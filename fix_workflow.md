# Fix Workflow — Full-Stack Audit
**Project:** Gallery App  
**Date:** 2026-07-30  
**Total Issues:** 56 across 8 areas  

---

## Master Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 12 |
| 🟠 High | 14 |
| 🟡 Medium | 15 |
| 🟢 Low | 15 |
| **Total** | **56** |

---

## How to Use This Workflow

Work through the phases in order. Do not move to the next phase until the current one is done.  
Each fix references the exact file and audit report it came from.  
After completing each fix, check it off and commit with a meaningful message.

---

# PHASE 1 — Stop the Bleeding (Do These Today)
> These are active vulnerabilities or data integrity risks. Every minute in production they are unfixed is a risk.

---

### STEP 1 — Rotate ALL credentials immediately
**Why first:** Your `.env` file may have been committed to git. Even if it hasn't, these issues mean your credentials are at risk.

- [ ] Go to Supabase dashboard → regenerate `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Go to your DB provider → rotate `DATABASE_URL` password
- [ ] Regenerate `NEXTAUTH_SECRET` (run `openssl rand -base64 32`)
- [ ] Check git history: `git log --all --full-history -- .env` — if `.env` ever appears, run `git filter-repo` or BFG Repo Cleaner to purge it
- [ ] Verify `.env` is in `.gitignore` right now

**Source:** Prisma audit — Priority Fix #1

---

### STEP 2 — Fix the authentication bypass in `createEventAction`
**File:** `src/actions/event.ts` (lines 18–27)  
**Why:** Any unauthenticated user on the internet can create events on your platform right now.

- [ ] Remove the `db.organization.findFirst()` fallback
- [ ] Add hard check: if no `session?.user?.organizationId` → return Unauthorized immediately

```typescript
const session = await auth();
if (!session?.user?.organizationId) {
  return { success: false, errors: { global: ['Unauthorized. Please log in.'] } };
}
const organizationId = session.user.organizationId;
```

**Source:** Prisma audit #3, API Routes audit #1

---

### STEP 3 — Fix the unprotected Cron endpoint
**File:** `src/app/api/cron/cleanup/route.ts` (line 25)  
**Why:** If `CRON_SECRET` is missing from env, anyone can hit this endpoint and hammer your database.

- [ ] Fail immediately if `CRON_SECRET` is not set — do not proceed
- [ ] Add `CRON_SECRET` to your `.env` and `.env.example` now

```typescript
const secret = process.env.CRON_SECRET;
if (!secret) {
  return NextResponse.json({ error: 'Cron secret not configured' }, { status: 500 });
}
if (authHeader !== `Bearer ${secret}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Source:** API Routes audit #2

---

### STEP 4 — Fix the Service Role key fallback in Supabase
**File:** `src/services/storage/supabase-provider.ts` (lines 13–16)  
**Why:** If the service role key is missing, the app silently falls back to the anon key for file operations — meaning either your storage breaks silently, or your bucket must be publicly writable (which means anyone can upload).

- [ ] Throw an error on startup if `SUPABASE_SERVICE_ROLE_KEY` is missing — never fall back

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY must be set');
}
```

**Source:** Supabase audit #2

---

### STEP 5 — Delete the `AuthService` dead-code file
**File:** `src/services/auth.ts`  
**Why:** This file has a method that always returns `true` for credential validation and a hardcoded admin user. If it ever gets imported by mistake, it bypasses all auth.

- [ ] Delete `src/services/auth.ts` entirely
- [ ] Search the entire codebase for any import of this file and remove them

**Source:** Prisma audit #24

---

# PHASE 2 — Security Hardening (This Week)
> These are exploitable issues that need fixing before you go public or share the app with real users.

---

### STEP 6 — Hash access PINs
**File:** `prisma/schema.prisma` (line 67), `src/services/gallery.ts` (line 84), `src/actions/event.ts`  
**Why:** PINs are stored in plaintext. A database breach exposes every event's PIN.

- [ ] Install `bcryptjs`: `npm install bcryptjs && npm install -D @types/bcryptjs`
- [ ] In `createEventAction` and `updateEventAction`: hash the PIN before saving with `bcrypt.hash(pin, 10)`
- [ ] In `GalleryService.verifyAccessCode()`: replace `===` comparison with `bcrypt.compare()`
- [ ] Migrate any existing PINs in the database (write a one-time script)

**Source:** Prisma audit #1

---

### STEP 7 — Encrypt storage provider credentials
**File:** `prisma/schema.prisma` (line 125)  
**Why:** API keys and secret tokens for cloud storage are stored as plaintext strings in your DB.

- [ ] Add `CREDENTIALS_ENCRYPTION_KEY` env variable (generate with `openssl rand -hex 32`)
- [ ] Create an encrypt/decrypt utility using Node's `crypto` module (AES-256-GCM)
- [ ] Update the `StorageProvider` model: rename field to `credentialsEnc`, add `credentialsIv`
- [ ] Write a migration to encrypt existing records
- [ ] Update all code that reads/writes credentials to use the utility

**Source:** Prisma audit #2

---

### STEP 8 — Fix XSS in Terms/Privacy pages
**File:** `src/app/terms/page.tsx` & `src/app/privacy/page.tsx` (lines 87, 110)  
**Why:** Admin-stored HTML is rendered directly with `dangerouslySetInnerHTML` — a compromised admin account can inject JavaScript that runs for all visitors.

- [ ] Install `isomorphic-dompurify`: `npm install isomorphic-dompurify`
- [ ] Wrap all `dangerouslySetInnerHTML` calls: `DOMPurify.sanitize(rawContent)`

**Source:** React Frontend audit #2

---

### STEP 9 — Fix CSS injection in event themes
**File:** `src/components/gallery/event-theme-override.tsx` (line 95), `src/schemas/event.ts`  
**Why:** Custom theme colors are rendered into a `<style>` tag with no validation. Any string is accepted, allowing CSS injection.

- [ ] Add hex color validation to the Zod schema for ALL color fields:
```typescript
themePrimaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional().nullable(),
```

**Source:** React Frontend audit #3

---

### STEP 10 — Fix SSRF in the downloads API
**File:** `src/app/api/downloads/route.ts` (lines 15–35)  
**Why:** The route fetches a server-side URL from a client-provided query parameter. An attacker can make your server call internal endpoints or AWS metadata URLs.

- [ ] Validate that `urlParam` strictly starts with your Supabase storage URL before fetching
- [ ] Replace the flawed path traversal regex with `path.resolve` + `startsWith` for local key paths
- [ ] Reject anything that doesn't match the expected pattern with a 400

**Source:** API Routes audit #3

---

### STEP 11 — Fix middleware to protect ALL `/admin` routes
**File:** `middleware.ts` (lines 7, 16)  
**Why:** Only `/admin/dashboard` is currently protected. Any future `/admin/settings`, `/admin/users`, etc. will be publicly accessible by default.

- [ ] Change the check from `startsWith('/admin/dashboard')` to `startsWith('/admin')`
- [ ] Explicitly exclude only `/admin` (the login page itself)

```typescript
const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
const isAuthPage = req.nextUrl.pathname === '/admin';
if (isAdminRoute && !isAuthPage && !isLoggedIn) {
  return NextResponse.redirect(new URL('/admin', req.nextUrl));
}
```

**Source:** NextAuth audit #1, Next.js Config audit #4

---

### STEP 12 — Protect `getStorageUsageAction`
**File:** `src/actions/media.ts` (lines 76–119)  
**Why:** This action has no auth check — anyone can query your platform's total storage usage.

- [ ] Add `const session = await auth(); if (!session?.user) throw new Error('Unauthorized');` at the top

**Source:** API Routes audit #4

---

# PHASE 3 — Data Integrity & Production Safety (Before Launch)
> These won't cause an immediate breach but will cause data loss, corruption, or silent failures in production.

---

### STEP 13 — Switch from `prisma db push` to migrations
**Why:** `db push` in production can silently drop columns. You have no rollback capability and no history.

- [ ] Run: `npx prisma migrate dev --name init`
- [ ] Update `package.json`: replace `db:push` with `"db:migrate": "prisma migrate deploy"`
- [ ] Update your build/deploy script: `prisma generate && prisma migrate deploy && next build`
- [ ] Commit the generated `prisma/migrations/` folder

**Source:** Prisma audit #4

---

### STEP 14 — Fix organization scoping across all admin queries
**Files:** `src/services/admin.ts`, `src/app/admin/dashboard/events/page.tsx`, media library page  
**Why:** `getAdminEventList()`, `getDashboardMetrics()`, and the media library all return data across ALL organizations when called without an `organizationId`.

- [ ] Make `organizationId` required (not optional) in all admin service functions
- [ ] Pass `session.user.organizationId` from every calling page
- [ ] Test: log in as one org, verify you cannot see another org's events

**Source:** Prisma audit #8, #9

---

### STEP 15 — Fix the bulk delete N+1 loops
**Files:** `src/actions/event.ts` (lines 222–226), `src/actions/media.ts` (lines 58–61), `src/app/api/cron/cleanup/route.ts` (lines 52–76)  
**Why:** Sequential file deletions in a loop will time out on Vercel for any event with more than ~50 photos.

- [ ] Replace `for...of` loops with `Promise.allSettled()` in batches of 10
- [ ] In the cron job: use `updateMany` to archive all expired events in one DB call
- [ ] Add Supabase bulk delete support (`storage.remove([key1, key2, ...])`)

**Source:** Prisma audit #5, #6, #7, Logic audit #1

---

### STEP 16 — Fix the localStorage favorites race condition
**File:** `src/app/gallery/[slug]/photos/gallery-photos-client.tsx` (lines 47–65)  
**Why:** Users lose all their saved favorites on every page refresh.

- [ ] Add an `isLoaded` flag — only save to localStorage after the initial load `useEffect` has completed

```typescript
const [isLoaded, setIsLoaded] = useState(false);
useEffect(() => {
  // load favorites...
  setIsLoaded(true);
}, [slug]);

useEffect(() => {
  if (!isLoaded) return;
  localStorage.setItem(`gallery_favorites_${slug}`, JSON.stringify(Array.from(favorites)));
}, [favorites, slug, isLoaded]);
```

**Source:** React Frontend audit #1

---

### STEP 17 — Fix the broken `storage.objects` raw query
**File:** `src/actions/media.ts` (lines 83–87)  
**Why:** This query runs against Supabase's internal schema which doesn't exist in your Neon database. It throws on every call and pollutes your logs.

- [ ] Remove the entire `try` block with the raw SQL
- [ ] Keep only the Prisma `aggregate` fallback as the primary logic

**Source:** Supabase audit #1, Logic audit #4

---

### STEP 18 — Fix timezone date shift bug
**File:** `src/actions/event.ts` (line 50), `src/components/admin/event-form.tsx` (line 80)  
**Why:** Event dates display as the day before for users in negative timezones (US, Canada, Latin America).

- [ ] Install `date-fns`: `npm install date-fns`
- [ ] Parse date strings using `parseISO()` instead of `new Date('YYYY-MM-DD')`
- [ ] Or manually parse: `const [y,m,d] = str.split('-'); new Date(y, m-1, d)`

**Source:** Logic audit #2

---

### STEP 19 — Remove `PrismaAdapter` from NextAuth config
**File:** `auth.ts` (line 9)  
**Why:** You're using JWT + Credentials. The adapter is unused, expects tables that don't exist in your schema, and could cause silent failures.

- [ ] Remove `adapter: PrismaAdapter(db)` from your NextAuth config
- [ ] Remove `@auth/prisma-adapter` from `package.json` if it's only used there

**Source:** NextAuth audit #2, Prisma audit #23

---

# PHASE 4 — Performance & Code Quality (After Launch)
> Real issues that affect user experience and scalability, but not immediate security risks.

---

### STEP 20 — Replace all `<img>` tags with `<Image />`
**Files:** `src/app/page.tsx`, `src/components/admin/events-table.tsx`, `src/components/admin/media-library-client.tsx`, `src/components/admin/event-form.tsx`  
**Why:** A gallery app loading full-size unoptimized images will be extremely slow, especially on mobile.

- [ ] Search codebase for `<img ` and replace each with `next/image`
- [ ] Set appropriate `width`, `height`, or `fill` + `sizes` on each

**Source:** Next.js Config audit #1

---

### STEP 21 — Fix the landing page client-side rendering
**File:** `src/app/page.tsx`  
**Why:** The entire homepage is a Client Component, losing all SSR/SEO benefits.

- [ ] Remove `'use client'` from `page.tsx`
- [ ] Extract only the interactive search/dropdown into a `<LiveSearch />` Client Component
- [ ] Keep everything else as a Server Component

**Source:** Next.js Config audit #2

---

### STEP 22 — Add Open Graph metadata to gallery pages
**Files:** `src/app/gallery/[slug]/page.tsx`, `src/app/gallery/[slug]/photos/page.tsx`  
**Why:** Shared gallery links show no preview image or title on WhatsApp, iMessage, Facebook, etc.

- [ ] Export `generateMetadata()` from each gallery page
- [ ] Include `openGraph.images` with the event's cover image URL

**Source:** Next.js Config audit #3

---

### STEP 23 — Wrap gallery filter in `useMemo`
**File:** `src/app/gallery/[slug]/photos/gallery-photos-client.tsx` (lines 111–152)  
**Why:** The filter function runs on every render and creates new object references, forcing the entire masonry grid to re-render constantly.

- [ ] Wrap `getFilteredMedia()` in `useMemo` with `[event.media, activeFilter]` as dependencies

**Source:** Dependencies audit #1

---

### STEP 24 — Add `select` clauses to over-fetching Prisma queries
**File:** `src/services/gallery.ts` (lines 72–99)  
**Why:** `searchEvents` and `getRelatedEvents` fetch entire records including large text fields just to show summary cards.

- [ ] Add strict `select: { id, slug, title, coverImageUrl, eventDate, venue }` to both queries

**Source:** Dependencies audit #2

---

### STEP 25 — Implement pagination in event listings
**File:** `src/services/gallery.ts` (lines 76, 98)  
**Why:** Only the first 20 events are ever accessible. As the platform grows, older events become invisible.

- [ ] Add `skip` + `take` parameters to `searchEvents` and `getRelatedEvents`
- [ ] Add "Load More" button to the frontend components

**Source:** Logic audit #3

---

### STEP 26 — Remove `'use client'` from search page
**File:** `src/app/search/page.tsx`  
**Why:** Search results should be server-rendered for performance and SEO.

- [ ] Convert to Server Component that reads `searchParams` and fetches via Prisma
- [ ] Pass results to a Client Component for rendering

**Source:** Next.js Config audit #5

---

### STEP 27 — Fix `force-dynamic` on root layout
**File:** `src/app/layout.tsx` (line 15)  
**Why:** This disables all static caching across the entire app for a branding query that rarely changes.

- [ ] Wrap `getBranding()` with `unstable_cache` with a `branding` tag
- [ ] Remove `export const dynamic = 'force-dynamic'`
- [ ] Call `revalidateTag('branding')` in the branding update Server Action

**Source:** Next.js Config audit #6, Prisma audit #17

---

# PHASE 5 — Clean-up & Low Priority (When You Have Time)

| # | Fix | File | Source |
|---|-----|------|--------|
| 28 | Remove `react-quill` unused package | `package.json` | Dependencies audit #4 |
| 29 | Rename `NEXT_PUBLIC_SUPABASE_*` vars — no need for public prefix | `supabase-provider.ts` | Supabase audit #4 |
| 30 | Add no-store fetch config to Supabase client | `supabase-provider.ts` | Supabase audit #5 |
| 31 | Add loading skeletons to `related-events.tsx` | `src/components/gallery/related-events.tsx` | React audit #5 |
| 32 | Fix error responses leaking internal messages in API routes | Multiple API routes | API audit #5, NextAuth audit #3 |
| 33 | Add Zod validation to Analytics API body | `src/app/api/analytics/route.ts` | API audit #7 |
| 34 | Add permission check on upload route (`slug` ownership) | `src/app/api/upload/route.ts` | API audit #6 |
| 35 | Throw instead of silently returning `false` on storage delete failure | `supabase-provider.ts` | Logic audit #5 |
| 36 | Change `User.role` default from `"ADMIN"` to `"VIEWER"` | `schema.prisma` | Prisma audit #20 |
| 37 | Change `Media.sizeBytes` from `Int?` to `BigInt?` | `schema.prisma` | Prisma audit #21 |
| 38 | Replace string-typed enum fields with Prisma enums | `schema.prisma` | Prisma audit #10 |
| 39 | Add `@@index([name])` to Organization model | `schema.prisma` | Prisma audit #22 |
| 40 | Add proper TypeScript types — remove all `any` | Multiple components | React audit #4 |
| 41 | Add `$disconnect` graceful shutdown to Prisma client | `src/database/db.ts` | Prisma audit #19 |
| 42 | Replace `token.id` with `token.sub` in NextAuth JWT callback | `auth.ts` | NextAuth audit #4 |
| 43 | Remove or implement unused `StorageProvider` DB model | `schema.prisma` | Prisma audit #11 |
| 44 | Remove or implement unused `AuditLog` DB model | `schema.prisma` | Prisma audit #12 |
| 45 | Convert `Event.tags` from `String?` to `String[]` array | `schema.prisma` | Prisma audit #18 |

---

## Commit Message Guide

Use this format as you work through each step:

```
fix(auth): remove organization fallback in createEventAction [PHASE 1 - STEP 2]
fix(cron): fail fast when CRON_SECRET is not configured [PHASE 1 - STEP 3]
fix(storage): throw on missing SUPABASE_SERVICE_ROLE_KEY [PHASE 1 - STEP 4]
security(gallery): hash access PINs with bcrypt [PHASE 2 - STEP 6]
security(xss): sanitize dangerouslySetInnerHTML with DOMPurify [PHASE 2 - STEP 8]
```

---

*Based on audit reports generated 2026-07-30. Verify all findings against the live codebase before applying.*
