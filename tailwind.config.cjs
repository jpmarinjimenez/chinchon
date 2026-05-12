/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        crimson: {
          50: '#fef2f2',
          100: '#fde3e3',
          200: '#fcc8c8',
          300: '#f8a0a0',
          400: '#f16b6b',
          500: '#e63946',
          600: '#c41e31',
          700: '#a31829',
          800: '#871825',
          900: '#711924',
          950: '#3f080e',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#6e8ca0',
          500: '#486581',
          600: '#334e68',
          700: '#243b53',
          800: '#1a2d42',
          900: '#102a43',
          950: '#0a1929',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4a017',
          600: '#b8860b',
          700: '#92400e',
        },
        parchment: {
          DEFAULT: '#fdf8f0',
          dark: '#f5edd6',
        },
        felt: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#0d3320',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'celebration': 'celebration 0.5s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float-suit': 'floatSuit 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        celebration: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        floatSuit: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'translateY(-8px) rotate(5deg)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212,160,23,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(212,160,23,0.4)' },
        },
      },
      backgroundImage: {
        'bicycle-gradient': 'linear-gradient(145deg, #0a1929 0%, #102a43 50%, #0a1929 100%)',
      },
    },
  },
  plugins: [],
}
