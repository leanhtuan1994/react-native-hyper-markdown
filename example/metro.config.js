const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],
  resolver: {
    // Make react-syntax-highlighter available to the main library
    extraNodeModules: {
      'react-syntax-highlighter': path.resolve(
        __dirname,
        'node_modules/react-syntax-highlighter',
      ),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
