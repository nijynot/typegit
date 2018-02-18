const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    // App: './views/',
    // FrontPage: './views/client-pages/FrontPage.js',
    LandingPage: './src/views/client-pages/LandingPage.js',
    HomePage: './src/views/client-pages/HomePage.js',
    DraftingPage: './src/views/client-pages/DraftingPage.js',
    MemoryPage: './src/views/client-pages/MemoryPage.js',
    MemoryEditPage: './src/views/client-pages/MemoryEditPage.js',
    LoginPage: './src/views/client-pages/LoginPage.js',
    RegisterPage: './src/views/client-pages/RegisterPage.js',
    TagPage: './src/views/client-pages/TagPage.js',
    InsightsPage: './src/views/client-pages/InsightsPage.js',
    SettingsAccountPage: './src/views/client-pages/SettingsAccountPage.js',
    SettingsPasswordPage: './src/views/client-pages/SettingsPasswordPage.js',
    SettingsSubscriptionPage: './src/views/client-pages/SettingsSubscriptionPage.js',
    PaymentPage: './src/views/client-pages/PaymentPage.js',
    ErrorPage: './src/views/client-pages/ErrorPage.js',
    FaqPage: './src/views/client-pages/FaqPage.js',
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
    // modulesDirectories: ['scss', 'views/global-components', 'config', 'node_modules'],
    alias: {
      'global-components': path.resolve(__dirname, 'src/views/global-components'),
      'global-mutations': path.resolve(__dirname, 'src/views/global-mutations'),
      'twitter-text': path.resolve('./vendor/twitter-text.js'),
      // config: path.resolve('./config'),
      // pages: path.resolve('./views/pages'),
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
    new CompressionPlugin({
      asset: '[path].gz',
      algorithm: 'gzip',
      // test: /\.js$|\.html$/,
      test: /\.js$/,
      threshold: 0,
      minRatio: 0.8,
      // blocksplittingmax: 33,
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        ecma: 8,
        compress: {
          warnings: false,
        },
      },
    }),
  ] : [],
};

module.exports = config;
