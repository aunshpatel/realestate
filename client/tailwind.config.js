/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // 'xs': '320px',
      // 'sm': '640px',
      // 'md': '768px',
      // 'lg': '1024px',
      // 'xl': '1280px',
      // '2xl': '1536px',
      'xs': {'min': '320px', 'max': '639.9px'},
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // 'sm': {'min': '640px', 'max': '767.9px'},
      // 'md': {'min': '768px', 'max': '1023.9px'},
      // 'lg': {'min': '1024px', 'max': '1279.9px'},
      // 'xl': {'min': '1280px', 'max': '1535.9px'},
    },
    extend: {},
  },
  plugins: [
    // require('@tailwindcss/line-clamp'),
  ],
}