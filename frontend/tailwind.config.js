/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#12181f",
          900: "#1a232d",
          800: "#243040",
          700: "#334154",
          600: "#4a5b71",
          400: "#8494a8",
          200: "#cfd8e2",
          100: "#e7ecf1",
          50: "#f5f7f9",
        },
        signal: {
          open: "#e2822a",
          progress: "#3072c4",
          closed: "#2f9e6b",
        },
        paper: "#fbfaf6",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
}

