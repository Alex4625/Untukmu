import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#FFF7F3',
        cream: '#FFF1E6',
        rose: '#B94F68',
        'rose-dark': '#973F55',
        softpink: '#F5B7C6',
        rosegold: '#8F5F43',
        cocoa: '#3B2F2F',
        maroon: '#6D3B47',
        muted: '#6F5555',
        sage: '#4F7F5A',
        amber: '#8A651F',
        error: '#B94A48',
        info: '#376A82'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Lora', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'DM Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        xs: '0 1px 3px rgba(109, 59, 71, 0.06)',
        romantic: '0 2px 8px rgba(109, 59, 71, 0.08)',
        soft: '0 4px 16px rgba(109, 59, 71, 0.10)',
        glow: '0 0 24px rgba(185, 79, 104, 0.20)'
      },
      screens: {
        xs: '380px'
      }
    }
  },
  plugins: []
};
export default config;
