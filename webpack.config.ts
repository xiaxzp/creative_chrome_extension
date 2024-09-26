import { distDir, isDev, r } from 'scripts/utils';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import CopyWebpackPlugin from 'copy-webpack-plugin';
// import { EsbuildPlugin } from 'esbuild-loader';
import { VueLoaderPlugin } from 'vue-loader';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';
import CircularDependencyPlugin from 'circular-dependency-plugin';

const path = require('node:path');
const UnoCSS = require('@unocss/webpack').default;

const sourcePath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, distDir);

module.exports = {
  devtool: false, // https://github.com/webpack/webpack/issues/1194#issuecomment-560382342

  stats: {
    all: false,
    builtAt: true,
    errors: true,
    hash: true,
  },

  mode: isDev ? 'development' : 'production',

  entry: {
    serviceworker: path.join(sourcePath, 'serviceworker', 'index.ts'),
    content: path.join(sourcePath, 'content', 'index.ts'),
    popup: path.join(sourcePath, 'popup', 'main.ts'),
    options: path.join(sourcePath, 'options', 'main.ts'),
    inject: path.join(sourcePath, 'inject', 'index.ts'),
    devtools: path.join(sourcePath, 'devtools', 'main.ts'),
    devtoolsPanel: path.join(sourcePath, 'devtools', 'panel.ts'),
  },

  output: {
    path: destPath,
    filename: '[name]/[name].js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.vue'],
    alias: {
      '~': path.resolve(__dirname, 'src/'),
      '@imgs': path.resolve(__dirname, 'public/imgs/'),
    },
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'esbuild-loader',
        exclude: /node_modules/,
        options: {
          loader: 'js',
          target: 'es2015',
        },
      },
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        exclude: /node_modules/,
        options: {
          loader: 'ts',
          target: 'es2015',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
          },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // It creates a CSS file per JS file which contains CSS
          },
          {
            loader: 'css-loader', // Takes the CSS files and returns the CSS with imports and url(...) for Webpack
          },
          {
            loader: 'postcss-loader',
          },
          // 'resolve-url-loader', // Rewrites relative paths in url() statements
          {
            loader: 'sass-loader',
            options: { implementation: require('sass') },
          },
        ],
      },
    ],
  },

  plugins: [

    new CircularDependencyPlugin(
      {
        exclude: /node_modules/,
        include: /src/,
        failOnError: false,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      },
    ),
    new VueLoaderPlugin(),
    require('unplugin-vue-macros/webpack')({}),
    require('unplugin-auto-import/webpack').default({
      imports: [
        'vue',
        {
          'webextension-polyfill': [['*', 'browser']],
        },
      ],
      dts: r('src/auto-imports.d.ts'),
    }),
    require('unplugin-icons/webpack').default({ /* options */ }),
    require('unplugin-vue-components/webpack').default({
      dirs: [r('src/components')],
      // generate `components.d.ts` for ts support with Volar
      dts: true,
      resolvers: [
        ElementPlusResolver(),
        // auto import icons
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    UnoCSS(),
    new webpack.DefinePlugin({
      __DEV__: isDev,
    }),
    new ForkTsCheckerWebpackPlugin({}),
    new MiniCssExtractPlugin({
      filename: '[name]/[name].css',
    }),
    // copy static assets
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/imgs', to: 'imgs' },
        { from: 'public/lib', to: 'lib' },
        { from: 'src/rules', to: 'rules' },
      ],
    }),

    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'popup/index.html'),
      inject: false,
      chunks: ['popup'],
      hash: false,
      filename: 'popup/index.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'options/index.html'),
      inject: false,
      chunks: ['options'],
      hash: false,
      filename: 'options/index.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'devtools/index.html'),
      inject: false,
      chunks: ['devtools'],
      hash: false,
      filename: 'devtools/index.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'devtools/panel.html'),
      inject: false,
      chunks: ['devtoolsPanel'],
      hash: false,
      filename: 'devtoolsPanel/panel.html',
    }),
  ],

  optimization: {
    realContentHash: true,
    minimizer: [false],
    splitChunks: false,
    // minimizer: [
    //   new EsbuildPlugin({
    //     target: 'es2015',  // Syntax to transpile to (see options below for possible values)
    //     css: true,
    //   }),
    // ],
  },
};
