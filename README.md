### https://github.com/vortesnail/blog/issues/6
### https://kasong.gitee.io/just-react/preparation/idea.html
### 1 npm init -y 生成package.json
### 2 npm install --save-dev webpack webpack-cli 安装webpack
### 3 新建config.js package.json中配置start 
      可以npm run start测试打包生成dist
### 4 npm install --save-dev webpack-merge
      我们将使用一个名为 webpack-merge 的工具。通过“通用”配置，我们不必在环境特定(environment-specific)的配置中重复代码。简单来说就是生产环境不同，我们要给的配置也有所不同，但是可以共用一个共有的配置。
### 5 package.json中配置build webpack.prod.config.js中使用merge
      坑：引入webpack.merge,调用merge方法

      webpack根本识别不了jsx语法，那怎么办？使用loader对文件进行预处理。
其中，babel-loader，就是这样一个预处理插件，它加载 ES2015+ 代码，然后使用 Babel 转译为 ES5。
     **babel-loader：**使用Babel和webpack来转译JavaScript文件。
     **@babel/preset-react：**转译react的JSX
     **@babel/preset-env：**转译ES2015+的语法
     **@babel/core：**babel的核心模块
### 6 自动将js引入到index.html文件中，使用html-webpack-plugin
      npm install --save-dev html-webpack-plugin
      在webpack.prod.config.js中配置plugins
      `
       plugins: [
            new HtmlWebpackPlugin({
            filename: 'index.html',
            // 我的理解是无论与要用的template是不是在一个目录，都是从根路径开始查找
            template: 'public/index.html',
            inject: 'body', --在body最底部引入js,如果是head,就在head中引入js
            minify: {
                removeComments: true, --去掉注释
                collapseWhitespace: true, --去除空格
            },
            })
        ]
      `
### 7 给打包出的js文件换个不确定的名字
     这个操作是为了防止因为浏览器缓存带来的业务代码更新，而页面却没变化的问题，你想想看，假如客户端请求js文件的时候发现名字是一样的，那么它很有可能不发新的数据包，而直接用之前缓存的文件，当然，这和缓存策略有关。[hash]或[chunkhash]
     在prod.config.js中重新设置output,会覆盖common.config.js
     `
     output: {
      filename: 'js/[name].[chunkhash:8].bundle.js'
  },`
     name:模块名称,entry中设置的
     chunkhash是文件内容的hash,webpack默认采用md5对文件进行hash,8是hash的长度，webpack默认会设置为20
##  7-1 hash区别
     hash是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的hash值都会更改，并且全部文件都共用相同的hash值,构建文件生成的hsah都是一样的；但是--每一次构建后生成的哈希值都不一样，即使文件内容压根没有改变，这样子是没办法实现缓存效果。

     chunkhash和hash不一样，它根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。

     （如果index.css被index.js引用了，就有相同的chunkhash值，这样js改变但是css没改变，构建的时候这个模块还是会一块构建--chunkhash的弊端）

     所以可以用contenthash ---使用extract-text-webpack-plugin
     `
      plugins:[
        new extractTextPlugin('../css/bundle.[name].[contenthash].css')
     ]`
### 8 打包编译前清理dist目录 npm install --save-dev clean-webpack-plugin
### 9 抽离公共的模块，例如每次的react,react-dom...
     `
      entry: {
            index: './src/index.js',
            framework: ['react','react-dom'] --common中添加
       },`
       `
       prod中添加
        optimization: {
            splitChunks: {--自动提取所有公共模块到单独 bundle
            chunks: 'all', --同时分割同步和异步代码（async:分割异步打包的代码；initial:也会同时打包同步异步，但是异步内部的引入不考虑，直接打包在一起）
            minSize: 30000, --按需加载时候的最大并行请求数
            maxSize: 0,
            minChunks: 1, --最小公用模块次数
            cacheGroups: { --默认的规则不会打包，需要单独定义，默认设置了分割     node_modules和公用模块
                framework: {
                test: "framework",
                name: "framework",
                enforce: true
                },
                vendors: {
                priority: -10, --优先级
                test: /node_modules/,
                name: "vendor", --重新写文件名
                enforce: true, --强制生成
                },
            }
            }
        },
        test属性是比较关键的一个值，他可以是一个字符串，也可以是正则表达式，还可以是函数。如果定义的是字符串，会匹配入口模块名称，会从其他模块中把包含这个模块的抽离出来
       `
       这时候改一下index.js打包 发现index.bundle.js的hash值变了，但是freamework.bundle.js的hash值没有变
### 10 打包生成的js压缩 uglifyjs-webpack-plugin,optimization中配置minimizer
### 11 自动编译打包（热更新）webpack-dev-server
       npm install webpack-dev-server --save-dev
       然后在dev.config.js中添加 devServer配置
       `
       devServer: {
             open: true,  --自动打开浏览器
             port: 9014, --端口号
             hot: true, --热更新
             compress: true,   --启用gaip压缩

       }
       `
### 12 npm install --save-dev style-loader css-loader 配置loader
      遇到后缀为.css的文件，webpack先用css-loader加载器去解析这个文件，遇到“@import”等语句就将相应样式文件引入（所以如果没有css-loader，就没法解析这类语句），最后计算完的css，将会使用style-loader生成一个内容为最终解析完的css代码的style标签，放到head标签里。
      loader是有顺序的，webpack肯定是先将所有css模块依赖解析完得到计算结果再创建style标签。因此应该把style-loader放在css-loader的前面（webpack loader的执行顺序是从右到左）
      module:{rules:[{ test: /$/ }, ....]}
## 12-1  将css文件单独打包，使用插件mini-css-extract-plugin
      npm install --save-dev mini-css-extract-plugin
      修改modules里，和plugins里
## 12-2  压缩打包出的css文件 使用插件optimize-css-assets-webpack-plugin   
       `
       new OptimizaCssAssetsPlugin({
        assetNameRegExp:/\.css$/g,  ---正则表达式，用于匹配需要优化或者压缩的资源名。默认值是/.css$/g	
        cssProcessor:require("cssnano"),  --用于压缩和优化CSS 的处理器，默认是 cssnano.
        cssProcessorPluginOptions:{   --传递给cssProcessor的插件选项
          preset:['default', { discardComments: { removeAll:true } }]
        },
        canPrint:true  --表示插件能够在console中打印信息，默认值是true
      })
       ` 
## 12-3 安装less或者sass npm install --save-dev less less-loader node-sass sass-loader
        prod.config需要压缩配置
        安装PostCss  npm install postcss postcss-loader --save-dev
        postcss是什么？js转换css的一个平台，一个工具，通过插件去对css实现一些功能
        作用：自动添加属性前缀；可以变量定义font-size:var(size, 16px)
        （1）autoprefixer  npm install autoprefixer --save-dev  自动添加浏览器前缀
         (2) cssnext  使用CSS未来语法
         (3) precss   CSS预处理函数
         (4) css模块  不需要下载插件，配置loader即可
### 13 引入图片，iconfont配置
      file-loader 可以对图片文件进行打包，但是 url-loader 可以实现 file-loader 的所有功能，且能在图片大小限制范围内打包成base64图片插入到js文件中。
      url-loader依赖于file-loader，所有我们两个loder都要安装
      npm install file-loader url-loader --save-dev
      `
      test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',   ---输出的文件名：原来的名字.后缀
            outputPath: 'images/',  ---输出到dist目录下的路径 dist/images/...
            limit: 8192,  ---表示如果这个文件大于8k,那url-loader不用，用file-loader,把图片正常打包成一个单独的图片文件到设置的目录下，若是小于了8kb，那好，我就将图片打包成base64的图片格式插入到bundle.js文件中，这样做的好处是，减少了http请求，但是如果文件过大，js文件也会过大，得不偿失，这是为什么有limit的原因
          },
        }
      `
### 14 引入antd,按需加载(官网)

            
    