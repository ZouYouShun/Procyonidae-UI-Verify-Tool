module.exports = {
  displayName: 'browser-settings-feature-speech-to-text',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/browser/settings/feature/speech-to-text',
};
