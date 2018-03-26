/**
 * Created by Administrator on 2017/4/1.
 */
var initPagination;
var userGiftRecordVue;
function initialize() {
    userGiftRecordVue = new Vue({
        el: ".user_giftRecord",
        data: {
            giftRecordList: [],
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
                data.fromUserId = $("#fromUserId").val();
                data.toUserId = $("#toUserId").val();
                if(Date.parse($("#beginTime").val())){
                    data.beginTime = Date.parse($("#beginTime").val());
                }
                if(Date.parse($("#endTime").val())){
                    data.endTime = Date.parse($("#endTime").val());
                }
                jumpPage(userGiftRecordVue, pageItem,data);
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
    var data={};
    data.fromUserId = sessionStorage.getItem('id');
    $("#fromUserId").val(data.fromUserId);
    jumpPage(userGiftRecordVue, pageItem,data);
}

function addEvent() {
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(userGiftRecordVue, pageItem);
    });
    $("#shop_verify_search").click(function() {
        var data = {};
        data.fromUserId = $("#fromUserId").val();
        data.toUserId = $("#toUserId").val();
        if(Date.parse($("#beginTime").val())){
            data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
            data.endTime = Date.parse($("#endTime").val());
        }
        var pageItem = {
            count: userGiftRecordVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(userGiftRecordVue, pageItem,data);
    });
}

function jumpPage(vue,pageItem,para){
    var pageSize = 6;
    var pageIndex = pageItem.count;
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/user/giftRecordList?pageSize="+pageSize+"&pageIndex="+pageIndex,
        success:function(data){
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.convertList.countNum;
                vue.giftRecordList = data.resp.convertList.objectList;
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
