# Audit — React Frontend

## Issues Found

### 🔴 Critical

#### 1. Favorites local storage overwrite on mount
- **File:** `src/app/gallery/[slug]/photos/gallery-photos-client.tsx` (lines 47-65)
- **Issue:** The component uses two `useEffect` hooks for local storage. The first one loads `favorites` from `localStorage` asynchronously via `setFavorites`. The second one listens to `[favorites, slug]` and immediately saves the `favorites` Set to `localStorage`. On initial mount, `favorites` is an empty Set, which causes the second `useEffect` to fire immediately and overwrite the `localStorage` with `[]` before the first one has finished rendering the loaded state.
- **Impact:** Users will lose their saved favorite photos every time they refresh the page.
- **Fix:** Introduce an `isLoaded` state flag to prevent saving until after the initial load.
```typescript
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // load from local storage
    setIsLoaded(true);
  }, [slug]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`gallery_favorites_${slug}`, JSON.stringify(Array.from(favorites)));
    }
  }, [favorites, slug, isLoaded]);
```

### 🟠 High

#### 2. Stored XSS via un-sanitized Terms and Privacy HTML
- **File:** `src/app/terms/page.tsx` & `src/app/privacy/page.tsx` (lines 87 & 110)
- **Issue:** The component uses `dangerouslySetInnerHTML={{ __html: rawContent }}` where `rawContent` comes directly from the database (`termsOfService` / `privacyPolicy`). There is no server-side sanitization when saving or rendering.
- **Impact:** An attacker who gains admin access or exploits an API flaw can inject malicious JavaScript into the public Terms and Privacy pages, leading to a Stored Cross-Site Scripting (XSS) attack against all site visitors.
- **Fix:** Sanitize the HTML before rendering using a library like `isomorphic-dompurify` or sanitize the input on the server before saving to the database.
```typescript
import DOMPurify from 'isomorphic-dompurify';
// ...
dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawContent) }}
```

#### 3. CSS Injection Vulnerability in Event Theme
- **File:** `src/components/gallery/event-theme-override.tsx` (line 95) & `src/schemas/event.ts`
- **Issue:** The component renders `dangerouslySetInnerHTML={{ __html: css }}` for custom event theme colors. The `EventSchema` validates colors merely as `z.string().optional()`.
- **Impact:** Allows a malicious user to inject arbitrary CSS (CSS injection), which can be used to exfiltrate data (like CSRF tokens) or deface the public gallery page.
- **Fix:** Add a regex validator to the Zod schema for all color fields to ensure they strictly conform to valid hex codes.
```typescript
themePrimaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color').optional().nullable(),
```

### 🟡 Medium

#### 4. Widespread use of `any` types in component props
- **File:** Multiple files (e.g., `src/app/gallery/[slug]/photos/gallery-photos-client.tsx`, `src/components/admin/event-form.tsx`, `src/components/admin/events-table.tsx`)
- **Issue:** The `event` prop is typed as `any` in many places instead of using Prisma generated types or a defined interface (e.g., `event: any;`).
- **Impact:** Defeats the purpose of TypeScript, preventing the compiler from catching potential runtime errors (e.g., calling `.map()` on an undefined media array without proper optional chaining).
- **Fix:** Import the generated type from Prisma and use it, or create a specific UI interface.
```typescript
import { Event, Media } from '@prisma/client';
type EventWithMedia = Event & { media: Media[] };
// ...
event: EventWithMedia;
```

### 🟢 Low

#### 5. Missing Loading States on Async API Calls
- **File:** `src/components/gallery/related-events.tsx` (lines 12-18)
- **Issue:** The component fetches data in a `useEffect` and sets it to state, but there is no loading indicator or skeleton screen during the fetch.
- **Impact:** Causes a layout shift or pop-in effect when the data finally loads, resulting in a slightly degraded UX.
- **Fix:** Add an `isLoading` state and render a skeleton component while `isLoading` is true.

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | 1 |
| 🟠 High | 2 |
| 🟡 Medium | 1 |
| 🟢 Low | 1 |
| **Total** | **5** |
