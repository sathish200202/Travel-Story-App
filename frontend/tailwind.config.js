/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: { courgette: ["Courgette", "sans-serif"] },
    extend: {
      //colors used in the project
      colors: {
        primary: "#06B6D4",
        secondary: "EF863E",
      },
      backgroundImage: {
        "login-bg-img": "url('./public/images/login.webp')",
        "signup-bg-img": "url('./public/images/bg_image.png')",
      },
    },
  },
  plugins: [],
};
