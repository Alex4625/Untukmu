import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#FFF7F3',
        cream: '#FFF1E6',
        rose: '#E98DA3',
        softpink: '#F5B7C6',
        rosegold: '#C48A6A',
        cocoa: '#3B2F2F',
        maroon: '#6D3B47'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        romantic: '0 24px 70px rgba(109, 59, 71, 0.14)'
      }
    }
  },
  plugins: []
};
export default config;
