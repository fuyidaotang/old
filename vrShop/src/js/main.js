require('commoncss');
require("../css/swiper-3.4.0.min.css");
require("../css/iosSelect.css");
require('./app.js');
var pageDatas = {
    defaultRoute:"index"
};

//入口
$(function() {
     if(!sessionStorage.getItem('liveParam')){
       var spaceNum = GetRequest()['spaceNum']
       var redirectUri = location.href
       sessionStorage.setItem('redirectUri', redirectUri)
       location.href = "http://wap.hongdoujiao.tv/wap/s/homeIndex.do?s="+spaceNum
     }
    pageDatas.param = JSON.parse(sessionStorage.getItem("liveParam"));
    addEvent();
    window.onhashchange = function() {
        var modName = getModeName();
        modName = modName || pageDatas.defaultRoute;
        loadHtml(modName);
    }

    var modName = getModeName();
    modName = modName || pageDatas.defaultRoute;
    loadHtml(modName);
});

//主页面导入
function loadHtml(modName) {
    var htmlPath = './html/'+modName+'.html';
    var jsPath = './'+modName;
    $.get(htmlPath, [], function (html) {
        $("#container").html(html);
        loadJs(jsPath);
    });
}
function loadJs(jsPath) {
    /// <summary>
    /// load js mod
    /// </summary>
    /// <param name="jsPath" type="type">js path</param>

    var currentMod;
    pageDatas.param.modName = currentMod;
    if (jsPath === './index') {
        require.ensure([], function (require) {
            currentMod = require('./index');
            currentMod.init(pageDatas.param);
        }, 'index');
    }
    if (jsPath === './detail') {
        require.ensure([], function (require) {
            currentMod = require('./detail');
            currentMod.init(pageDatas.param);
        }, 'detail');
    }
    if (jsPath === './confirmOrder') {
        require.ensure([], function (require) {
            currentMod = require('./confirmOrder');
            currentMod.init(pageDatas.param);
        }, 'confirmOrder');
    }
    if (jsPath === './choosePayType') {
        require.ensure([], function (require) {
            currentMod = require('./choosePayType');
            currentMod.init(pageDatas.param);
        }, 'choosePayType');
    }
    if (jsPath === './my') {
        require.ensure([], function (require) {
            currentMod = require('./my');
            currentMod.init(pageDatas.param);
        }, 'my');
    }
    if (jsPath === './chooseAddress') {
        require.ensure([], function (require) {
            currentMod = require('./chooseAddress');
            currentMod.init(pageDatas.param);
        }, 'chooseAddress');
    }
    if (jsPath === './shareCode') {
        require.ensure([], function (require) {
            currentMod = require('./shareCode');
            currentMod.init(pageDatas.param);
        }, 'shareCode');
    }
    if (jsPath === './addAddress') {
        require.ensure([], function (require) {
            currentMod = require('./addAddress');
            currentMod.init(pageDatas.param);
        }, 'addAddress');
    }
}
//通用方法
//获取模块名
function getModeName() {
    var modName = window.location.href.split('#')[1];
    return modName;
}

function GetRequest() {
  var params = location.href.split('?')[1]; //获取url中"?"符后的字串
  let obj = {}
  strs = params.split("#")[0];
  strs = strs.split("&");
  for(var i = 0; i < strs.length; i ++) {
    obj[strs[i].split("=")[0]] = strs[i].split("=")[1];
  }
  return obj;
}

function addEvent(){
    $("#footer li").click(function(){
        $("#footer li.active").removeClass("active");
        $(this).addClass("active");
        switch($(this).index()){
            case 0:location.href="http://wap.hongdoujiao.tv/wap/s/homeIndex.do?s="+pageDatas.param.spaceNum;break;
            case 1:location.href="#index";break;
            case 2:location.href="#my";break;
        }
    });
}
