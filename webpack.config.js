// const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    // App: './views/',
    // FrontPage: './views/client-pages/FrontPage.js',
    LoginPage: './views/client-pages/LoginPage.js',
  },
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: '[name].js',
    publicPath: '/assets/',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    // lodash: 'lodash',
  },
  module: {
    // noParse: ['react', 'react-dom'],
    rules: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['relay', 'transform-runtime'],
        },
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    // modulesDirectories: ['scss', 'views/global', 'config', 'node_modules'],
    alias: {
      // 'global-components': path.resolve('./views/global-components'),
      // config: path.resolve('./config'),
      // pages: path.resolve('./views/pages'),
      // 'twitter-text': path.resolve('./config/twitter-text.js'),
      // NOTE: Alias does not work in schemas.
      // This is because schemas does not get built by webpack.
      // Use relative path instead of alias in schemas.
    },
    extensions: ['.js', '.json', '.scss'],
  },
  plugins: (process.env.NODE_ENV === 'production') ? [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // new CompressionPlugin({
    //   asset: '[path].gz',
    //   algorithm: 'gzip',
    //   // test: /\.js$|\.html$/,
    //   test: /\.js$/,
    //   threshold: 0,
    //   minRatio: 0.8,
    //   // blocksplittingmax: 33,
    // }),
  ] : [],
};

module.exports = config;
