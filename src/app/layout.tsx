import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { PWAProvider } from '@/providers/pwa-provider';
import { BrandingProvider } from '@/providers/branding-provider';
import { PrivacyNoticeModal } from '@/components/legal/privacy-notice-modal';
import AuthProvider from '@/providers/auth-provider';
import { getBranding } from '@/services/branding';
import '@/styles/globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const mont = Outfit({
  subsets: ['latin'],
  variable: '--font-mont',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBranding();
  const name = branding?.businessName || siteConfig.name;

  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description: siteConfig.description,
    keywords: ['photo gallery', 'event photography', 'photobooth', 'wedding gallery', 'studio gallery'],
    authors: [{ name: name }],
    creator: name,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      siteName: name,
      title: name,
      description: siteConfig.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
    icons: {
      icon: branding?.faviconUrl || siteConfig.favicon,
      apple: '/icons/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branding = await getBranding();
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${mont.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-velvet-red selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.branding.defaultTheme}
          enableSystem
          disableTransitionOnChange={false}
        >
          <BrandingProvider branding={branding}>
            {branding && (
              <style dangerouslySetInnerHTML={{
                __html: `
                  :root {
                    --color-primary-black: ${branding.primaryColor || '#282828'};
                    --color-coal:          ${branding.primaryColor || '#282828'};
                    --color-velvet-red:    ${branding.accentColor  || '#480c18'};
                    --color-cherry:        ${branding.accentColor  || '#480c18'};
                  }
                  .bg-primary-black, .bg-coal { background-color: var(--color-coal, #282828) !important; }
                  .text-primary-black, .text-coal { color: var(--color-coal, #282828) !important; }
                  .border-primary-black, .border-coal { border-color: var(--color-coal, #282828) !important; }

                  .bg-velvet-red, .bg-cherry { background-color: var(--color-cherry, #480c18) !important; }
                  .text-velvet-red, .text-cherry { color: var(--color-cherry, #480c18) !important; }
                  .border-velvet-red, .border-cherry { border-color: var(--color-cherry, #480c18) !important; }

                  .hover\\:bg-velvet-red:hover, .hover\\:bg-cherry:hover { background-color: var(--color-cherry, #480c18) !important; }
                  .hover\\:text-velvet-red:hover, .hover\\:text-cherry:hover { color: var(--color-cherry, #480c18) !important; }
                  .focus\\:ring-cherry\\/50:focus { --tw-ring-color: color-mix(in srgb, var(--color-cherry, #480c18) 50%, transparent) !important; }
                `
              }} />
            )}
            <AuthProvider>
              <ToastProvider>
                <PWAProvider>
                  {children}
                  <PrivacyNoticeModal />
                </PWAProvider>
              </ToastProvider>
            </AuthProvider>
          </BrandingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
