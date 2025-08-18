/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <- pastikan sesuai struktur proyekmu
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFC107",
        secondary: "#03DAC6",
      },
    },
  },
};