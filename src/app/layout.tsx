import type { Metadata } from 'next';
import { Playfair_Display, Outfit } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { PWAProvider } from '@/providers/pwa-provider';
import AuthProvider from '@/providers/auth-provider';
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

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['photo gallery', 'event photography', 'photobooth', 'wedding gallery', 'studio gallery'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
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
    icon: siteConfig.favicon,
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${mont.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-velvet-red selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.branding.defaultTheme}
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <ToastProvider>
              <PWAProvider>
                {children}
              </PWAProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
