const path = require('path');
const { getWebpackCommonSettings } = require('./webpack.common');
const packageJson = require('./package');

const devMode = (process.env.NODE_ENV === 'development');
const OUTPUT_PATH = path.resolve(__dirname, 'build');
const ENTRY_PATH = path.resolve(__dirname, 'src/index.jsx');

module.exports = {
  devtool: devMode ? 'source-map' : false,
  entry: ENTRY_PATH,
  context: path.join(__dirname),
  output: {
    filename: 'it.bundle.js',
    path: OUTPUT_PATH,
    publicPath: '/',
    libraryTarget: 'system',
  },
  ...getWebpackCommonSettings(devMode),
  externals: Object.keys(packageJson.peerDependencies),
};
