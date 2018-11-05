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

  output: {
    path: helpers.root('dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },

  /*optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },*/

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
          'file-loader',
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
    new webpack.HashedModuleIdsPlugin(),

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
