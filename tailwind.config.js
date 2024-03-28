const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary-lighter": colors.blue[100],
        "primary-light": colors.blue[200],
        "primary-medium": colors.blue[400],
        "primary-dark": colors.blue[600],
        "primary-darker": colors.blue[800],

        "secondary-lighter": colors.gray[100],
        "secondary-light": colors.gray[200],
        "secondary-medium": colors.gray[400],
        "secondary-dark": colors.gray[600],
        "secondary-darker": colors.gray[800],
      },
    },
  },
  plugins: [],
};
