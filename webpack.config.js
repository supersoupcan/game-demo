const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, 'client_src', 'index.js')],
  output: {
    path: path.resolve(__dirname, 'client_dist'),
    filename: 'bundle.js'
  },
  externals: {
    oimo: "OIMO",
    cannon: "CANNON",
    earcut: "EARCUT"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      }
    }]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'client_src', 'index.html')
    })
  ]
}