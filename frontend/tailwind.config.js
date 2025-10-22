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
        'primary': '#0070F3',
        'secondary': '#10B981',
        'background': '#F9FAFB',
        'accent': '#FFC107',
      },
    },
  },
  plugins: [],
}