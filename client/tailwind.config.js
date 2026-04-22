/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "black-900": "#0A0A0A",
        "black-800": "#141414",
        "black-700": "#1F1F1F",
        gold: "#D4AF37",
        "gold-dark": "#B9911E"
      }
    }
  },
  plugins: []
};
