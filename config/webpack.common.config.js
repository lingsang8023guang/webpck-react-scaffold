const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    framework: ['react','react-dom']
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192,
          },
        }
      }
    ]
  }
}