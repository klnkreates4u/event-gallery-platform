# Audit — Supabase Configuration

## Issues Found

### 🔴 Critical

#### 1. Raw Query against `storage.objects` will fail (Database Split)
- **File:** `src/actions/media.ts` (line 83)
- **Issue:** The `getStorageUsageAction` attempts to calculate Supabase storage size by executing a raw SQL query (`SELECT SUM(COALESCE(metadata->>'size', '0')::bigint) FROM storage.objects...`) against the Prisma `db` client. However, this project uses **Neon Postgres** for the database and **Supabase** only for storage. The `storage.objects` schema exists in Supabase's internal database, not in Neon.
- **Impact:** The query will always throw an error in production, breaking the storage analytics dashboard and filling server logs with errors.
- **Fix:** Remove the raw query and rely on the Prisma `Media` table aggregate.
```typescript
// Replace the try/catch block with:
const aggregate = await db.media.aggregate({
  _sum: { sizeBytes: true },
});
const usedBytes = aggregate._sum.sizeBytes || 0;
```

#### 2. Service Role Key Fallback to Anon Key for Storage Admin Tasks
- **File:** `src/services/storage/supabase-provider.ts` (lines 13-16)
- **Issue:** The Supabase client initialization falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY` if `SUPABASE_SERVICE_ROLE_KEY` is missing. The provider uses this client to `upload()` and `remove()` files.
- **Impact:** If the service role key is accidentally omitted in production, the backend authenticates as `anon`. For uploads to succeed, the Supabase Storage bucket would have to be configured with RLS policies allowing `anon` (public) to insert/delete files—which would mean *anyone on the internet* could upload or delete files in the bucket. If the bucket is secure, backend uploads will simply fail.
- **Fix:** Fail fast if the Service Role key is missing, rather than falling back to the anon key for admin actions.
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and SUPABASE_SERVICE_ROLE_KEY must be set in production');
}

this.supabase = createClient(supabaseUrl, supabaseKey);
```

### 🟠 High

#### 3. Undocumented RLS Policy Requirements for Storage
- **File:** `src/services/storage/supabase-provider.ts` (line 18)
- **Issue:** `this.bucket = process.env.SUPABASE_STORAGE_BUCKET || 'events';` is used to define the storage bucket. Because there is no Supabase Auth or database in this project (just Neon), there is no way for the backend to enforce Row Level Security (RLS) dynamically per-user. The server acts as a global admin (Service Role).
- **Impact:** While the backend correctly bypasses RLS to upload, any misconfiguration in the Supabase Dashboard (e.g., granting `INSERT` to `public`) cannot be audited from this codebase. If the bucket is accidentally made fully public for writes, anyone can upload malicious files.
- **Fix:** Document explicitly in the repository that the Supabase `events` bucket must be set to **Public** for reads, but **Private / No Policies** for inserts, updates, and deletes (since the backend uses the Service Role key). Add a script or README section detailing the required Supabase Storage configuration.

### 🟡 Medium

#### 4. Unnecessary `NEXT_PUBLIC_` prefix for Supabase Secrets
- **File:** `.env` (lines 12-13) and `src/services/storage/supabase-provider.ts` (line 12)
- **Issue:** The environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` use the `NEXT_PUBLIC_` prefix. However, Supabase is *only* used on the server in this application (via the `StorageService` inside Next.js Server Actions and API routes). There are no client-side Supabase calls.
- **Impact:** The `NEXT_PUBLIC_` prefix exposes these values to the browser bundle if they are ever accidentally imported in a client component. While the anon key is designed to be public, there is no reason to expose it in this architecture.
- **Fix:** Rename the environment variables to remove the `NEXT_PUBLIC_` prefix.
```env
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="eyJ..."
```
And update `supabase-provider.ts`:
```typescript
const supabaseUrl = process.env.SUPABASE_URL || '';
```

#### 5. Supabase client initialized without Next.js fetch caching overrides
- **File:** `src/services/storage/supabase-provider.ts` (line 26)
- **Issue:** The `createClient` call uses the default `fetch` implementation. In Next.js App Router, global `fetch` calls are heavily cached by default, which can cause erratic behavior for storage list/metadata operations if they are called repeatedly.
- **Impact:** Calling `exists()` or `getMetadata()` might return stale cached responses from Next.js rather than the live Supabase storage state.
- **Fix:** Provide a custom fetch instance to the Supabase client to opt out of Next.js aggressive caching for storage admin calls.
```typescript
this.supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
  }
});
```

### 🟢 Low

#### 6. No Realtime Subscriptions Used (Unused Potential)
- **File:** Entire codebase
- **Issue:** The prompt asks to check realtime subscriptions, but none are implemented. Features like live photo uploads (guests see photos appear in real-time) rely on polling or page refreshes instead of Supabase Realtime.
- **Impact:** Degraded user experience compared to a real-time gallery.
- **Fix:** Since the database is Neon, Supabase Realtime cannot be used out-of-the-box for database changes. However, if desired, Supabase Realtime broadcast channels could be used manually to sync clients, or Neon's equivalent could be explored.

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 1 |
| 🟡 Medium | 2 |
| 🟢 Low | 1 |
| **Total** | **6** |
