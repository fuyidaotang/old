require('./css/common.css');
// 兼容IE9
require('es6-promise').polyfill();

import VueRouter from 'vue-router';
import routes from './router.js';
import Vuex from 'vuex';
Vue.use(VueRouter);
Vue.use(Vuex);
//*****************vuxe***********************************
const store = new Vuex.Store({
    state: {
        //小吐司
        isShowToast: false,
        toastText: "",
        //大图
        isShowPic: false,
        picUrl: "",
        //警告框
        isShowAlert: false,
        //当前路由
        currentRoute: "",
        isLoading: false
    },
    mutations: {
        setToast: function(state, toastText) {
            state.toastText = toastText;
            if (toastText) {
                state.isShowToast = true;
            } else {
                state.isShowToast = false;
            }
        },
        setIsLoading: function(state, bool) {
            state.isLoading = bool;
        },
        setAlert: function(state, isShow) {
            state.isShowAlert = isShow;
        },
        setCurrentRoute: function(state, currentRoute) {
            state.currentRoute = currentRoute;
        },
        setPicContainer: function(state, picUrl) {
            state.picUrl = picUrl;
            if (picUrl) {
                state.isShowPic = true;
            } else {
                state.isShowPic = false;
            }
        }
    }
});
//*****************vuxe************************************
//*****************全局组件******************************
import Datepicker from 'vuejs-datepicker';
import showBigImage from './components/comm/showBigImage.vue';
import toast from './components/comm/toast.vue';
import pagination from './components/comm/pagination.vue';
import myAlert from "./components/comm/myAlert.vue";
import loading from './components/comm/loading.vue';
Vue.component("toast", toast);
Vue.component("myAlert", myAlert);
Vue.component("showBigImage", showBigImage);
Vue.component("Datepicker", Datepicker);
Vue.component("pagination", pagination);
Vue.component("loading", loading);
//*****************全局组件******************************
//*****************过滤器*********************************
Vue.filter('transDate', function(tm) {
    if (tm < 10000000000) {
        tm = tm * 1000;
    }
    var tt = new Date(parseInt(tm));
    return tt.getFullYear() + "-" + (tt.getMonth() + 1) + "-" + tt.getDate() + " " + tt.getHours() + ":" + tt.getMinutes() + ":" + tt.getSeconds();
});
Vue.filter('iconPic', function(oldUrl) {
    if (oldUrl) {
        return oldUrl.replace("thum", "icon");
    }
    return "";
});
Vue.filter('enlargePic', function(oldUrl) {
    if (oldUrl) {
        return oldUrl.replace("icon", "thum");
    }
    return "";
});
Vue.filter('transStatus', function(oldVal) {
    if (oldVal === 0) {
        return "用户不可见";
    } else if (oldVal === 1) {
        return "用户可见";
    } else {
        return "请选择";
    }
});
Vue.filter('transGoodsStatus', function(oldVal) {
    if (oldVal === 0) {
        return "未发布";
    } else if (oldVal === 1) {
        return "已上架";
    } else if (oldVal === 2) {
        return "已下架";
    } else {
        return "请选择";
    }
});
Vue.filter('getTitle', function(oldVal) {
    switch (oldVal) {
        case "0":
            return "未发布";
        case "1":
            return "已上架";
        case "2":
            return "已下架";
        case "":
            return "全部";
        default:
            return "未知错误"
    }
});
Vue.filter('getOrderTitle', function(status) {
    switch (status) {
        case "10":
            return "待付款";
        case "20":
            return "待发货";
        case "30":
            return "已发货";
        case "40":
            return "待评价";
        case "50":
            return "已完成";
        case "100":
            return "退款申请";
        case "0":
            return "已关闭";
        default:
            return "未知错误"
    }
});
//*****************过滤器*********************************
//*****************全局方法******************************
Vue.prototype.BASE_URI = "/hdjmanager";
Vue.prototype.$isFactory = sessionStorage.getItem('permission') === '1'
Vue.prototype.$dealRes = function(code, msg) {
    if (msg) {
        this.$store.commit("setToast", msg);
    } else {
        this.$store.commit("setToast", "请求错误,没有描述信息");
    }
    if (code === 20002 || code === 20004) {
        setTimeout(function() {
            location.href = "/hdjmanager/login.html";
        }, 1000);
    }
};
//*****************全局方法******************************
//*****************路由***********************************
const router = new VueRouter({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            let target = document.querySelector(to.hash);
            $(".comm_view").animate({
                scrollTop: target.offsetTop
            }, 500)
        }
    },
    base: "/hdjmanager",
    routes // （缩写）相当于 routes: routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        var bool = sessionStorage.getItem("isLogin") === "1";
        if (!bool) {
            location.href="/hdjmanager/login.html";
        } else {
            next();
        }
    } else {
        next();
    }
});
//*****************路由******************************
//************************axios拦截器******************************
axios.defaults.baseURL = 'http://api.vrshop.hongdoujiao.com:8721';
// axios.defaults.baseURL = 'http://115.239.231.163';
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function(config) {
    store.commit("setCurrentRoute", router.currentRoute.path);
    return config;
}, function(error) {
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    if (router.currentRoute.path == store.state.currentRoute || store.state.currentRoute == '/') {
        return response;
    } else {
        return;
    }
}, function(error) {
    return Promise.reject(error);
});
//************************axios拦截器******************************
var App = Vue.extend(require('./index.vue'));
new App({
    router,
    store
}).$mount('#app');

//如果浏览器不支持,自定义localStorage
if (!window.localStorage) {
    Object.defineProperty(window, "localStorage", new(function() {
        var aKeys = [],
            oStorage = {};
        Object.defineProperty(oStorage, "getItem", {
            value: function(sKey) {
                return sKey ? this[sKey] : null;
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "key", {
            value: function(nKeyId) {
                return aKeys[nKeyId];
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "setItem", {
            value: function(sKey, sValue) {
                if (!sKey) {
                    return;
                }
                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "length", {
            get: function() {
                return aKeys.length;
            },
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(oStorage, "removeItem", {
            value: function(sKey) {
                if (!sKey) {
                    return;
                }
                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        this.get = function() {
            var iThisIndx;
            for (var sKey in oStorage) {
                iThisIndx = aKeys.indexOf(sKey);
                if (iThisIndx === -1) {
                    oStorage.setItem(sKey, oStorage[sKey]);
                } else {
                    aKeys.splice(iThisIndx, 1);
                }
                delete oStorage[sKey];
            }
            for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
                oStorage.removeItem(aKeys[0]);
            }
            for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                aCouple = aCouples[nIdx].split(/\s*=\s*/);
                if (aCouple.length > 1) {
                    oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                    aKeys.push(iKey);
                }
            }
            return oStorage;
        };
        this.configurable = false;
        this.enumerable = true;
    })());
}
