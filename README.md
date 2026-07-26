# Event Gallery Platform — v1.0.0 Release Candidate

A commercial-quality, white-label SaaS web application designed for **Photobooth Businesses**, **Event Photographers**, and **Photography Studios**.

Comparable in quality to **Pixieset**, **Pic-Time**, **CloudSpot**, **ShootProof**, and **SmugMug** — with its own premium luxury identity.

---

## ✨ Features

### Guest Experience
- 🔍 **Event Search** — Live search with case-insensitive matching and direct gallery redirect
- 🎞️ **Welcome Screen** — H.264 MP4 cover video player, event metadata, thank you message, and PIN validation
- 📸 **Smart Masonry Gallery** — 4/3/2-column responsive grid with filter chips toolbar
- 🖼️ **Fullscreen Lightbox** — Keyboard navigation (←→), Esc to exit, zoom toggle, media counter
- 💾 **Download System** — Original, web-optimized, link copy, QR view
- 🔗 **Share System** — Native Web Share API + WhatsApp, Facebook, Telegram, X fallback
- ⏱️ **Countdown Banner** — Days remaining until gallery expiration
- 🗓️ **Related Events** — Contextual gallery discovery
- 📣 **Booking CTA** — Studio call-to-action integration
- 💬 **Testimonials** — Social proof section for client marketing
- 🔐 **Access Modes** — PUBLIC, ACCESS_CODE (PIN), QR_ONLY

### Admin Dashboard
- 📊 **Dashboard Overview** — 8 metric cards (Events, Photos, Videos, Views, Downloads, Storage, Bandwidth, Expirations)
- 📅 **Event CRUD** — Create, Edit, Archive, Duplicate, Delete events with full forms
- 📷 **Media Uploader** — Drag & Drop with progress indicators, file type validation
- 📚 **Media Library** — Grid/List view, search, bulk select, type filter
- 📈 **Analytics** — Bar charts, donut charts, traffic source breakdowns
- ☁️ **Storage Settings** — Provider management with usage meter
- 🎨 **Branding Manager** — Business name, colors, logo, social links, footer text
- 👤 **Profile Settings** — Name, email, password, avatar, 2FA placeholder
- 🔑 **QR Generator** — Gallery-specific QR codes, PNG/SVG download
- 🔒 **Access Code Generator** — Random 6-char PIN with show/hide and copy

### Service Architecture
- 🗄️ **Storage Providers** — Local (active), Cloudflare R2, Amazon S3, Google Drive, Dropbox, Cloudinary, Backblaze B2 (scaffolded)
- 📧 **Email Providers** — Console (active), Resend, SendGrid, Brevo, SMTP (scaffolded)
- 📊 **Analytics Providers** — Local (active), Google Analytics, PostHog, Plausible, Vercel (scaffolded)
- 🖼️ **Image Pipeline** — `sharp` for WebP, AVIF, JPEG, thumbnail generation
- 🎬 **Video Pipeline** — Duration, resolution, format metadata extraction
- ⚙️ **Background Jobs** — Queue abstraction for thumbnail generation, compression, and cleanup

### Production Ready
- 🔒 **Security Headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- 📱 **Progressive Web App** — manifest.json, Service Worker, offline fallback page
- 🗺️ **SEO** — Dynamic sitemap.xml, robots.txt, Open Graph, Twitter Cards, JSON-LD, Canonical URLs
- ♿ **Accessibility** — WCAG AA, keyboard navigation, ARIA labels, focus indicators
- 💀 **Error Pages** — Custom 401, 403, 404, 429, 500, 503 pages with luxury branding
- ⚡ **Performance** — Code splitting, image optimization, lazy loading, bundle tree-shaking
- 🦴 **Skeleton Loaders** — Gallery, dashboard, table, search result, media card loaders
- ✨ **Micro-Animations** — Framer Motion page transitions, FadeIn, ScaleIn, StaggerChildren

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | App Router, Server Actions, API Routes |
| **TypeScript** | Strict mode type safety |
| **Tailwind CSS** | Design system with custom tokens |
| **Framer Motion** | Premium micro-animations |
| **Prisma ORM** | Database ORM (SQLite dev, Postgres ready) |
| **React Hook Form** | Performant form handling |
| **Zod** | Schema-first validation |
| **sharp** | Image optimization pipeline |
| **next-themes** | Dark/Light/System theme |
| **Lucide React** | Icon system |

---

## 📁 Project Structure

```
event-gallery-platform/
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service Worker
├── storage/
│   └── events/               # Local media storage
│       └── [slug]/
│           ├── photos/
│           ├── videos/
│           ├── thumbnails/
│           ├── webp/
│           ├── avif/
│           └── cover/
├── src/
│   ├── actions/              # Server Actions
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── health/       # GET /api/health
│   │   │   ├── qr/           # GET /api/qr?slug=
│   │   │   ├── downloads/    # GET /api/downloads?key=
│   │   │   └── analytics/    # POST /api/analytics
│   │   ├── admin/            # Admin Portal
│   │   │   └── dashboard/    # Dashboard Pages
│   │   │       ├── events/   # Event CRUD
│   │   │       ├── media/    # Media Library
│   │   │       ├── analytics/ # Analytics
│   │   │       ├── storage/  # Storage Settings
│   │   │       ├── branding/ # White-label Branding
│   │   │       └── profile/  # Admin Profile
│   │   ├── gallery/          # Public Galleries
│   │   ├── search/           # Event Search
│   │   ├── 401/ 403/ 429/ 503/ # Error Pages
│   │   ├── offline/          # PWA Offline Page
│   │   ├── not-found.tsx     # 404 Page
│   │   ├── error.tsx         # 500 Error Boundary
│   │   ├── loading.tsx       # App Loading State
│   │   ├── sitemap.ts        # Dynamic Sitemap
│   │   └── robots.ts         # Robots.txt
│   ├── components/
│   │   ├── admin/            # Admin Components
│   │   ├── gallery/          # Gallery Components
│   │   ├── marketing/        # Marketing Components
│   │   └── ui/               # Core UI System
│   ├── config/
│   │   └── site.ts           # White-label config
│   ├── database/
│   │   └── db.ts             # Prisma singleton
│   ├── hooks/                # Custom Hooks
│   │   ├── use-pwa.ts        # Service Worker registration
│   │   ├── use-debounce.ts   # Search debounce
│   │   └── use-media-query.ts # Responsive breakpoints
│   ├── providers/            # React Providers
│   │   ├── theme-provider.tsx
│   │   ├── toast-provider.tsx
│   │   └── pwa-provider.tsx
│   ├── services/             # Service Layer
│   │   ├── analytics/        # Analytics Providers
│   │   ├── email/            # Email Providers
│   │   ├── jobs/             # Background Queue
│   │   ├── logger/           # Central Logger
│   │   ├── media/            # Image & Video Pipelines
│   │   └── storage/          # Storage Providers
│   ├── styles/
│   │   └── globals.css       # Design tokens & utilities
│   ├── types/
│   │   └── index.ts          # Shared TypeScript types
│   └── utils/
│       ├── cn.ts             # Class merger utility
│       └── errors.ts         # Typed error classes
├── .env                      # Environment Variables
├── .env.example              # Environment Template
├── jest.config.js            # Unit testing setup
├── prettier.config.js        # Code formatting rules
├── next.config.mjs           # Next.js + Security config
├── tailwind.config.ts        # Design system tokens
└── tsconfig.json             # TypeScript config
```

---

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Clone
git clone <repository-url>
cd event-gallery-platform

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Initialize database
npx prisma db push
npx prisma generate

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Routes

| Route | Description |
|---|---|
| `/` | Landing page with gallery search |
| `/search` | Event search & discovery |
| `/gallery/[slug]` | Gallery welcome screen |
| `/gallery/[slug]/photos` | Masonry photo & video grid |
| `/admin` | Admin login portal |
| `/admin/dashboard` | Dashboard overview |
| `/admin/dashboard/events` | Event management |
| `/admin/dashboard/events/new` | Create new event |
| `/admin/dashboard/media` | Media library |
| `/admin/dashboard/analytics` | Analytics overview |
| `/admin/dashboard/storage` | Storage provider settings |
| `/admin/dashboard/branding` | White-label branding |
| `/admin/dashboard/profile` | Admin profile |
| `/api/health` | System health check |
| `/api/qr?slug=[slug]` | QR code generation |
| `/api/downloads?key=[key]` | Secure file download |
| `/api/analytics` | Event tracking |
| `/offline` | PWA offline fallback |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Black | `#111111` |
| White | `#FFFFFF` |
| Soft Cream | `#F7F3EE` |
| Warm Ivory | `#EFE7DC` |
| Velvet Red | `#7B1E2B` |
| Muted Gray | `#8C8C8C` |
| Light Gray | `#EAEAEA` |
| UI Font | Outfit |
| Editorial Font | Playfair Display |
| Button Radius | `12px` |
| Card Radius | `20px` |
| Gallery Radius | `18px` |
| Modal Radius | `24px` |

---

## 🌍 Environment Variables

See [`.env.example`](.env.example) for the complete reference.

**Minimum required for development:**
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-secret-here"
STORAGE_PROVIDER="LOCAL"
```

---

## ☁️ Storage Providers

| Provider | Status | Notes |
|---|---|---|
| **Local Storage** | ✅ Active | Files in `/storage/events/` |
| **Cloudflare R2** | 🔧 Scaffolded | Set `STORAGE_PROVIDER=CLOUDFLARE_R2` |
| **Amazon S3** | 🔧 Scaffolded | Set `STORAGE_PROVIDER=AMAZON_S3` |
| **Google Drive** | 🔧 Scaffolded | Set `STORAGE_PROVIDER=GOOGLE_DRIVE` |
| **Dropbox** | 🔧 Scaffolded | Set `STORAGE_PROVIDER=DROPBOX` |
| **Cloudinary** | 🔧 Scaffolded | Set `STORAGE_PROVIDER=CLOUDINARY` |
| **Backblaze B2** | 🔧 Scaffolded | Set `STORAGE_PROVIDER=BACKBLAZE` |

---

## 🚀 Deployment on Vercel

1. Push to GitHub/GitLab/Bitbucket
2. Import into [Vercel Dashboard](https://vercel.com)
3. Set environment variables from `.env.example`
4. Build Command: `npm run build` (runs `prisma generate && next build`)
5. Output Directory: `.next`
6. Deploy!

---

## 🗺️ Roadmap

| Module | Status | Description |
|---|---|---|
| Module 1 | ✅ Complete | Foundation & Architecture |
| Module 2 | ✅ Complete | Guest Experience & Smart Gallery |
| Module 3 | ✅ Complete | Admin Dashboard & Event Management |
| Module 4 | ✅ Complete | Services, Storage & Integrations |
| Module 5 | ✅ Complete | Production Ready (v1.0.0 RC) |
| Module 6 | 🔮 Planned | Authentication & Multi-tenant |
| Module 7 | 🔮 Planned | Stripe Payments & Subscriptions |
| Module 8 | 🔮 Planned | Custom Domain Management |

---

## 📄 License

This project is proprietary and white-label. No brand names are hardcoded. All configuration is driven by `src/config/site.ts`.

---

*Built with ❤️ for event photographers and studio businesses.*
