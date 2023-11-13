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
        primarry: {
          1: '#171717',
          2: '#323232',
        },
      }
    },
  },
  plugins: [],
}