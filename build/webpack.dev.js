const webpack = require('webpack')
const commonConfig = require('./webpack.common.js')
const merge = require('webpack-merge')

const devConfig = {
    // 模式：默认生产环境production，
    // 还有开发环境 development
    mode: "development",

    // source-map 映射文件
    // none | pro cheap-module-source-map | dev cheap-module-eval-source-map
    // inline 打包进 main.js
    // cheap 提示哪行错误、不精确到列。 只负责业务代码。loader 里的错误不管
    devtool: "cheap-module-eval-source-map",

    // webpack-dev-server
    devServer: {
        contentBase: "./dist",
        open: true,
        proxy: {
            "/api": "http://192.168.1.1:3000"
        },
        hot: true,
        hotOnly: true
    },
    plugins: [
        // 配合 devServer的 hot、hotOnly
        // 实现只改变 css
        new webpack.HotModuleReplacementPlugin()
    ],
    optimization: {
        // Tree Shaking
        usedExports: true
    }
}


module.exports = merge(commonConfig, devConfig)
