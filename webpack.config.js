const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background.js',
    content: './src/content.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/manifest.json' },
      { from: './src/images/', to: 'images' },
      { from: './src/main.css' },
    ])
  ],
  watch: true,
};
