/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      colors: {
        cream: "#FDF8F0",
        "warm-brown": "#6B3F1F",
        "tea-green": "#4A7C59",
        gold: "#D4A843",
        blush: "#F2E0D0",
        charcoal: "#2C2C2C",
      },
    },
  },
  plugins: [],
};
