import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F2EA',
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
        error: '#A33C3C',
        stardew: {
          sky: '#5ca6e8',
          night: '#154794',
          parchment: '#FFF3CC',
          'parchment-dark': '#F2E2B0',
          'wood-dark': '#4A2411',
          wood: '#8C4E28',
          'wood-light': '#C87D43',
          gold: '#F9EC88',
          blue: '#0066CC',
          brown: '#663300',
          ink: '#252525'
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-nunito)', 'var(--font-sans)', 'Nunito', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif']
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
