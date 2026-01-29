import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9A3C',
          foreground: '#0C0F17',
        },
        secondary: {
          DEFAULT: '#5F4CFF',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#00F5FF',
          foreground: '#00131D',
        },
        background: '#03040A',
        foreground: '#F5F6FE',
        card: {
          DEFAULT: '#10131A',
          foreground: '#F5F6FE',
        },
        muted: {
          DEFAULT: '#1B1E29',
          foreground: '#9CA3B5',
        },
        border: '#1F2330',
        input: '#1C1F2C',
        ring: '#FF9A3C',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(120deg, #FFEA7B 0%, #FF9A3C 35%, #FF4B71 70%, #5F4CFF 100%)',
        'gradient-surface': 'linear-gradient(145deg, rgba(255,154,60,0.08), rgba(95,76,255,0.08))',
      },
    },
  },
  plugins: [typography],
};

export default config;
