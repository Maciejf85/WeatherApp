const webpack = require('webpack');
const path = require("path");
const Html = require("html-webpack-plugin");
const MiniCSS = require("mini-css-extract-plugin");
const Compression = require("compression-webpack-plugin");
const Clean = require("clean-webpack-plugin");

module.exports = function (env) {
  const config = {};

  const isDev = env.dev ? true : false;
  const isProd = env.prod ? true : false;

  config.entry = `./src/app.js`;
  config.output = {
    filename: isDev ? "[name].js" : "[name].[chunkhash].js",
    path: path.resolve(__dirname, "build"),
    publicPath: '/'
  };

  config.devtool = isProd ? false : "source-map";

  config.module = {};
  config.module.rules = [];

  const browsers = {
    dev: ["Chrome > 60"],
    prod: ["> 3%"]
  };

  const js = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: isDev ? browsers.dev : browsers.prod
              }
            }
          ]
        ]
      }
    }
  };
  config.module.rules.push(js);

  const scss = {
    test: /\.scss$/,
    use: [
      isProd ? MiniCSS.loader : "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: isProd ? false : true
        }
      },
      {
        loader: "postcss-loader",
        options: {
          plugins: () => [
            new require("autoprefixer")({
              browsers: isProd ? browsers.prod : browsers.dev
            })
          ]
        }
      },
      "sass-loader"
    ]
  };

  config.module.rules.push(scss);

  const images = {
    test: /\.(jpg|jpeg|gif|png|csv)$/,
    use: {
      loader: "file-loader",
      options: {
        name: isProd ? "[name].[hash].[ext]" : "[name].[ext]",
        publicPath: "images",
        outputPath: "images"
      }
    }
  };

  config.module.rules.push(images);

  const fonts = {
    test: /\.(eot|ttf|woff|woff2)$/,
    use: {
      loader: "file-loader",
      options: {
        name: isProd ? "[name].[hash].[ext]" : "[name].[ext]",
        publicPath: "fonts",
        outputPath: "fonts"
      }
    }
  };

  config.module.rules.push(fonts);

  config.plugins = [];

  config.plugins.push(
    new Html({
      filename: "index.html",
      template: `./index.html`,
      minify: true
    })
  );

  if (isProd) {
    config.plugins.push(new MiniCSS({
      filename: "app.[chunkhash].css"
    }));

    config.plugins.push(
      new Compression({
        threshold: 0,
        minRatio: 0.8
      })
    );

    config.plugins.push(new Clean(["build"]));
  }

  if (isDev) {
    config.devServer = {
      port: 8080,
      progress: true,
      overlay: true,
      historyApiFallback: true
    };
  }

  return config;
};