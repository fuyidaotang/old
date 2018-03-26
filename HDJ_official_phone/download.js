/**
 * Created by Administrator on 2017/6/15.
 */
// 设置rem
var docEl = document.documentElement;
docEl.style.fontSize = 100 * (docEl.clientWidth / 750) + "px";
window.onresize = function () {
  var docEl = document.documentElement;
  docEl.style.fontSize = 100 * (docEl.clientWidth / 750) + "px";
}

// 网盟推广
var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cspan id='cnzz_stat_icon_1261927514'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s95.cnzz.com/z_stat.php%3Fid%3D1261927514%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));
//声明_czc对象:
var _czc = _czc || [];

// 判断手机型号
function browser() {
  var u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    return 'android'
  } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    return 'ios'
  }
}

// 添加或删除class
function addClass(obj, cls) {
  var bool = obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  if (!bool) {
    obj.className += ' ' + cls
  }
}
function removeClass(obj, cls) {
  var bool = obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
  if (bool) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
}
var phone = browser()
var android = document.querySelectorAll('.android')
var ios = document.querySelectorAll('.ios')
if (phone === 'android') {
  for (var i = 0, len = android.length; i < len; i++) {
    removeClass(android[i], 'hide')
  }
  for (var j = 0, len2 = ios.length; j < len2; j++) {
    addClass(ios[j], 'hide')
  }
} else {
  for (var k = 0, len3 = android.length; k < len3; k++) {
    addClass(android[k], 'hide')
  }
  for (var a = 0, len4 = ios.length; a < len4; a++) {
    removeClass(ios[a], 'hide')
  }
}

// 为按钮添加点击事件
var button = document.querySelectorAll('.button')
var WeChat = navigator.userAgent.toLowerCase()
// 安卓
if (phone === 'android') {
  if (WeChat.match(/MicroMessenger/i) + '' === "micromessenger") {
    removeClass(document.querySelector('.mask'), 'hide')
  } else {
    document.querySelector('.button.android').addEventListener('click', function () {
      if (sessionStorage.getItem('message')) {
        _czc.push(['_trackEvent', '短信', 'android下载', '本地下载按钮']);
      } else {
        _czc.push(['_trackEvent', 'android下载', '本地下载按钮']);
      }
      location.href = 'http://www.hongdoujiao.tv/download/hdj.apk'
    })
    document.querySelector('.button.button2.android').addEventListener('click', function () {
      if (sessionStorage.getItem('message')) {
        _czc.push(['_trackEvent', '短信', 'android下载', '应用市场下载按钮']);
      } else {
        _czc.push(['_trackEvent', 'android下载', '应用市场下载按钮']);
      }
      location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.vct.redbean#opened'
    })
  }
} else if (phone === 'ios') {
  document.querySelector('.button.button3.ios').addEventListener('click', function () {
    if (sessionStorage.getItem('message')) {
      _czc.push(['_trackEvent', '短信', 'ios下载']);
    } else {
      _czc.push(['_trackEvent', 'ios下载','ios']);
    }
    location.href = 'https://itunes.apple.com/cn/app/id1129324529'
  })
}