const path = require("path");
const webpack = require("webpack");

/* global __dirname*/
/* global module*/

const config = (env, argv) => {
    return {
        entry: ["@babel/polyfill", "./client/index.js"],
        output: {
            path: path.resolve(__dirname, "server/build"),
            filename: "main.js",
            publicPath: "/"
        },
        devServer: {
            contentBase: path.resolve(__dirname, "server/build"),
            compress: true,
            port: 3000,
            historyApiFallback: true,
            https: true
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
        },
        plugins: [
            new webpack.DefinePlugin({
                "BACKEND_URL": JSON.stringify("https://localhost:3001")
            })
        ]
    };
};

module.exports = config;