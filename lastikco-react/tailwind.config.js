/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B5394',
          50: '#E8F1F8',
          100: '#C5DBF0',
          200: '#9DC3E6',
          300: '#75ABDB',
          400: '#4D93D1',
          500: '#0B5394',
          600: '#094A84',
          700: '#074074',
          800: '#053664',
          900: '#032C54',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
