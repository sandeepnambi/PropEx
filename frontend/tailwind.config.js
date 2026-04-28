// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Ensure this targets all your React/TSX files
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#dfa659',       // Gold accent
        'primary-hover': '#c9944a', // Darker gold for hover states
        'secondary': '#1f2937',     // Muted dark slate
        'background': '#13151a',    // Deep luxury charcoal/navy
        'surface': '#1c1f26',       // Card and elevated component background
        'accent': '#dfa659',        // Gold accent
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        }
      },
      animation: {
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
      }
    },
  },
  plugins: [],
}