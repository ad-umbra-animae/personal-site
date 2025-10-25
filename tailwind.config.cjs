/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{njk,md,html}", // all your templates
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // enables prose classes
  ],
}