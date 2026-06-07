import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#FFF7F3',
        cream: '#FFF1E6',
        rose: '#E98DA3',
        'rose-dark': '#D4718A',
        softpink: '#F5B7C6',
        rosegold: '#C48A6A',
        cocoa: '#3B2F2F',
        maroon: '#6D3B47',
        muted: '#8B6F6F',
        sage: '#7DAF8C',
        amber: '#E4B96A',
        error: '#D97070',
        info: '#7EADC7'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Lora', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        xs: '0 1px 3px rgba(109, 59, 71, 0.06)',
        romantic: '0 2px 8px rgba(109, 59, 71, 0.08)',
        soft: '0 4px 16px rgba(109, 59, 71, 0.10)',
        glow: '0 0 24px rgba(233, 141, 163, 0.20)'
      },
      screens: {
        xs: '380px'
      }
    }
  },
  plugins: []
};
export default config;
