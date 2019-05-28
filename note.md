## webpack：模块打包工具

### 1. 解决的问题：

1. 多文件加载，浪费请求
2. 不好判断文件层级关系
3. 不好排错

### 2. 使用ES Module 模块引入方式

```js
// 引入
import xx from ''

// 导出
export default xx
```

[概念：模块](https://webpack.docschina.org/concepts/modules/)
[使用：MODULES](https://webpack.docschina.org/api/module-methods/)

### 3. webpack 环境搭建

```js
npm init -y
npm install webpack webpack-cli -D

// 全局
npx webpack main.js
// 本地
npx webpack main.js
// scripts
npm run build -> webpack
```

创建 webpack 配置文件：webpack.dev.js

```
├── note.md
├── package.json
├── postcss.config.js
├── src
│   └── main.js
└── webpack.dev.js
```

loader 用于对模块的源代码进行转换。
loader 可以使你在 import 或"加载"模块时预处理文件。

### 4. (管理资源)[https://webpack.docschina.org/guides/asset-management/]

图片：url-loader
CSS：style-loader, css-loader, postcss-loader
字体文件：file-loader
JS：babel-loader
JSON:默认支持
全局资源

### 5. 使用插件

plugins：插件的功能，就是在某个时刻干一件事情


### 6. output

[配置：输出](https://www.webpackjs.com/configuration/output/)
[指南：管理输出](https://www.webpackjs.com/guides/output-management/)


### 7. source-map

### 8. webpack-dev-server

[配置：webpack-dev-server](https://webpack.js.org/configuration/dev-server)

```js
devServer: {
    // 从 dist 开启一个服务
    contentBase: "./dist",
    // 打开浏览器
    open: true,
    proxy: {
        "/api": "http://192.168.1.1:3000"
    },
    //
    hot: true,
    hotOnly: true
},
plugins: [
    // 配合 devServer的 hot、hotOnly
    // 实现只改变 css，不会改 js 的内容。测试异步、多步骤的那种场景就方便了。
    new webpack.HotModuleReplacementPlugin()
],
```

[指南：模块热替换](https://webpack.docschina.org/guides/hot-module-replacement/)
[API:模块热替换](https://webpack.docschina.org/api/hot-module-replacement/)
[概念：模块热替换](https://webpack.docschina.org/concepts/hot-module-replacement/)

```javascript
import number from './number'
// 保证 使用插件 new webpack.HotModuleReplacementPlugin()
if(module.hot){
    module.hot.accept('./number', ()=>{
        number()
    })
}
```

### 9. babel

- 做打包的工具、babel的核心库
  - `babel-loader @babel/core`
- ES6->ES5
  - `@babel/preset-env`
- polyfill
  - 安装：`npm i @babel/polyfill`
  - 主文件引入：`import "@babel/polyfill"`
- 在写 UI 组监库，类库使用下面的转义插件
  - `@babel/plugin-transform-runtime`


```js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                "presets": [["@babel/preset-env",{
                    "targets": {
                        "edge": "17",
                        "firefox": "60",
                        "chrome": "67",
                        "safari": "11.1"
                    },
                    "useBuiltIns": "usage"
                }]],
            }
            /* 写库、UI 组件时，防止全局污染
            options: [
                ["@babel/plugin-transform-runtime"],
                {
                    // 改成 2，要安装@babel/runtime-corejs2
                    "corejs": 2,
                    "helpers": true,
                    "regenerator": true,
                    "useESModules": false
                }
            ]
            */
            // 或者配置单文件 .babelrc
        }
    ]
}
```


### 10. React.js 打包

`@babel/preset-react`

```
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            options: {
                "presets": [
                    [
                        "@babel/preset-env",
                        {
                            "useBuiltIns": "usage"
                        }
                    ],
                    "@babel/preset-react"
                ],
            }
        }
    ]
}
```

### 11. Tree Shaking：只支持 ES Module 方式

没引入的，就不打包

```js
// webpack.dev.js
optimization: {
    // Tree Shaking
    usedExports: true
}

// package.json
"sideEffects": false

"sideEffects": [
    "*.css",
    "@babel/polyfill"
]
```

### 12. Development模式打包 和 Production 模式打包

`webpack.dev.js`引入`webpack-merge`

```js
import merge from 'webpack-merge'
```

### 13. webpack 和 Code Splitting 代码分隔

```js
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
```

异步引入

babel-plugin-dynamic-import-webpack

![异步引入](http://ww1.sinaimg.cn/large/006tNc79ly1g3gcxpvf4dj31f40jwagh.jpg)

```js
# .babelrc
{
  "plugins": [],
  "plugins": ["dynamic-import-webpack"]
}

```

### 14. Lazy Loading，Chunk是什么

```
import(/* webpackChunkName:"lodash" */ 'lodash').then(({default: _})=>{

})
```

### 15. CSS代码文件分割：MiniCssExtractPlugin


[文档地址](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)


`optimize-css-assets-webpack-plugin`代码合并

- 与 splitChunks 配合，根据多个入口打包成一个 CSS 文件
- 与 splitChunks 配合，根据入口，打包一个与之对应的CSS 文件


### 16. Shimming (垫片) 的作用

比如：this 指向 window， `imports-loader`

![code](http://ww2.sinaimg.cn/large/006tNc79ly1g3gx6mh5t8j311w0eijuk.jpg)


### 17. 环境变量的使用

### 18. Library

![配置](http://ww4.sinaimg.cn/large/006tNc79ly1g3h09r4cl5j314i0goae5.jpg)


### 19. ESLint

安装：npm install eslint -D
初始化：npx eslint --init


安装：eslint-loader
配置：devServer.overlay: true

### 20. 提升打包速度




















