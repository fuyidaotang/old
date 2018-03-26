var initPagination;
var wechatManagerVue;
function initialize() {
    wechatManagerVue = new Vue({
        el: ".wechat_manager",
        data: {
            shopList: [],
            currentPage: 1,
            pageSize: 6,
            countNum: 0,
            pageArray: []
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
                data.SpaceNum = $("#SpaceNum").val();
                data.attention = $("#attention").val();
                data.contact = $("#contact").val();
                data.wapStatus = $("#wapStatus").val();
                jumpPage(wechatManagerVue, pageItem,data);
            },
            isShowPass:function(status){
                if(status == 0 || status ==1){
                    return false;
                }else{
                    return true;
                }
            },
            showPassDialog:function(shopItem){
                sessionStorage.setItem("id",shopItem.wapId);
                $("#pass_dialog").show();
            },
            showRefuseDialog:function(shopItem){
                sessionStorage.setItem("id",shopItem.wapId);
                $("#refuse_dialog").show();
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
    jumpPage(wechatManagerVue, pageItem);
}

function addEvent() {
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(wechatManagerVue, pageItem);
    });
    $(".b_close").click(function() {
        $(this).parents(".dialog_container").hide();
    });
    $("#shop_verify_search").click(function() {
        var data = {};
        data.SpaceNum = $("#SpaceNum").val();
        data.attention = $("#attention").val();
        data.contact = $("#contact").val();
        data.wapStatus = $("#wapStatus").val();
        var pageItem = {
            count: wechatManagerVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(wechatManagerVue, pageItem,data);
    });
    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.wapId = sessionStorage.getItem("id");
        para.status = 2;
        changeState(para);
    });
    $("#refuse_dialog .refuse").click(function(){
        var para = {};
        para.wapId = sessionStorage.getItem("id");
        para.status = 3;
        para.rejectReason = $("#refuse_dialog textarea").val();
        changeState(para);
    });
}
function changeState(para){
    console.log(para);
    $.ajax({
        type:"post",
        data:para,
        url:"/tvmanager/space/verifyWap",
        success:function(data){
            if(data.code == 20000){
                alert(data.resp.verifyStatus);
                console.log(data);
                $(".dialog_container").hide();
                $("#shop_verify_search").trigger("click");
            }else{
                alert(data.msg);
                console.log(data);
                $(".dialog_container").hide();
                $("#shop_verify_search").trigger("click");
            }
        }
    });
}
function jumpPage(vue,pageItem,para){
    var pageSize = 6;
    var pageIndex = pageItem.count;
    console.log(para);
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/space/verifyWapList?pageSize="+pageSize+"&pageIndex="+pageIndex,
        success:function(data){
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.verifyList.countNum;
                vue.shopList = data.resp.verifyList.objectList;
                console.log(vue.shopList);
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
