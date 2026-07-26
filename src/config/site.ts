export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LuxeGallery",
  tagline: "Relive every moment through beautifully delivered memories.",
  description: "A premium, white-label event gallery platform for photobooth businesses, photographers, and studios.",
  logo: {
    text: "LUXE",
    accentText: "GALLERY",
    symbol: "✧",
    url: "/logo.png",
  },
  favicon: "/favicon.ico",
  colors: {
    primaryBlack: "#111111",
    white: "#FFFFFF",
    softCream: "#F7F3EE",
    warmIvory: "#EFE7DC",
    velvetRed: "#7B1E2B",
    mutedGray: "#8C8C8C",
    lightGray: "#EAEAEA",
  },
  contact: {
    email: "concierge@luxegallery.io",
    phone: "+1 (800) 555-LUXE",
    website: "https://luxegallery.io",
    address: "540 Madison Avenue, New York, NY 10022",
  },
  socialLinks: {
    instagram: "https://instagram.com/luxegallery",
    twitter: "https://twitter.com/luxegallery",
    linkedin: "https://linkedin.com/company/luxegallery",
    facebook: "https://facebook.com/luxegallery",
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} LuxeGallery Platform. All rights reserved.`,
    tagline: "Designed for Photobooth Businesses, Event Photographers & Studios.",
    links: [
      { name: "Find Event", href: "/search" },
      { name: "Studio Login", href: "/admin" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  },
  branding: {
    isWhiteLabel: true,
    allowCustomDomains: true,
    defaultTheme: "light" as "light" | "dark" | "system",
    poweredByText: "Powered by LuxeGallery Platform",
  },
};
