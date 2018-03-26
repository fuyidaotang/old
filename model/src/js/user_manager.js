var initPagination;
var userManagerVue;
function initialize() {
    userManagerVue = new Vue({
        el: ".user_manager",
        data: {
            userList: [],
            currentPage: 1,
            pageSize: 6,
            countNum: 0,
            pageArray: [],
            detailContent:{}
        },
        computed: {
            pagesCount: function() {
                return Math.ceil(this.countNum / this.pageSize);
            },
            shopIndex: function() {
                return this.pageSize * (this.currentPage - 1) + 1;
            }
        },
        methods: {
            jumpPage: function(pageItem) {
                var data = {};
                data.userName = $("#userName").val();
                data.phoneNo = $("#phoneNo").val();
                data.loginType = $("#loginType").val();
                data.Status = $("#Status").val();
                if(Date.parse($("#beginTime").val())){
                    data.beginTime = Date.parse($("#beginTime").val());
                }
                if(Date.parse($("#endTime").val())){
                    data.endTime = Date.parse($("#endTime").val());
                }
                jumpPage(userManagerVue, pageItem,data);
            },
            showDetailDialog:function(userItem){
                sessionStorage.setItem("id",userItem.userId);
                userManagerVue.detailContent = userItem;
                $("#detail_dialog").show();
            },
            showPassDialog:function(userItem){
                sessionStorage.setItem("id",userItem.userId);
                $("#pass_dialog").show();
            }
        }
    });
    initPagination = require("./pagination.js");
    getDefaultPage();
    addEvent();
}

function getDefaultPage() {
    //默认一页6条数据,显示第一页
    var pageItem = {
        count: 1,
        isActive: true,
        isHidden: false
    };
    jumpPage(userManagerVue, pageItem);
}

function addEvent() {
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(userManagerVue, pageItem);
    });
    $(".b_close").click(function() {
        $(this).parents(".dialog_container").hide();
    });
    $("#shop_verify_search").click(function() {
        var data = {};
        data.userName = $("#userName").val();
        data.phoneNo = $("#phoneNo").val();
        data.loginType = $("#loginType").val();
        data.Status = $("#Status").val();
        if(Date.parse($("#beginTime").val())){
            data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
            data.endTime = Date.parse($("#endTime").val());
        }
        var pageItem = {
            count: userManagerVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(userManagerVue, pageItem,data);
    });
    $("#detail_dialog .agree").click(function(){
        $("#detail_dialog").hide();
        $("#pass_dialog").show();
    });
    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.userId = sessionStorage.getItem("id");
        para.status = $("#pass_dialog input:checked").val();
        changeState(para);
    });
}

function changeState(para){
    $.ajax({
        type:"post",
        data:para,
        url:"/tvmanager/user/userUpdateStatus",
        success:function(data){
            data = JSON.parse(data);
            if(data.code == 20000){
                alert(data.msg);
                $(".dialog_container").hide();
                $("#shop_verify_search").trigger("click");
            }else{
                alert(data.msg);
                $(".dialog_container").hide();
                $("#shop_verify_search").trigger("click");
            }
        }
    });
}

function jumpPage(vue,pageItem,para){
    var pageSize = 6;
    var pageIndex = pageItem.count;
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/user/userList?pageSize="+pageSize+"&pageIndex="+pageIndex,
        success:function(data){

            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.userList.countNum;
                vue.userList = data.resp.userList.objectList;
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
