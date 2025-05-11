const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const env = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
}).parsed;

// Create env object for webpack
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    panel: './src/index.js',
    config: './src/config.index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            },
          },
          'postcss-loader'
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  devtool: isDevelopment ? 'source-map' : false,
  devServer: isDevelopment ? {
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true
    },
    compress: true,
    port: 8080,
    hot: 'only',
    historyApiFallback: true,
    https: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    devMiddleware: {
      writeToDisk: true
    }
  } : undefined,
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new HtmlWebpackPlugin({
      template: './panel.html',
      filename: 'panel.html',
      chunks: ['panel']
    }),
    new HtmlWebpackPlugin({
      template: './config.html',
      filename: 'config.html',
      chunks: ['config']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'src/assets',
          to: 'assets'
        },
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    })
  ]
}; 