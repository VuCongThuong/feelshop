const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const projectName = 'feelshop';

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  output: {
    path: path.join(__dirname, '../statics/'),
    clean: true,
  },

  resolve: {
    alias: {
      '@fonts': path.join(__dirname, 'src/fonts'),
      '@scripts': path.join(__dirname, 'src/js'),
      '@styles': path.join(__dirname, 'src/scss'),
      '@images': path.join(__dirname, 'src/images'),
      '@node_modules': path.join(__dirname, 'node_modules'),
    },
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },

  plugins: [
    new HtmlBundlerPlugin({
      entry: {
        ...require('glob')
          .sync('src/views/*.html')
          .reduce((entries, file) => {
            const fileName = path.basename(file, '.html');
            entries[fileName] = file;
            return entries;
          }, {}),
      },
      js: {
        filename: 'assets/js/[name].js',
      },
      css: {
        filename: 'assets/css/[name].css',
      },
      minify: {
        collapseWhitespace: false,
        keepClosingSlash: true,
        removeComments: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      }
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.join(__dirname, '../statics/assets'),
    //       to: path.join(__dirname, `../../wp-content/themes/${projectName}/assets`),
    //       force: false,
    //       noErrorOnMissing: true
    //     },
    //   ],
    // }),
  ],

  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: ['css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(ico|webp|png|jp?g|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },

  devServer: {
    open: true,
    static: path.resolve(__dirname, 'dist'),
    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};
