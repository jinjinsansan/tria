import type { Config } from 'tailwindcss';

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
          DEFAULT: '#8B5CF6',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF',
        },
        background: '#0F0F0F',
        foreground: '#FFFFFF',
        card: {
          DEFAULT: '#1A1A1A',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#2A2A2A',
          foreground: '#A1A1A1',
        },
        border: '#2A2A2A',
        input: '#2A2A2A',
        ring: '#8B5CF6',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
