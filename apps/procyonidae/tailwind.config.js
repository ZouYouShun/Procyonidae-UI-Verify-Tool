const { join } = require('path');

module.exports = {
  purge: [join(__dirname, 'src/**/*.{js,ts,jsx,tsx}')],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
