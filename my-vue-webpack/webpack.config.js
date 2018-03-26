var path = require('path');
var webpack = require('webpack');
// var validate = require('webpack-validator');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var Merge = require('webpack-merge');
//公共库
var axios = require('axios');
var vue = require('vue');
var jquery = require('jquery');
var qs = require('qs');

var currentTarget = process.env.npm_lifecycle_event;

var debug,          // is debug
    devServer,      // is hrm mode
    minimize;       // is minimize


if (currentTarget == "build") { // online mode （线上模式）
    debug = false, devServer = false, minimize = true;
} else if (currentTarget == "dev") { // dev mode （开发模式）
    debug = true, devServer = false, minimize = false;
} else if (currentTarget == "dev-hrm") { // dev HRM mode （热更新模式）
    debug = true, devServer = true, minimize = false;
}

var PATHS = {
	publicPath:debug?'/':'/hdjmanager/',//将图片字体等放置的路径
	libsPath:path.resolve(process.cwd(),'./libs'),//公共类库路径
	srcPath:path.resolve(process.cwd(),'./src'),//源代码
	node_modulesPath:path.resolve('./node_modules')//nodeModules
}

var entry = {
    main: './src/app.js',
    login:'./src/login.js'
};

var output = {
    path: path.join(__dirname, 'hdjmanager'),
    publicPath: PATHS.publicPath,//将图片字体等放置的路径
    filename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',
    chunkFilename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js'
}

var loaders = [
    {
        test: /\.html$/,
        loader: "html"
    },
    {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
              scss: 'style-loader!css-loader!sass-loader',
              sass: 'style-loader!css-loader!sass-loader?indentedSyntax',
          }
        }
    },
    {
        test: /\.js$/, //是一个正则，代表js或者jsx后缀的文件要使用下面的loader
        loader: "babel-loader",
        exclude: /node_modules/
    },
    {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'url-loader',
        query: {
            limit: 10000,
            name: 'images/[name]-[hash:8].[ext]'
        }
    },
    {
        test: /\.(mp4|ogv|mpeg|webm|swf)$/,
        loader: 'file-loader',
        query: {
            name: 'video/[name]-[hash:8].[ext]'
        }
    },
    {
      test: /\.mp3$/,
      loader: 'file-loader',
      query: {
        name: 'audio/[name]-[hash:8].[ext]'
      }
    },
    {
        test: /\.(eot*|woff*|woff2*|ttf*|svg*)/,
        loader: 'url-loader',
        query: {
            limit: 5000,
            name: 'fonts/[name]-[hash:8].[ext]'
        }
    },
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
    },
];

var plugins =[
        new ExtractTextPlugin(devServer ? "css/[name].css" : "css/[name]-[chunkhash:8].css", {allChunks: true}),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new CleanWebpackPlugin(['hdjmanager'], {
            root: '', 
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + '/src/index.html',
            chunks: ['main'],
            inject: 'true'
        }),
        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: __dirname + '/src/login.html',
            chunks: ['login'],
            inject: 'true'
        }),
        new webpack.ProvidePlugin({
            "Vue": "vue",
            "axios":"axios",
            $:"jquery",
            Jquery:"jquery",
            "window.jquery":"jquery",
            qs:"qs"
        })
];

var resolve = {
    //为了使用独立构建
    alias: {
        'vue$': "vue/dist/vue.common.js"
    },
    root: [
        PATHS.node_modulesPath
    ],
    extensions: ['', '.js', '.es6', '.vue','.mp3']
};

if (minimize) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({ // js、css都会压缩
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'module', '_']
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        }),
        //压缩vue
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: '"production"'
          }})
    )
}

var config = {
    entry: entry,
    resolveLoader: {root: path.join(__dirname, "node_modules")},//require模块时查找模块的路径
    output: output,
    module: {
        loaders: loaders
    },
    babel: {
       presets: ['es2015']
   },
    vue:{
        loaders:{
            css: ExtractTextPlugin.extract("css"),
            scss: ExtractTextPlugin.extract("css!sass"),
            // scss: 'style-loader!css-loader!sass-loader',
            sass: 'style-loader!css-loader!sass-loader?indentedSyntax',
        }
    },
    resolve: resolve,
    plugins: plugins,
}

if (devServer) {
    config = Merge(
        config,
        {
            plugins: [
                new webpack.HotModuleReplacementPlugin({
                    multiStep: true
                }),
                new OpenBrowserPlugin({url: 'http://localhost:8083' + PATHS.publicPath + 'login.html'})
            ],
            devServer: {
                historyApiFallback: true,
                hot: true,
                inline: true,
                stats: 'errors-only',
                host: "localhost",
                port: "8083",
                proxy: {
                    '/tvshop': {
                        target: 'http://api.vrshop.hongdoujiao.com:8721',
                        // target: 'http://115.239.231.163',
                        changeOrigin: true,
                        pathRewrite: {
                          '^/tvshop': '/tvshop'
                        }
                    }
                }
            }
        }
    );
}

module.exports = config;