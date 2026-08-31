import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F7F2EA',
        paper: '#EEE6DB',
        'paper-light': '#FDFBF7',
        ink: '#272322',
        'ink-muted': '#5C5451',
        burgundy: '#5A2834',
        'burgundy-dark': '#3F1C24',
        'burgundy-light': '#743443',
        dustyrose: '#B47F84',
        'dustyrose-dark': '#9A666B',
        'dustyrose-light': '#D6B4B7',
        'rose-accent': '#B94F68',
        sage: '#8F9983',
        'sage-light': '#B5BEAB',
        gold: '#B39A6B',
        'gold-light': '#D8C59F',
        muted: '#7A6F6B',
        error: '#A33C3C'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'DM Sans', 'sans-serif']
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(39, 35, 34, 0.04)',
        card: '0 2px 10px rgba(90, 40, 52, 0.06), 0 1px 2px rgba(90, 40, 52, 0.04)',
        elevated: '0 8px 30px rgba(90, 40, 52, 0.08), 0 2px 8px rgba(90, 40, 52, 0.04)',
        glow: '0 0 24px rgba(180, 127, 132, 0.25)'
      },
      screens: {
        xs: '380px'
      }
    }
  },
  plugins: []
};

export default config;
