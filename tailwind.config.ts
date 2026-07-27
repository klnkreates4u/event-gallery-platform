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
        // ─── New palette tokens ───────────────────────────────────────
        cherry: 'var(--cherry)',      // primary action / CTA
        chocolate: 'var(--chocolate)', // rich dark burgundy chocolate
        oil:    'var(--oil)',         // warm cream / backgrounds
        coal:   'var(--coal)',        // near-black / text
        candy:  'var(--candy)',       // blush pink
        'dusty-pink': 'var(--dusty-pink)', // dusty pink
        // ─── Legacy aliases (backward-compat, now map to new palette) ─
        'primary-black': 'var(--coal)',   // coal
        'soft-cream':    'var(--oil)',    // oil
        'warm-ivory':    'rgba(205, 164, 181, 0.6)', // mauve pink border
        'velvet-red':    'var(--cherry)',  // cherry
        'muted-gray':    'var(--muted-foreground)',
        'light-gray':    'rgba(205, 164, 181, 0.6)',
        brand: {
          DEFAULT: 'var(--coal)',
          accent:  'var(--cherry)',
        },
      },
      borderRadius: {
        button:  '12px',
        input:   '12px',
        card:    '20px',
        gallery: '18px',
        modal:   '24px',
        pill:    '9999px',
      },
      fontFamily: {
        sans:      ['var(--font-mont)', 'sans-serif'],
        serif:     ['var(--font-playfair)', 'serif'],
        editorial: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        cherry: '0 4px 28px -4px rgba(72, 12, 24, 0.35)',
        candy:  '0 4px 28px -4px rgba(216, 143, 178, 0.35)',
        coal:   '0 8px 32px -8px rgba(40, 40, 40, 0.30)',
        oil:    '0 2px 16px -2px rgba(254, 236, 222, 0.80)',
      },
      keyframes: {
        'heart-pop': {
          '0%':   { transform: 'scale(1)' },
          '25%':  { transform: 'scale(1.45)' },
          '50%':  { transform: 'scale(0.88)' },
          '75%':  { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        'shine': {
          '0%':   { left: '-120%', opacity: '0' },
          '15%':  { opacity: '0.7' },
          '85%':  { opacity: '0.7' },
          '100%': { left: '220%', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-7px)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'dot-pop': {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '65%':  { transform: 'scale(1.25)', opacity: '1' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'slide-in-bottom': {
          '0%':   { transform: 'translate(-50%, 40px)', opacity: '0' },
          '100%': { transform: 'translate(-50%, 0)',    opacity: '1' },
        },
      },
      animation: {
        'heart-pop':        'heart-pop 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'shine':            'shine 0.9s ease-in-out',
        'float':            'float 3.5s ease-in-out infinite',
        'fade-up':          'fade-up 0.5s ease-out forwards',
        'dot-pop':          'dot-pop 0.3s ease-out forwards',
        'slide-in-bottom':  'slide-in-bottom 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
