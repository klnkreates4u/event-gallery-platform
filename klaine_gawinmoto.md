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

# PHASE 4 — Performance & Code Quality (After Launch)
> Real issues that affect user experience and scalability, but not immediate security risks.

---

### STEP 20 — Replace all `<img>` tags with `<Image />`
**Files:** `src/app/page.tsx`, `src/components/admin/events-table.tsx`, `src/components/admin/media-library-client.tsx`, `src/components/admin/event-form.tsx`  
**Why:** A gallery app loading full-size unoptimized images will be extremely slow, especially on mobile.

- [ ] Search codebase for `<img ` and replace each with `next/image`
- [ ] Set appropriate `width`, `height`, or `fill` + `sizes` on each

**Source:** Next.js Config audit #1

### STEP 21 — Fix the landing page client-side rendering
**File:** `src/app/page.tsx`  
**Why:** The entire homepage is a Client Component, losing all SSR/SEO benefits.

- [ ] Remove `'use client'` from `page.tsx`
- [ ] Extract only the interactive search/dropdown into a `<LiveSearch />` Client Component
- [ ] Keep everything else as a Server Component

**Source:** Next.js Config audit #2


# PHASE 5 — Clean-up & Low Priority (When You Have Time)

| # | Fix | File | Source |
|---|-----|------|--------|
| 30 | Add no-store fetch config to Supabase client | `supabase-provider.ts` | Supabase audit #5 |
| 31 | Add loading skeletons to `related-events.tsx` | `src/components/gallery/related-events.tsx` | React audit #5 |
| 40 | Add proper TypeScript types — remove all `any` | Multiple components | React audit #4 |
