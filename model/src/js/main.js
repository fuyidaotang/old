require('commoncss');
require('flatpickrcss');
var flatpickr = require("flatpickr");
require('../css/video.css');
var Chinese = require("flatpickr/dist/l10n/zh.js").zh;
var global = require('./global.js')
global()

var pageDatas = {
  defaultRoute: "user_count"
};
//入口
$(function () {
  loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
  //console.log('loginInfo');
  var menuInfo = loginInfo.resp.menuInfo;
  var menuListOne = [];
  var menuListTwo = [];
  //将二级菜单放入一级菜单中
  menuInit(menuListOne, menuListTwo, menuInfo);
  new Vue({
    el: "#mainInfo",
    data: {
      username: loginInfo.resp.userInfo.userName,
      menuList: menuListOne,
      outBox:false
    },
    methods:{
      showOut(){
        this.outBox=true;
      },
      loginOut(){
        $.ajax({
          type:"post",
          url:"/tvmanager/login/logout",
          success:function(data){
            if(data.code==20000){
              sessionStorage.removeItem('loginInfo')
              location.href='login.html'
            }else{
              alert(data.msg)
            }
          }
        });
      }
    }
  });
  addEvent();
  window.onhashchange = function () {
    var modName = getModeName();
    modName = modName || pageDatas.defaultRoute;
    loadHtml(modName);
  }
  //此处编辑
  var modName = getModeName();
  modName = modName || pageDatas.defaultRoute;
  loadHtml(modName);

  //设置nav的active
  initNavActive(modName);
});

function menuInit(menuListOne, menuListTwo, menuInfo) {
  console.log(menuInfo)
  for (var i = 0; i < menuInfo.length; i++) {
    var menuItem = {};
    if (menuInfo[i].parentId == 0) {
      menuItem.menuId = menuInfo[i].menuId;
      menuItem.menuName = menuInfo[i].menuName;
      menuItem.menuIcon = menuInfo[i].menuIcon;
      menuItem.children = [];
      menuListOne.push(menuItem);
    } else {
      menuItem.parentId = menuInfo[i].parentId;
      menuItem.menuName = menuInfo[i].menuName;
      menuItem.menuOrder = menuInfo[i].menuOrder;
      menuItem.menuUrl = menuInfo[i].menuUrl;
      menuListTwo.push(menuItem);
    }
  }
  for (var i = 0; i < menuListTwo.length; i++) {
    for (var j = 0; j < menuListOne.length; j++) {
      if (menuListOne[j].menuId == menuListTwo[i].parentId) {
        menuListOne[j].children.push(menuListTwo[i]);
      }
    }
  }
  console.log(menuListOne)
  for (var i = 0; i < menuListOne.length; i++) {
    menuListOne[i].children.sort(compare("menuOrder"));
  }
}

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}
//主页面导入
function loadHtml(modName) {
  var htmlPath = './html/' + modName + '.html';
  $.get(htmlPath, [], function (html) {
    $("#container").html(html);
    loadJs(modName);
  });
  if ($(".flatpickr-calendar")) {
    $(".flatpickr-calendar").remove();
  }
}

function loadJs(modName) {
  /// <summary>
  /// load js mod
  /// </summary>
  /// <param name="jsPath" type="type">js path</param>

  var jsPath = './' + modName;
  switch (jsPath) {
    case "./shop_info_verify": {
      require.ensure([], function (require) {
        currentMod = require('./shop_info_verify');
        currentMod.init();
        loadJsCallback()
      }, 'shop_info_verify');
      break;
    }
    case "./shop_get_cash": {
      require.ensure([], function (require) {
        currentMod = require('./shop_get_cash');
        currentMod.init();
        loadJsCallback()
      }, 'shop_get_cash');
      break;
    }
    case "./wechat_manager": {
      require.ensure([], function (require) {
        currentMod = require('./wechat_manager');
        currentMod.init();
        loadJsCallback()
      }, 'wechat_manager');
      break;
    }
    case "./supervision_and_inspection": {
      require.ensure([], function (require) {
        currentMod = require('./supervision_and_inspection');
        currentMod.init();
        loadJsCallback()
      }, 'supervision_and_inspection');
      break;
    }
    case "./banner_manager": {
      require.ensure([], function (require) {
        currentMod = require('./banner_manager');
        currentMod.init();
        loadJsCallback()
      }, 'banner_manager');
      break;
    }
    case "./user_manager": {
      require.ensure([], function (require) {
        currentMod = require('./user_manager');
        currentMod.init();
        loadJsCallback()
      }, 'user_manager');
      break;
    }
    case "./user_convert": {
      require.ensure([], function (require) {
        currentMod = require('./user_convert');
        currentMod.init();
        loadJsCallback()
      }, 'user_convert');
      break;
    }
    case "./user_giftRecord": {
      require.ensure([], function (require) {
        currentMod = require('./user_giftRecord');
        currentMod.init();
        loadJsCallback()
      }, 'user_giftRecord');
      break;
    }
    case "./product_query": {
      require.ensure([], function (require) {
        currentMod = require('./product_query');
        currentMod.init();
        loadJsCallback()
      }, 'product_query');
      break;
    }
    case "./order_query": {
      require.ensure([], function (require) {
        currentMod = require('./order_query');
        currentMod.init();
        loadJsCallback()
      }, 'order_query');
      break;
    }
    case "./order_apply": {
      require.ensure([], function (require) {
        currentMod = require('./order_apply');
        currentMod.init();
        loadJsCallback()
      }, 'order_apply');
      break;
    }
    case "./module_manager": {
      require.ensure([], function (require) {
        currentMod = require('./module_manager');
        currentMod.init();
        loadJsCallback()
      }, 'module_manager');
      break;
    }
    case "./auth_manager": {
      require.ensure([], function (require) {
        currentMod = require('./auth_manager');
        currentMod.init();
        loadJsCallback()
      }, 'auth_manager');
      break;
    }
    case "./version_manager": {
      require.ensure([], function (require) {
        currentMod = require('./version_manager');
        currentMod.init();
        loadJsCallback()
      }, 'version_manager');
      break;
    }
    case "./role_manager": {
      require.ensure([], function (require) {
        currentMod = require('./role_manager');
        currentMod.init();
        loadJsCallback()
      }, 'role_manager');
      break;
    }
    case "./role_auth_manager": {
      require.ensure([], function (require) {
        currentMod = require('./role_auth_manager');
        currentMod.init();
        loadJsCallback()
      }, 'role_auth_manager');
      break;
    }
    case "./admin": {
      require.ensure([], function (require) {
        currentMod = require('./admin');
        currentMod.init();
        loadJsCallback()
      }, 'admin');
      break;
    }
    case "./user_count": {
      require.ensure([], function (require) {
        currentMod = require('./user_count');
        currentMod.init();
        loadJsCallback()
      }, 'user_count');
      break;
    }
    case "./goods_cate": {
      require.ensure([], function (require) {
        currentMod = require('./goods_cate');
        currentMod.init();
        loadJsCallback()
      }, 'goods_cate');
      break;
    }
    case "./live_tag": {
      require.ensure([], function (require) {
        currentMod = require('./live_tag');
        currentMod.init();
        loadJsCallback()
      }, 'live_tag');
      break;
    }
    case "./shop_cate": {
      require.ensure([], function (require) {
        currentMod = require('./shop_cate');
        currentMod.init();
        loadJsCallback()
      }, 'shop_cate');
      break;
    }
    case "./shop_list": {
      require.ensure([], function (require) {
        currentMod = require('./shop_list');
        currentMod.init();
        loadJsCallback()
      }, 'shop_list');
      break;
    }
    case "./newsList": {
      require.ensure([], function (require) {
        currentMod = require('./newsList');
        currentMod.init();
        loadJsCallback()
      }, 'newsList');
      break;
    }
    case "./good_store": {
      require.ensure([], function (require) {
        currentMod = require('./good_store');
        currentMod.init();
        loadJsCallback()
      }, 'good_store');
      break;
    }
    case "./overrall_manager": {
      require.ensure([], function (require) {
        currentMod = require('./overrall_manager');
        currentMod.init();
        loadJsCallback()
      }, 'overrall_manager');
      break;
    }
    case "./report_manager": {
      require.ensure([], function (require) {
        currentMod = require('./report_manager');
        currentMod.init();
        loadJsCallback()
      }, 'report_manager');
      break;
    }
    case "./recommend_cate": {
      require.ensure([], function (require) {
        currentMod = require('./recommend_cate');
        currentMod.init();
        loadJsCallback()
      }, 'recommend_cate');
      break;
    }
    case "./agent_manager": {
      require.ensure([], function (require) {
        currentMod = require('./agent_manager');
        currentMod.init();
        loadJsCallback()
      }, 'agent_manager');
      break;
    }
    case "./vip_manager": {
      require.ensure([], function (require) {
        currentMod = require('./vip_manager');
        currentMod.init();
        loadJsCallback()
      }, 'vip_manager');
      break;
    }
    case "./stock_banner": {
      require.ensure([], function (require) {
        currentMod = require('./stock_banner');
        currentMod.init();
        loadJsCallback()
      }, 'stock_banner');
      break;
    }
    case "./stock_shop": {
      require.ensure([], function (require) {
        currentMod = require('./stock_shop');
        currentMod.init();
        loadJsCallback()
      }, 'stock_shop');
      break;
    }
    case "./stock_cate": {
      require.ensure([], function (require) {
        currentMod = require('./stock_cate');
        currentMod.init();
        loadJsCallback()
      }, 'stock_cate');
      break;
    }
    case "./su_product_list": {
      require.ensure([], function (require) {
        currentMod = require('./su_product_list');
        currentMod.init();
        loadJsCallback()
      }, 'su_product_list');
      break;
    }
    case "./su_product_cate": {
      require.ensure([], function (require) {
        currentMod = require('./su_product_cate');
        currentMod.init();
        loadJsCallback()
      }, 'su_product_cate');
      break;
    }
    case "./active_vote_list": {
      require.ensure([], function (require) {
        currentMod = require('./active_vote_list');
        currentMod.init();
        loadJsCallback()
      }, 'active_vote_list');
      break;
    }
    case "./active_add_user": {
      require.ensure([], function (require) {
        currentMod = require('./active_add_user');
        currentMod.init();
        loadJsCallback()
      }, 'active_add_user');
      break;
    }
    case "./active_vote_manager": {
      require.ensure([], function (require) {
        currentMod = require('./active_vote_manager');
        currentMod.init();
        loadJsCallback()
      }, 'active_vote_manager');
      break;
    }
    case "./active_vote_detail": {
      require.ensure([], function (require) {
        currentMod = require('./active_vote_detail');
        currentMod.init();
        loadJsCallback()
      }, 'active_vote_detail');
      break;
    }
    case "./douyoushuo": {
      require.ensure([], function (require) {
        currentMod = require('./douyoushuo');
        currentMod.init();
        loadJsCallback()
      }, 'douyoushuo');
      break;
    }
    case "./newbie": {
      require.ensure([], function (require) {
        currentMod = require('./newbie');
        currentMod.init();
        loadJsCallback()
      }, 'newbie');
      break;
    }
    case "./secondKill": {
      require.ensure([], function (require) {
        currentMod = require('./secondKill');
        currentMod.init();
        loadJsCallback()
      }, 'secondKill');
      break;
    }
    case "./nineKill": {
      require.ensure([], function (require) {
        currentMod = require('./nineKill');
        currentMod.init();
        loadJsCallback()
      }, 'nineKill');
      break;
    }
    case "./addKill": {
      require.ensure([], function (require) {
        currentMod = require('./addKill');
        currentMod.init();
        loadJsCallback()
      }, 'addKill');
      break;
    }
    case "./gold_out": {
      require.ensure([], function (require) {
        currentMod = require('./gold_out');
        currentMod.init();
        loadJsCallback()
      }, 'addKill');
      break;
    }
  }
}

function loadJsCallback(){
  Vue.nextTick(function () {
    if($(".flatpickr").length > 0){
      $(".flatpickr").flatpickr({
        enableTime: true,
        locale: Chinese
      });
    }
    if($(".pic_container") && !$(".pic_container").hasClass("hidden")){
      $(".pic_container").addClass("hidden");
    }
  })
}
//通用方法
//获取模块名
function getModeName() {
  var modName = window.location.href.split('#')[1];
  return modName;
}

//主页面事件
function addEvent() {
  $(".main_nav_content").click(function () {
    $("li.active").not($(this).parent()).removeClass("active");
    $(".second_nav_content").not($(this).siblings(".second_nav_content")).slideUp(200);
    $(this).parent().toggleClass("active");
    $(this).siblings(".second_nav_content").slideToggle(200);
  });
  $(".pic_container").click(function () {
    $(this).addClass("hidden");
  });
  $("section.comm_nav_item").click(function () {
    $(".comm_nav_item.active").removeClass("active");
    $(this).addClass("active");
    var jump = $(this).attr("jump");
    var modName = getModeName();
    if (modName == jump) {
      return;
    } else {
      $(".pic_container").removeClass("hidden");
    }
    if (jump) {
      switch (jump) {
        case "user_manager":
          location.href = "#user_manager";
          break;
        case "user_convert":
          location.href = "#user_convert";
          break;
        case "user_giftRecord":
          location.href = "#user_giftRecord";
          break;
        case "shop_info_verify":
          location.href = "#shop_info_verify";
          break;
        case "shop_get_cash":
          location.href = "#shop_get_cash";
          break;
        case "wechat_manager":
          location.href = "#wechat_manager";
          break;
        case "supervision_and_inspection":
          location.href = "#supervision_and_inspection";
          break;
        case "banner_manager":
          location.href = "#banner_manager";
          break;
        case "product_query":
          location.href = "#product_query";
          break;
        case "order_query":
          location.href = "#order_query";
          break;
        case "order_apply":
          location.href = "#order_apply";
          break;
        case "auth_manager":
          location.href = "#auth_manager";
          break;
        case "module_manager":
          location.href = "#module_manager";
          break;
        case "version_manager":
          location.href = "#version_manager";
          break;
        case "role_manager":
          location.href = "#role_manager";
          break;
        case "role_auth_manager":
          location.href = "#role_auth_manager";
          break;
        case "admin":
          location.href = "#admin";
          break;
        case "user_count":
          location.href = "#user_count";
          break;
        case "goods_cate":
          location.href = "#goods_cate";
          break;
        case "live_tag":
          location.href = "#live_tag";
          break;
        case "shop_cate":
          location.href = "#shop_cate";
          break;
        case "shop_list":
          location.href = "#shop_list";
          break;
        case "newsList":
          location.href = "#newsList";
          break;
        case "good_store":
          location.href = "#good_store";
          break;
        case "report_manager":
          location.href = "#report_manager";
          break;
        case "overrall_manager":
          location.href = "#overrall_manager";
          break;
        case "recommend_cate":
          location.href = "#recommend_cate";
          break;
        case "agent_manager":
          location.href = "#agent_manager";
          break;
        case "vip_manager":
          location.href = "#vip_manager";
          break;
        case "stock_banner":
          location.href = "#stock_banner";
          break;
        case "stock_cate":
          location.href = "#stock_cate";
          break;
        case "stock_shop":
          location.href = "#stock_shop";
          break;
        case "su_product_list":
          location.href = "#su_product_list";
          break;
        case "su_product_cate":
          location.href = "#su_product_cate";
          break;
        case "active_vote_list":
          location.href = "#active_vote_list";
          break;
        case "active_add_user":
          location.href = "#active_add_user";
          break;
        case "active_vote_manager":
          location.href = "#active_vote_manager";
          break;
        case "douyoushuo":
          location.href = "#douyoushuo";
          break;
        case "newbie":
          location.href = "#newbie";
          break;
        case "secondKill":
          location.href = "#secondKill";
          break;
        case "nineKill":
          location.href = "#nineKill";
          break;
        case "addKill":
          location.href = "#addKill";
          break;
        case "gold_out":
          location.href = "#gold_out";
          break;
        default:
          return;
      }
    } else {
      return;
    }
  });
}

function initNavActive(modName) {
  $('.comm_nav_item[jump|="' + modName + '"]').parents("li").addClass("active");
  $('.comm_nav_item[jump|="' + modName + '"]').parent().show();
  $('.comm_nav_item[jump|="' + modName + '"]').addClass("active");
}
