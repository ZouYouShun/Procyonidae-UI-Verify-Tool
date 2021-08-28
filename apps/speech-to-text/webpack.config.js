const getBaseWebpackConfig = require('@nrwl/react/plugins/webpack');

function getWebpackConfig(config) {
  const toConfig = getBaseWebpackConfig(config);

  // TODO: that will let firebase auth broken
  toConfig.devServer.headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
  toConfig.devServer.headers['Cross-Origin-Opener-Policy'] = 'same-origin';

  return toConfig;
}

module.exports = getWebpackConfig;
