/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hyphae: {
          50: '#f3f0ff',
          100: '#e5deff',
          200: '#cdc0ff',
          300: '#b39dff',
          400: '#9a75ff',
          500: '#8f52ff',
          600: '#8833ff',
          700: '#7c1fff',
          800: '#6c0ef7',
          900: '#5a0cd4',
        },
        spore: {
          50: '#fbffe5',
          100: '#f4ffc7',
          200: '#e9ff95',
          300: '#d8ff58',
          400: '#c7ff2b',
          500: '#a8f000',
          600: '#83c700',
          700: '#619600',
          800: '#507800',
          900: '#446400',
        },
        fungal: {
          50: '#fff1f0',
          100: '#ffe4e1',
          200: '#ffccc7',
          300: '#ffa69e',
          400: '#ff7a6c',
          500: '#ff4d3c',
          600: '#ed2b18',
          700: '#c81d0f',
          800: '#a51b10',
          900: '#881c14',
        },
        dark: {
          100: '#1a1625',
          200: '#15111e',
          300: '#100d17',
          400: '#0b0910',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'JetBrains Mono',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-hyphae': '0 0 15px rgba(143, 82, 255, 0.5)',
        'glow-spore': '0 0 15px rgba(168, 240, 0, 0.5)',
        'glow-fungal': '0 0 15px rgba(255, 77, 60, 0.5)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        pulse: 'pulse 4s ease-in-out infinite',
        breathe: 'breathe 6s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};