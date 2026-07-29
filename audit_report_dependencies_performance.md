# Audit — Dependencies & Performance

## Issues Found

### 🔴 Critical
*(No new critical dependency or performance issues found that were not already documented in the Next.js or API audits).*

### 🟠 High

#### 1. Missing `useMemo` on Expensive Array Operations
- **File:** `src/app/gallery/[slug]/photos/gallery-photos-client.tsx` (lines 111-152)
- **Issue:** The `getFilteredMedia()` function executes on every single component render. It spreads the entire media array (which can contain hundreds or thousands of items), filters it based on active categories, and maps it to entirely new object instances.
- **Impact:** Because it generates new object references every render, it breaks React's reconciliation, forcing the massive child `MasonryGrid` and `FullscreenViewer` components to completely re-render on every state change (e.g., opening a modal, ticking a countdown). On mobile devices, this will cause severe UI lag and battery drain.
- **Fix:** Wrap the filtering logic in a `useMemo` hook so it only recalculates when `event.media` or `activeFilter` changes.
```typescript
const filteredMedia = useMemo(() => {
  let list = event.media || [];
  // filter logic...
  return list.map(m => ({ ... }));
}, [event.media, activeFilter]);
```

#### 2. DB Queries Over-Fetching Data (Missing `select`)
- **File:** `src/services/gallery.ts` (lines 72-78 & 88-99)
- **Issue:** The `searchEvents` and `getRelatedEvents` Prisma queries retrieve the entire `Event` record by default.
- **Impact:** These queries fetch large text fields (like `description`, `story`, `thankYouMessage`) and the `analytics` relation just to display tiny summary cards (which only need `id`, `slug`, `title`, `coverImageUrl`, `eventDate`, and `venue`). This wastes database memory, network bandwidth, and serialization time on the server.
- **Fix:** Add a strict `select` clause to the Prisma queries to only fetch the exact fields required for the UI cards.

### 🟡 Medium

#### 3. Incomplete `.env` file for Local Development
- **File:** `.env` and `.env.example`
- **Issue:** The local `.env` file is missing the `CRON_SECRET` variable, which is defined in `.env.example` and strictly required by the `/api/cron/cleanup` route.
- **Impact:** Any local execution or testing of the cron route will instantly fail with a 401 Unauthorized because `process.env.CRON_SECRET` is undefined, stalling development and testing of background jobs.
- **Fix:** Add a dummy `CRON_SECRET="local-dev-cron-secret"` to the `.env` file to match `.env.example`.

### 🟢 Low

#### 4. Unused `react-quill` Dependency
- **File:** `package.json`
- **Issue:** The `react-quill` package is installed as a dependency (`^2.0.0`), but it is not imported or used anywhere in the codebase (a comment in `legal-form.tsx` explicitly notes it was avoided due to SSR issues).
- **Impact:** Adds unnecessary bloat to `node_modules` and the `package-lock.json`. Although it is likely eliminated by webpack tree-shaking during the production build, it increases `npm install` times and introduces potential supply-chain audit warnings for a library that isn't even used.
- **Fix:** Run `npm uninstall react-quill` to remove it from the project.

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 2 |
| 🟡 Medium | 1 |
| 🟢 Low | 1 |
| **Total** | **4** |
