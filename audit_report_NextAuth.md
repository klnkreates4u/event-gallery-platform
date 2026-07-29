# Audit — NextAuth.js

## Issues Found

### 🟠 High

#### 1. Middleware allow-by-default configuration for admin routes
- **File:** `middleware.ts` (lines 6-20)
- **Issue:** The middleware specifically protects `/admin/dashboard` using `startsWith('/admin/dashboard')`. If a new admin section is added later (e.g., `/admin/users`, `/admin/settings`, or `/admin/billing`), it will not match `isAdminDashboard` and will be entirely public by default.
- **Impact:** Any new routes under `/admin` (other than the `/admin` login page itself and `/admin/dashboard`) will bypass authentication, exposing sensitive administrative functions to unauthenticated users.
- **Fix:** Protect all `/admin` routes by default, explicitly allowing only the login page.
```typescript
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === '/admin';
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.nextUrl));
    }
    return null;
  }

  if (isAdminRoute && !isAuthPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return null;
});
```

### 🟡 Medium

#### 2. Unnecessary `PrismaAdapter` with Credentials + JWT
- **File:** `auth.ts` (line 9)
- **Issue:** The NextAuth configuration includes `adapter: PrismaAdapter(db)`. However, the app uses `CredentialsProvider` with `session: { strategy: 'jwt' }`. The NextAuth Prisma adapter is only used for OAuth providers or database-backed sessions. Furthermore, the adapter expects models like `Account`, `Session`, and `VerificationToken` which do not exist in the `schema.prisma` file.
- **Impact:** While it currently doesn't crash because the Credentials provider bypasses the adapter, this is a misleading configuration that could cause silent failures or runtime errors if NextAuth internals change or if OAuth is added in the future.
- **Fix:** Remove the adapter entirely.
```diff
  export const { handlers, auth, signIn, signOut } = NextAuth({
-   adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
```

#### 3. API Error details exposed to the client
- **File:** `src/app/api/upload/route.ts` (line 56) (and other API routes)
- **Issue:** The `catch` block returns `err.message` directly in the JSON response: `return NextResponse.json({ error: err.message || 'Something went wrong.' }, { status: 500 });`
- **Impact:** Internal errors (e.g., Supabase storage connection errors, file system paths, or raw database messages) are exposed to the browser.
- **Fix:** Log the actual error to the console, but return a generic error message to the client for 500 status codes.
```typescript
  } catch (err: any) {
    console.error('Upload API Error:', err);
    return NextResponse.json({ error: 'An internal error occurred during upload.' }, { status: 500 });
  }
```

### 🟢 Low

#### 4. Unnecessary `id` duplication in JWT token
- **File:** `auth.ts` (lines 56, 69)
- **Issue:** In the `jwt` callback, `token.id = user.id` is explicitly set. NextAuth v5 automatically assigns `user.id` to `token.sub` during initial login as per JWT standards. Setting `token.id` duplicates this value unnecessarily.
- **Impact:** Marginally larger JWT cookie size, and ignores standard Auth.js conventions.
- **Fix:** Use `token.sub` instead of adding a custom `id` field.
```typescript
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // token.id is automatically populated into token.sub
        token.role = user.role;
        token.organizationId = user.organizationId;
      }
      // ...
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string | null;
      }
      return session;
    },
```

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 1 |
| 🟡 Medium | 2 |
| 🟢 Low | 1 |
| **Total** | **4** |
