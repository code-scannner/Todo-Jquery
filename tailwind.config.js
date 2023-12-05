/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
    content: ["./**/*.{html,js}"],
    theme: {
      
      extend: {
        colors : {
          "primary" : "rgb(0 72 75)",
          "primary-light" : "rgb(0 72 75)",
          "primary-vlight" : "rgb(0 173 179)",
          "primary-dark" : "rgb(0 49 51)",
        }
      },
      
    },
    plugins: [],
  }