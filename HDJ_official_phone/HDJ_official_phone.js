// 设置rem
var docEl = document.documentElement;
docEl.style.fontSize = 100 * (docEl.clientWidth / 750) + "px";
window.onresize = function () {
  var docEl = document.documentElement;
  docEl.style.fontSize = 100 * (docEl.clientWidth / 750) + "px";
}

// 弹框
window.onload = function () {
  function toggleClass(obj, cls) {
    var bool = obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    if (!bool) {
      obj.className += ' ' + cls
    } else {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, ' ');
    }
  }

  function browser() {
    var u = navigator.userAgent
    if (u.toLowerCase().match(/MicroMessenger/i) + '' === "micromessenger") {
      return 'WeChat'
    } else if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
      return 'android'
    } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      return 'ios'
    }
  }

  var phone = browser()
  var n = 1
  window.onscroll = function () {
    var max = 400 * (docEl.clientWidth / 750)
    if (document.body.scrollTop > max && n === 1) {
      n = undefined
      toggleClass(document.querySelector('.alert'), 'hide')
      toggleClass(document.querySelector('.experience'), 'hide')
      toggleClass(document.querySelector('.consult'), 'hide')
    }
  };
  document.querySelector('.close').addEventListener('click', function () {
    toggleClass(document.querySelector('.alert'), 'hide')
    toggleClass(document.querySelector('.experience'), 'hide')
    toggleClass(document.querySelector('.consult'), 'hide')
  })
  document.querySelector('.experience').addEventListener('click', function () {
    location.href = '/download.html'
  })
  document.querySelector('.consult').addEventListener('click', function () {
    if (phone === 'android' || phone === 'WeChat') {
      location.href = 'http://wpa.qq.com/msgrd?v=3&uin=3052562584&site=qq&menu=yes'
    } else if (phone === 'ios') {
      location.href = 'mqqwpa://im/chat?chat_type=wpa&uin=3052562584&version=1&src_type=web&web_src=oicqzone.com'
    }
  })
  document.querySelector('.button_open').addEventListener('click', function () {
    if (sessionStorage.getItem('message')) {
      _czc.push(['_trackEvent', '短信', '开店', '跳转', '移动端首页开店按钮']);
    } else {
      _czc.push(['_trackEvent', '开店', '跳转', '移动端首页开店按钮']);
    }
  })
}