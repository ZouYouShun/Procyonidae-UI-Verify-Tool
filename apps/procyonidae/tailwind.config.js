const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');

// const { join } = require('path');
// https://githubmemory.com/repo/nrwl/nx/issues/6369
// join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
// ...createGlobPatternsForDependencies(__dirname),

module.exports = {
  purge: createGlobPatternsForDependencies(__dirname),
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
