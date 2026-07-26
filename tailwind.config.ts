import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'primary-black': '#111111',
        'soft-cream': '#F7F3EE',
        'warm-ivory': '#EFE7DC',
        'velvet-red': '#7B1E2B',
        'muted-gray': '#8C8C8C',
        'light-gray': '#EAEAEA',
        brand: {
          DEFAULT: '#111111',
          accent: '#7B1E2B',
        },
      },
      borderRadius: {
        button: '12px',
        input: '12px',
        card: '20px',
        gallery: '18px',
        modal: '24px',
      },
      fontFamily: {
        sans: ['var(--font-mont)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        editorial: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
