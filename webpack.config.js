const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const helpers = require('./src/config/helpers');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    'app': [
      helpers.root('index.js')
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
  },

  module: {
    rules: [
      { test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
      },      
    ]
  },
  devServer: {
    historyApiFallback: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),

    new ExtractTextPlugin({
      filename: 'css/[name].[hash].css',
    }),

    new CopyWebpackPlugin([{
      from: helpers.root('assets')
    }]),

    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    })
  ]
}
