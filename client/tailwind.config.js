/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#F8FAFC', // Root canvas: Slate 50
          raised: '#FFFFFF', // Cards & panels: Pure Crisp White
          overlay: '#FFFFFF', // Modals & floating sheets
          sunken: '#F1F5F9', // Inputs, table headers, code blocks: Slate 100
          border: '#E2E8F0', // Structural 1px border: Slate 200
          hover: '#F8FAFC',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Indigo Primary
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        accent: {
          400: '#22D3EE',
          500: '#06B6D4', // Cyan accent
          600: '#0891B2',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card-outer': '16px',
        'card-inner': '10px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'panel': '0 10px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
        'dropdown': '0 12px 24px -4px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.03)',
        'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow-brand': '0 0 25px -5px rgba(79, 70, 229, 0.25)',
      },
    },
  },
  plugins: [],
};
