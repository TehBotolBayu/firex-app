/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FDA292",
        darkred: "#FC5B5C",
        secondary: "#0193FD"
      }
    },
  },
  plugins: [],
}

