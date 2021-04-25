const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const path = require('path')
const webpack = require('webpack')

module.exports = WebpackMerge.merge(common, {
  mode: 'development',
  output: {
      filename: 'js/[name].[hash:8].bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    port: 9001,
    compress: true,
    // hot: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              }
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              }
            }
          },
          'less-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test:/\.css$/,
        exclude:/src/,
        use: [
          { loader: "style-loader"},
          {
            loader: "css-loader",
          }
        ]
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'public/index.html',
          inject: 'body',
          hash: false,
      }),
      new webpack.HotModuleReplacementPlugin()
  ],
});
