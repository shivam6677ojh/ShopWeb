/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-light": "#F8F3E8", // Soft Cream
        "primary-dark": "#0B0C10", // Deep Charcoal
        "secondary-dark": "#1A1A1D", // Slightly lighter charcoal for cards
        "luxury-gold": "#C6A75E", // Metallic Gold
        "luxury-gold-light": "#E6C77A", // Gold Highligh
        "luxury-gold-hover": "#B0924E",
        "muted-text": "#8A8A8A",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C6A75E 0%, #E6C77A 100%)',
      },
    },
  },
  plugins: [],
}

