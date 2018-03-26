function initialize(param) {
    $("#footer li.active").removeClass("active");
    $("#footer li").eq(2).addClass("active");
    var spaceName = sessionStorage.getItem("spaceName");
    var headPic = sessionStorage.getItem("headPic");
    console.log(headPic);
    var myVue = new Vue({
        el: "#my",
        data: {
            "headPic": param.userPic,
            "username": param.username
        }
    });
    $("#my .comm_raw").click(function() {
        location.href="http://www.hongdoujiao.tv";
        // var ua = navigator.userAgent.toLowerCase();
        // if (/iphone|ipad|ipod/.test(ua)) {
        //     location.href="http://api.hongdoujiao.tv//tv-http/phoneHome.jsp";
        // } else if (/android/.test(ua)) {
        //     location.href="http://60.190.202.138/download/RedBeans.apk";
        // } else {
        //     location.href="http://api.hongdoujiao.tv//tv-http/phoneHome.jsp";
        // }
    });
}

module.exports = {
    init: initialize
}
