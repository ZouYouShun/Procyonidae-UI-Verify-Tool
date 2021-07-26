const { join } = require('path');
// const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

module.exports = {
  purge: [
    join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
    // https://githubmemory.com/repo/nrwl/nx/issues/6369
    // ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
