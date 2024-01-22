/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'asideSh': '0px 0px 0px 8px rgba(34, 60, 80, 0.45)',
      },
      colors: {
        cText: '#FFFFFF',
        primary: '#6D6D6D',
        secondary: '#000000',
        white_sec: '#E7E7E7',
        third: '#373737',
        forth: '#DFDFDF',
        fifth: '#EDEDED'
      },
    },
  },
  plugins: [],
}