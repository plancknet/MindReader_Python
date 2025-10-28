/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        quadrant: {
          a: "#4ADE80",
          b: "#38BDF8",
          c: "#F97316",
          d: "#F472B6",
        },
        mind: {
          dark: "#09090F",
          light: "#F8FAFC",
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(56, 189, 248, 0.45)",
        neon: "0 0 15px rgba(250, 204, 21, 0.65)",
      },
    },
  },
  plugins: [],
};
