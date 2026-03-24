/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          50: '#f0f4f2',
          100: '#dae6df',
          500: '#436d58',
          700: '#2f4c3d',
          900: '#1a2b22',
        },
        accent: {
          500: '#eab308', // gold/yellow for rank/importance highlights
        }
      }
    },
  },
  plugins: [],
}
