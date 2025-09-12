const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.[contenthash].js",
        path: path.resolve(__dirname, "build"),
        clean: true,
        publicPath: "/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css"],
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                    }
                }
            },
            {
                test: /\.css$/i,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            inject: "body",
            scriptLoading: "defer",
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env.DOMAIN": JSON.stringify(process.env.DOMAIN)
        }),
        ...(isProd ? [
                  new MiniCssExtractPlugin({
                      filename: "css/[name].[contenthash].css",
                      chunkFilename: "css/[id].[contenthash].css",
                      ignoreOrder: false
                  })
                ] : [new ReactRefreshWebpackPlugin()])
    ],
    devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
            watch: true
        },
        historyApiFallback: true,
        hot: true,
        host: "127.0.0.1",
        port: process.env.PORT_DEV ?? 3000,
        allowedHosts: [`dev.${process.env.DOMAIN}`],
        compress: true,
        headers: {
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "no-referrer",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
        },
        client: {
            overlay: true,
            webSocketURL: {
                hostname: `dev.${process.env.DOMAIN}`,
                port: 443,
                protocol: "wss",
                pathname: "/ws"
            }
        }
    },
    optimization: {
        minimize: isProd,
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: "single"
    },
    performance: {
        hints: isProd ? "warning" : false,
        maxAssetSize: 250000,
        maxEntrypointSize: 250000
    },
    cache: {
        type: "filesystem"
    }
};
