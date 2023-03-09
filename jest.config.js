const path = require('path');

/**
 * configuring the react testing library setup file (rtl.setup.js) with jest configuration
 */
module.exports = {
  roots: [path.resolve(__dirname, 'src')],
  setupFilesAfterEnv: [path.resolve(__dirname, './rtl.setup.js')],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  resetMocks: true,
  moduleDirectories: [
    path.join(__dirname, '../src'),
    'node_modules',
    'test-utils',
    __dirname,
  ],
  globals: {
    baseUrl: '',
    commonBaseUrl: '',
    vpdBaseUrl: '',
  },
};
