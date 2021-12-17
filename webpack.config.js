const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  output: {
    filename: '[name].[contenthash]',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
     cacheGroups: {
       vendor: {
         test: /[\\/]node_modules[\\/]/,
         name: 'vendors',
         chunks: 'all'
       }
     }
   }
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './styles/*'
    }]),
    new CopyWebpackPlugin([{
      from: './assets/*'
    }]),
    new HtmlWebpackPlugin({
      template:"./index.ejs",
      inject: 'body'
    }),
  ]
};
