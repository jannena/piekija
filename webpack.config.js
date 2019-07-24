const path = require("path");
const webpack = require("webpack");

/* global __dirname*/
/* global module*/

const config = (env, argv) => {
    return {
        entry: ["@babel/polyfill", "./client/src/index.js"],
        output: {
            path: path.resolve(__dirname, "client/build"),
            filename: "main.js"
        },
        devServer: {
            contentBase: path.resolve(__dirname, "client/build"),
            compress: true,
            port: 3000
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    query: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                },
                {
                    test: /\.css$/,
                    loader: ["style-loader", "css-loader"]
                }
            ]
        }
    };
};

module.exports = config;