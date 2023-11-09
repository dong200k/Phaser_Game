const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // source maps provide useful information durning development
  devServer: {
    static: './dist',
  },
});