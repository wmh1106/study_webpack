const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')


module.exports = {
    // 入口
    entry: {
        // 默认 main
        main: "./src/main.js"
    },
    // 出口
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../dist")
        // publicPath: "https://cdn.bootcss.com"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    // 功能跟 file-loader 差不多
                    // 不过图片一般用 url-loader
                    // 多了 limit
                    loader: "url-loader",
                    options: {
                        // placeholders 占位符
                        // name 名字、ext 后缀
                        name: "[name].[ext]",
                        // 相对于output下的 dist 目录
                        outputPath: "images/",
                        // 小于 2048 字节，2kb
                        limit: 2048
                    }
                }
            },
            {
                test: /\.scss$/,
                // 使用默认配置
                // use: ["style-loader", "css-loader", "postcss-loader"]

                // loader 顺序是右->左, 下->上
                // css-loader 分析 css 的关系，整合成一个 css 文件
                // style-loader 把 css 内容挂载到 html 的 head 标签里
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            // 模块化，vue 里的 scope
                            // modules: true
                        }
                    },
                    "scss-loader",
                    // 配置在 postcss.config.js 里
                    "postcss-loader"
                ]
            },
            {
                test: /\.(eot|ttf|svg)$/,
                use: {
                    loader: "file-loader"
                }
            }
        ]
    },
    plugins: [
        // 插件的功能，就是在某个时刻干一件事情

        // 会在打包结束后（时刻），自动生成一个 html 文件，并把打包生成的 js 自动引入到这个 html 文件中
        new HtmlWebpackPlugin({
            template: "src/index.html"
        }),
        // 会在打包前（时刻），清空 dist 目录下的文件
        new CleanWebpackPlugin(["dist"], {
            root: path.resolve(__dirname, '../')
        }),

        new webpack.ProvidePlugin({
            // 解决：第三方没引入库的问题
            $: 'jquery'
        })
    ],
    optimization: {
        // 代码分割
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            // 最多分隔 5 个
            maxAsyncRequests: 5,
            // 入口文件：最多分割 3 个
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // filename: "vendors.js"
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
}























