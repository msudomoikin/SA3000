const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./package.json')
const template = 'index.html'

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      {
        test: /\.(mp3|png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'file-loader',
        options: {
          limit: 9008192,
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(Object.assign(config.app, { template })),
    // new MiniCssExtractPlugin({ file: 'main.css' })
  ]
},
{
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
      {
        test: /\.(mp3|png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'file-loader',
        options: {
          limit: 9008192,
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(Object.assign(config.app, { template })),
    // new MiniCssExtractPlugin({ file: 'main.css' })
  ]
}
