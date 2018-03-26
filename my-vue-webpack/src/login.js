require('./css/common.css');
require('es6-promise').polyfill();
var md5 = require("md5");
var username = getCookie("username")
var password = getCookie("password");
var loginVue = new Vue({
  data: {
    isChecked: true,
    isUpdate: false,
    loginId: getCookie("username"),
    loginPass: getCookie("password"),
    checkNum: "",
    mistakeInfo: ""
  },
  methods: {
    login: function () {
      let para = {
        phoneno: this.loginId,
        loginPass: md5("6849794470754667710" + this.loginPass),
        key: md5(md5("6849794470754667710" + this.loginPass) + this.loginId),
        checkNum: this.checkNum
      };
      let self = this;
      axios({
        method: "get",
        url: "http://api.vrshop.hongdoujiao.com:8721/tvshop/login/loginPhone",
        // url: "http://115.239.231.163/tvshop/login/loginPhone",
        params: para,
        withCredentials: true
      }).then(function (res) {
        if (res.data.code === 20000) {
          console.log(res)
          if (res.data.msg === '6' || res.data.msg === '7') {
            sessionStorage.setItem("permission", "1");
          } else {
            sessionStorage.setItem("permission", "0");
          }
          sessionStorage.setItem("isLogin", "1");
          if (self.isChecked) {
            setCookie("username", self.loginId);
            setCookie("password", self.loginPass);
          } else {
            delCookie("username");
            delCookie("password");
          }
          self.mistakeInfo = "";
          location.href = "/hdjmanager/chooseCate/1";
        } else {
          self.mistakeInfo = res.data.msg;
          self.checkNum = '';
          if (res.data.code === 20003) {
            self.loginPass = '';
          }
          self.isUpdate = true;
        }
      }).catch(function (error) {
        console.log(error);
      });
    },
    reload: function (e) {
      e.target.src = "http://api.vrshop.hongdoujiao.com:8721/tvshop/login/verification?width=60&height=30&wordNum=4&fontSize=16&id=" + Math.random() * 1000000;
      // e.target.src = "http://115.239.231.163/tvshop/login/verification?width=60&height=30&wordNum=4&fontSize=16&id=" + Math.random() * 1000000;
    }
  },
  directives: {
    reload: function (el, binding) {
      if (!binding.value) {
        return;
      }
      el.src = "http://api.vrshop.hongdoujiao.com:8721/tvshop/login/verification?width=60&height=30&wordNum=4&fontSize=16&id=" + Math.random() * 1000000;
      // el.src = "http://115.239.231.163/tvshop/login/verification?width=60&height=30&wordNum=4&fontSize=16&id=" + Math.random() * 1000000;
      loginVue.isUpdate = false;
    }
  },
  el: ".loginMain"
})
if (GetQueryString("clear") == 1) {
  loginVue.isChecked = false;
  loginVue.loginId = "";
  loginVue.loginPass = "";
  delCookie("username");
  delCookie("password");
}

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)return unescape(r[2]);
  return null;
}

function setCookie(name, value) {
  var Days = 1;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
