# Audit — API Routes & Server Actions

## Issues Found

### 🔴 Critical

#### 1. Authentication bypass in `createEventAction`
- **File:** `src/actions/event.ts` (lines 18-27)
- **Issue:** The action fetches `session = await auth()`, then `organizationId = session?.user?.organizationId`. If `organizationId` is falsely evaluated (e.g., `undefined` because `session` is `null`), it falls back to `db.organization.findFirst()`. It completely fails to verify if a valid session exists.
- **Impact:** Any unauthenticated user on the internet can hit this Server Action and create events under the first organization in the database.
- **Fix:** Check `!session?.user` explicitly and fail fast.
```typescript
  const session = await auth();
  if (!session?.user) {
    return { success: false, errors: { global: ['Unauthorized.'] } };
  }
```

#### 2. Unprotected Cron Job endpoint due to loosely evaluated secret
- **File:** `src/app/api/cron/cleanup/route.ts` (line 25)
- **Issue:** The cron route checks `if (secret && authHeader !== ... )`. If `CRON_SECRET` is not set in `.env` (which happens frequently in early deployments), `secret` is undefined, the condition evaluates to `false`, and the cron job proceeds WITHOUT authentication.
- **Impact:** An attacker can spam the `/api/cron/cleanup` endpoint, causing heavy database load and potential Denial of Service (DoS) by repeatedly triggering the expiration cleanup loop.
- **Fix:** Fail secure if the secret is missing.
```typescript
  const secret = process.env.CRON_SECRET;
  
  if (!secret) {
    return NextResponse.json({ error: 'Cron secret not configured' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
```

### 🟠 High

#### 3. Server-Side Request Forgery (SSRF) and Traversal in Downloads API
- **File:** `src/app/api/downloads/route.ts` (lines 15-35)
- **Issue:** The route takes a `url` query param and fetches it server-side: `await fetch(urlParam)`. It blindly trusts the client-provided URL. Additionally, the fallback `keyParam` path normalization regex `replace(/^(\.\.[\/\\])+/, '')` is flawed and can still allow directory traversal (e.g., via absolute paths on Windows or `....//`).
- **Impact:** SSRF allows an attacker to make the backend server fetch any internal URL (e.g., `http://localhost:3000/api/...` or AWS metadata endpoints). The flawed traversal check could allow reading arbitrary internal files.
- **Fix:** Validate the `urlParam` strictly against the expected Supabase URL prefix, and use `path.resolve` combined with `startsWith` to ensure the resolved local path remains inside the `storage/` directory.

#### 4. `getStorageUsageAction` is entirely unprotected
- **File:** `src/actions/media.ts` (lines 76-119)
- **Issue:** The action does not call `auth()` at all. It performs database queries to aggregate total storage size across the platform.
- **Impact:** Unauthenticated users can query platform analytics/metrics, leaking internal business data (storage capacity and usage).
- **Fix:** Add authentication to the action.
```typescript
export async function getStorageUsageAction() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  // ...
}
```

### 🟡 Medium

#### 5. API routes expose internal error messages to client
- **File:** `src/app/api/downloads/route.ts`, `src/app/api/analytics/route.ts`, `src/app/api/cron/cleanup/route.ts`, `src/app/api/upload/route.ts`
- **Issue:** Various API routes catch errors and return `error.message` directly in a 500 JSON response (e.g., `return NextResponse.json({ error: err.message }, { status: 500 });`).
- **Impact:** Can leak file paths, database structure, or API keys depending on the error thrown.
- **Fix:** Log the error locally and return a generic error.
```typescript
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
  }
```

#### 6. Missing permission scoping in `upload` route
- **File:** `src/app/api/upload/route.ts`
- **Issue:** The route verifies `session?.user` but does not verify if the user has permission to upload to the specified `slug` folder. It blindly trusts the client-provided `slug` parameter.
- **Impact:** Any authenticated user can upload files into any event folder (belonging to other users or organizations), potentially cluttering storage or overwriting files (if `upsert` is enabled).
- **Fix:** Query the database to verify that the `slug` belongs to an event owned by `session.user.organizationId` before permitting the upload.

### 🟢 Low

#### 7. Missing Zod input validation in Analytics API
- **File:** `src/app/api/analytics/route.ts` (lines 6-11)
- **Issue:** Relies on manual `if (!eventName || !slug)` checks. Does not use Zod to validate the JSON body schema, unlike the Server Actions which correctly use Zod.
- **Impact:** Not type-safe. Unexpected payloads could cause errors deeper in the analytics service.
- **Fix:** Use Zod for strict body parsing and validation.

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 2 |
| 🟡 Medium | 2 |
| 🟢 Low | 1 |
| **Total** | **7** |
