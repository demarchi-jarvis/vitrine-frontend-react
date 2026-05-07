import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#EDE0CC',
          300: '#DFC9A9',
          400: '#C9A87C',
        },
        wood: {
          50: '#FDF8F3',
          100: '#F5E9D9',
          200: '#DFC9AD',
          300: '#C4956A',
          400: '#A87040',
          500: '#8B5E3C',
          700: '#5C3317',
          800: '#3D200A',
          900: '#1C0A00',
        },
        terracotta: {
          300: '#F4B4A4',
          400: '#EFA08D',
          500: '#E88A73',
          600: '#E2725B',
          700: '#CC5A43',
          800: '#A84733',
          900: '#7A2E1E',
        },
        ocre: {
          300: '#E4B96A',
          400: '#D4934A',
          500: '#CC7722',
          600: '#B36A1C',
          700: '#8A4F12',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        shimmer:
          'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.5) 50%, transparent 75%)',
      },
      transitionTimingFunction: {
        organic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};

export default config;
