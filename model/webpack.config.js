var path = require('path');

var webpack = require('webpack');

/*
 * verify config
 * （验证config文件是否正确）
 * */
var validate = require('webpack-validator');

/*
 * clean publishing directory
 * （清空发布目录）
 * */
var CleanWebpackPlugin = require('clean-webpack-plugin');

/*
 *  merge config
 *  （合并config文件）
 * */
var Merge = require('webpack-merge');

/*
 * auto open browser
 * （自动打开浏览器）
 * */
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

/*
 * create html
 * （创建html文件）
 * */
var HtmlWebpackPlugin = require('html-webpack-plugin');


/*
 * extract css
 * （提取css文件）
 * */
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var jquery = require('jquery');

/*
 *  Detect how npm is run and branch based on that
 *  （当前 npm 运行）
 * */
//公共库
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

  /*
   * publish path
   * （发布目录）
   * */
  publicPath: debug ? '/model/dist/' : '/vrShop/',

  /*
   * public resource path
   * （公共资源目录）
   * */
  libsPath: path.resolve(process.cwd(), './libs'),


  /*
   * resource path
   * （src 目录）
   * */
  srcPath: path.resolve(process.cwd(), 'src'),


  /*
   * node_modules path
   */
  node_modulesPath: path.resolve('./node_modules'),
}

var resolve = {
  /*
   * An array of extensions that should be used to resolve modules
   * （引用时可以忽略后缀）
   * */
  extensions: ['', '.js', '.css', '.scss', '.ejs', '.png', '.jpg'],


  /*
   * The directory (absolute path) that contains your modules
   * */
  root: [
    PATHS.node_modulesPath
  ],


  /*
   * Replace modules with other modules or paths.
   * （别名，引用时直接可以通过别名引用）
   * */
  alias: {
    /*
     * js
     */
    vue: path.join(PATHS.libsPath, "js/vue.2.0.8.js"),

    /*
     * css
     */
    commoncss: path.join(PATHS.srcPath, "css/common.css"),
    flatpickrcss: path.join(PATHS.node_modulesPath, "flatpickr/dist/flatpickr.min.css"),
  }
}

/*
 * The entry point for the bundle.
 * （入口）
 * */
var entry = {
  main: './src/js/main.js',
  login: './src/js/login.js',
  common: [
    path.join(PATHS.libsPath, "js/vue.2.0.8.js")
  ],
};

/*
 * output options tell Webpack how to write the compiled files to disk
 * （webpack 编译后输出标识）
 * */
var output = {
  /*
   *  determines the location on disk the files are written to
   *  （输出目录）
   * */
  path: path.join(__dirname, 'vrShop'),

  /*
   * The publicPath specifies the public URL address of the output files when referenced in a browser
   * （发布后，资源的引用目录）
   * */
  publicPath: PATHS.publicPath,

  /*
   * Specifies the name of each output file on disk
   * （文件名称）
   * */
  filename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js',

  /*
   * The filename of non-entry chunks as relative path inside the output.path directory.
   * （按需加载模块时输出的文件名称）
   * */
  chunkFilename: devServer ? 'js/[name].js' : 'js/[name]-[chunkhash:8].js'
}

var loaders = [

  /*
   * Exports HTML as string, require references to static resources.
   * （html loader）
   * */
  {
    test: /\.html$/,
    loader: "html"
    // loader: "html?-minimize"
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  /*
   * img loader
   * */
  {
    test: /\.mp3$/,
    loader: 'file-loader',
    query: {
      name: 'audio/[name]-[hash:8].[ext]'
    }
  },
  {
    test: /\.(png|gif|jpe?g)$/,
    loader: 'url-loader',
    query: {
      /*
       *  limit=10000 ： 10kb
       *  图片大小小于10kb 采用内联的形式，否则输出图片
       * */
      limit: 10000,
      name: '/img/[name]-[hash:8].[ext]'
    }
  },

  /*
   * video loader
   * */
  {
    test: /\.(mp4|ogv|mpeg|webm)$/,
    loader: 'file-loader',
    query: {
      name: '/video/[name]-[hash:8].[ext]'
    }
  },


  /*
   * font loader
   * */
  {
    test: /\.(eot|woff|woff2|ttf|svg)\w*/,
    loader: 'url-loader',
    query: {
      limit: 5000,
      name: '/font/[name]-[hash:8].[ext]'
    }
  },


  /*
   * Extract css files
   * （提取css到单独文件loader）
   */
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
  },
];

var plugins = [
  /*
   * gloabal flag
   * （全局标识）
   * */
  new webpack.DefinePlugin({
    /*
     * dev flag
     * （开发标识）
     * */
    __DEV__: debug,

    /*
     * proxy flag
     * （代理的标识）
     * */
    __DEVAPI__: devServer ? "/devApi/" : "''",
  }),

  /*
   * common js
   * （公共js）
   * */
  new webpack.optimize.CommonsChunkPlugin(
    devServer ?
      {name: "common", filename: "js/common.js"} : {names: ["common"]}
    // {names: ["common", "webpackAssets"]}
  ),

  /*
   *  Module (value) is loaded when the identifier (key) is used as free variable in a module
   *  （如：使用jquery 可以直接使用符号 "$"）
   * */
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    "Vue": "vue"
  }),


  /*
   * Search for equal or similar files and deduplicate them in the output
   * （删除重复依赖的文件）
   */
  new webpack.optimize.DedupePlugin(),


  /*
   * Using this config the vendor chunk should not be changing its hash unless you change its code or dependencies
   * （避免在文件不改变的情况下hash值不变化）
   * */
  new webpack.optimize.OccurenceOrderPlugin(),


  /*
   * clean publishing directory
   * （发布前清空发布目录）
   * */
  new CleanWebpackPlugin(['dist'], {
    root: '', // An absolute path for the root  of webpack.config.js
    verbose: true,// Write logs to console.
    dry: false // Do not delete anything, good for testing.
  }),

  /*
   * extract css
   * （提取css文件到单独的文件中）
   */
  new ExtractTextPlugin(devServer ? "css/[name].css" : "css/[name]-[chunkhash:8].css", {allChunks: true}),


  /*
   *create html file
   * （创建html文件）
   * */
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: __dirname + '/src/index.html',
    inject: 'true',
    chunks: ['common', 'main'],
    chunksSortMode: 'dependency'
  }),
  new HtmlWebpackPlugin({
    filename: 'login.html',
    template: __dirname + '/src/login.html',
    inject: 'true',
    // 需要依赖的模块
    chunks: ['common', 'login'],
    // 根据依赖自动排序
    chunksSortMode: 'dependency'
  }),
  new HtmlWebpackPlugin({
    filename: 'html/shop_info_verify.html',
    template: __dirname + '/src/html/shop_info_verify.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/shop_get_cash.html',
    template: __dirname + '/src/html/shop_get_cash.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/wechat_manager.html',
    template: __dirname + '/src/html/wechat_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/supervision_and_inspection.html',
    template: __dirname + '/src/html/supervision_and_inspection.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/banner_manager.html',
    template: __dirname + '/src/html/banner_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/user_manager.html',
    template: __dirname + '/src/html/user_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/user_convert.html',
    template: __dirname + '/src/html/user_convert.html',
    inject: false,
  }),
  new HtmlWebpackPlugin({
    filename: 'html/user_giftRecord.html',
    template: __dirname + '/src/html/user_giftRecord.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/product_query.html',
    template: __dirname + '/src/html/product_query.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/order_query.html',
    template: __dirname + '/src/html/order_query.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/order_apply.html',
    template: __dirname + '/src/html/order_apply.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/auth_manager.html',
    template: __dirname + '/src/html/auth_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/module_manager.html',
    template: __dirname + '/src/html/module_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/version_manager.html',
    template: __dirname + '/src/html/version_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/role_manager.html',
    template: __dirname + '/src/html/role_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/role_auth_manager.html',
    template: __dirname + '/src/html/role_auth_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/admin.html',
    template: __dirname + '/src/html/admin.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/user_count.html',
    template: __dirname + '/src/html/user_count.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/goods_cate.html',
    template: __dirname + '/src/html/goods_cate.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/live_tag.html',
    template: __dirname + '/src/html/live_tag.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/shop_cate.html',
    template: __dirname + '/src/html/shop_cate.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/shop_list.html',
    template: __dirname + '/src/html/shop_list.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/newsList.html',
    template: __dirname + '/src/html/newsList.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/good_store.html',
    template: __dirname + '/src/html/good_store.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/overrall_manager.html',
    template: __dirname + '/src/html/overrall_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/report_manager.html',
    template: __dirname + '/src/html/report_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/recommend_cate.html',
    template: __dirname + '/src/html/recommend_cate.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/agent_manager.html',
    template: __dirname + '/src/html/agent_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/vip_manager.html',
    template: __dirname + '/src/html/vip_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/stock_banner.html',
    template: __dirname + '/src/html/stock_banner.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/stock_cate.html',
    template: __dirname + '/src/html/stock_cate.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/stock_shop.html',
    template: __dirname + '/src/html/stock_shop.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/su_product_list.html',
    template: __dirname + '/src/html/su_product_list.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/su_product_cate.html',
    template: __dirname + '/src/html/su_product_cate.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/active_vote_list.html',
    template: __dirname + '/src/html/active_vote_list.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/active_add_user.html',
    template: __dirname + '/src/html/active_add_user.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/active_vote_manager.html',
    template: __dirname + '/src/html/active_vote_manager.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/active_vote_detail.html',
    template: __dirname + '/src/html/active_vote_detail.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/douyoushuo.html',
    template: __dirname + '/src/html/douyoushuo.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/newbie.html',
    template: __dirname + '/src/html/newbie.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/secondKill.html',
    template: __dirname + '/src/html/secondKill.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/nineKill.html',
    template: __dirname + '/src/html/nineKill.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/addKill.html',
    template: __dirname + '/src/html/addKill.html',
    inject: false
  }),
  new HtmlWebpackPlugin({
    filename: 'html/gold_out.html',
    template: __dirname + '/src/html/gold_out.html',
    inject: false
  })
];

if (minimize) {

  plugins.push(
    /*
     * Uglify
     * （压缩）
     * */
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
    })
  )

}

var config = {
  entry: entry,
  /*
   *  Like resolve but for loaders.
   *  （查找loader 的位置）
   * */
  resolveLoader: {root: path.join(__dirname, "node_modules")},
  output: output,
  module: {
    loaders: loaders
  },
  resolve: resolve,
  plugins: plugins,
}

if (devServer) {

  config = Merge(
    config,
    {
      plugins: [
        // Enable multi-pass compilation for enhanced performance
        // in larger projects. Good default.
        new webpack.HotModuleReplacementPlugin({
          multiStep: true
        }),
        new OpenBrowserPlugin({url: 'http://localhost:8081' + PATHS.publicPath + 'index.html'})
      ],
      devServer: {
        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,

        // Unlike the cli flag, this doesn't set
        // HotModuleReplacementPlugin!
        hot: true,
        inline: true,

        // Display only errors to reduce the amount of output.
        stats: 'errors-only',

        // Parse host and port from env to allow customization.
        //
        // If you use Vagrant or Cloud9, set
        // host: options.host || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices
        // unlike default `localhost`.
        host: "localhost", // Defaults to `localhost`   process.env.HOST
        port: "8081",  // Defaults to 8080   process.env.PORT
        /*
         *  代理访问
         *  1、可以绕过同源策略 和 webpack '热更新'结合使用
         */
        proxy: {
          '/tvmanager': {
              target: //测试数据库
                // 'http://115.239.231.163',
              // 实际数据库
              // 'http://60.190.202.217',
              //测试数据库2
                'http://60.190.202.220',
              // 'http://115.239.249.57',
              changeOrigin: true,
              // cookieDomainRewrite:"localhost:8080",
              pathRewrite: {
              '^/tvmanager': '/tvmanager'
            }
          }
        }
      }
    }
  );
}
module.exports = validate(config);