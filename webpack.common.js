const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const TEMPLATE_PATH = path.resolve(__dirname, 'src/index.html');

const getWebpackCommonSettings = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      template: TEMPLATE_PATH,
    }),
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin(),
  ],
  module: {
    rules: [{
      test: /\.(jpeg|png|gif|svg)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'file-loader',
      }],
    },
    {
      test: /\.(sa|sc|c)ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      sideEffects: true,
    },
    {
      test: /\.(woff2|ttf|woff|eot|svg)$/,
      use: [{ loader: 'file-loader' }],
    },
    {
      test: /\.js|jsx$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
});

module.exports = {
  getWebpackCommonSettings,
};
