/** @type {import('tailwindcss').Config} */

const sharedConfig = require("@3dwebprodconf/shared/tailwind.config");

module.exports = {
  presets: [sharedConfig],
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}",
  ],
};
