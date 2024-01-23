/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0B0C14",
        },
      },
    },
  },
  plugins: [],
};
