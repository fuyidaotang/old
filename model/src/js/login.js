require('commoncss');
var md5 = require('../../libs/js/md5-js.js');
$(function () {
    if (localStorage.getItem('username')) {
        $(".username").val(localStorage.getItem('username'))
    }
    if (localStorage.getItem('password')) {
        $(".password").val(localStorage.getItem('password'))
    }
    $(".remember").click(function () {
        $(this).children("img").toggleClass("hidden");
    });
    $(".login_button").click(function () {
        var para = {};
        if ($.trim($(".username").val()) == "") {
            $(".error_area").html("请输入用户名");
            return;
        }
        if ($.trim($(".password").val()) == "") {
            $(".error_area").html("请输入密码");
            return;
        }
        para.loginId = $.trim($(".username").val());
        para.loginPass = md5($.trim($(".password").val()));
        para.key = md5($.trim($(".password").val()) + para.loginId);
        $.ajax({
            type: "get",
            data: para,
            url: "/tvmanager/login/login",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                var json = JSON.parse(data);
                console.log(json)
                if (json.code == 20000) {
                    sessionStorage.setItem("loginInfo", data);
                    localStorage.setItem('username', $.trim($(".username").val()))
                    localStorage.setItem('password', $.trim($(".password").val()))
                    location.href = "index.html";
                } else {
                    $(".error_area").html(json.msg);
                }
            }
        });
    });
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            $(".login_button").trigger("click");
        }
    });
});