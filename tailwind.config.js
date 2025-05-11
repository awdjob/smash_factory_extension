/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        ssb: {
          red: '#EF443A',
          yellow: '#FEDB5F',
          blue: '#30B6F9',
          purple: '#6558F5',
          'dark-blue': '#212F44',
          orange: '#FF9900',
        }
      }
    },
  },
  plugins: [],
} 