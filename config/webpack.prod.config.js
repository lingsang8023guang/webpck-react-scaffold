const WebpackMerge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizaCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = WebpackMerge.merge(common, {
  mode: 'production',
  output: {
      filename: 'js/[name].[chunkhash:8].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              }
            }
          },
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer()
              ]
            }
          },
        ]
      },
      {
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              }
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test:/\.css$/,
        exclude:/src/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'public/index.html',
          inject: 'body',
          minify: {
              removeComments: true,
              collapseWhitespace: true,
          }
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[id].[hash].css',
      })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizaCssAssetsPlugin({
        assetNameRegExp:/\.css$/g,
        cssProcessor:require("cssnano"),
        cssProcessorPluginOptions:{
          preset:['default', { discardComments: { removeAll:true } }]
        },
        canPrint:true
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      cacheGroups: {
        framework: {
          test: "framework",
          name: "framework",
          enforce: true
        },
        vendors: {
          priority: -10,
          test: /node_modules/,
          name: "vendor",
          enforce: true,
        },
      }
    }
  }
});