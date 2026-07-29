# Audit — Logic & Data Flow

## Issues Found

### 🔴 Critical

#### 1. Serverless Timeout & N+1 Network Loop in Media Deletion
- **File:** `src/actions/event.ts` (lines 222-224) & `src/actions/media.ts` (lines 58-61)
- **Issue:** `deleteEventAction` and `bulkDeleteMediaAction` loop over media items and invoke `await StorageService.deleteFile(item.url)` sequentially. 
- **Impact:** If a user attempts to delete an event with 500 photos, this loop will sequentially execute 500 network requests. On serverless platforms (like Vercel), this will quickly hit the 10-15s timeout limit and crash. Because the database transaction to delete the event occurs *after* this loop, the operation will fail halfway, leaving orphaned records and a broken application state.
- **Fix:** Update the `StorageProvider` interface to support a `deleteMany(keys: string[])` method. Supabase natively supports bulk deletion by passing an array of keys to `.remove(keys)`.

### 🟠 High

#### 2. Timezone Shift Bug in Event Date Parsing
- **File:** `src/actions/event.ts` (line 50) and `src/components/admin/event-form.tsx` (line 80)
- **Issue:** The event form submits the `eventDate` as a simple `YYYY-MM-DD` string, which JavaScript natively parses as UTC midnight (`new Date('YYYY-MM-DD')`). When the frontend displays the date using `toLocaleDateString()`, it converts that UTC midnight to the user's local timezone.
- **Impact:** For users in negative timezones (e.g., EST UTC-5), converting UTC midnight to local time shifts the date backward to the previous day (e.g., December 25th becomes December 24th at 7:00 PM). This results in incorrectly displayed dates across the entire public platform.
- **Fix:** Extract the year, month, and day strings manually and construct the Date using the local timezone, or use a robust library like `date-fns-tz` or `dayjs` to enforce timezone consistency.

### 🟡 Medium

#### 3. Missing Pagination Logic (Hard Limit on Scalability)
- **File:** `src/services/gallery.ts` (lines 76 & 98)
- **Issue:** The Prisma queries for fetching and searching events use hardcoded `take: 20` and `take: 6` parameters but omit `skip` or `cursor` mechanics completely.
- **Impact:** As the platform grows, only the first 20 events will ever be accessible via search or the gallery listing. Users have no way to browse past the first "page" of results.
- **Fix:** Implement cursor-based pagination or offset pagination (`skip`, `take`) in the Prisma queries and update the frontend React components to support "Load More" functionality.

#### 4. Invalid Raw SQL Query executed against Neon DB
- **File:** `src/actions/media.ts` (lines 83-87)
- **Issue:** `getStorageUsageAction` attempts a direct `db.$queryRaw` SQL query against `storage.objects`. Since the project architecture uses Neon for the Postgres database, this Supabase-specific internal schema does not exist, causing the query to throw an error on every request.
- **Impact:** It falls back to the Prisma `aggregate` function in the `catch` block, so it doesn't crash the application, but it generates unnecessary error noise in the logs and adds database latency to the request.
- **Fix:** Remove the `storage.objects` raw query branch entirely and exclusively use the Prisma `aggregate` fallback for size calculations.

### 🟢 Low

#### 5. Silent Failures on Storage Deletion
- **File:** `src/services/storage/supabase-provider.ts` (lines 58-70)
- **Issue:** The `delete` method catches any Supabase storage error and silently returns `false` without throwing an exception or logging the error.
- **Impact:** If a file fails to delete (e.g., due to an RLS policy issue or network failure), the Server Action won't be alerted. It will proceed to delete the database record, leaving an orphaned file taking up space in the storage bucket permanently.
- **Fix:** Throw a structured `StorageError` from the provider, or explicitly verify the boolean return value in the Server Actions and alert the user or log the failure.

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 1 |
| 🟠 High | 1 |
| 🟡 Medium | 2 |
| 🟢 Low | 1 |
| **Total** | **5** |
