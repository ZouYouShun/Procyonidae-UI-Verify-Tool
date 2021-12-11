/** @type {import('@jest/types').Config.InitialOptions} */
const nxPreset = require('@nrwl/jest/preset');

nxPreset.setupFiles = ['jest-canvas-mock'];
nxPreset.testEnvironmentOptions = {
  ...(nxPreset.testEnvironmentOptions || {}),
  resources: 'usable',
};

module.exports = { ...nxPreset };
