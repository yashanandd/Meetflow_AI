/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#bae0ff',
          300: '#7cc2ff',
          400: '#369eff',
          500: '#0c7eff',
          600: '#005fe6',
          700: '#004ab8',
          800: '#033e96',
          900: '#093577',
          950: '#06204d',
        },
        dark: {
          bg: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          hover: '#1F2937',
          input: '#1F2937'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(12, 126, 255, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(147, 51, 234, 0.3)',
      }
    },
  },
  plugins: [],
}
