/**
 * Created by Administrator on 2017/4/1.
 */
var initPagination;
var userConvertVue;
function initialize() {
    userConvertVue = new Vue({
        el: ".user_convert",
        data: {
            convertList: [],
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
                data.userId = $("#userId").val();
                data.type = $("#type").val();
                if(Date.parse($("#beginTime").val())){
                    data.beginTime = Date.parse($("#beginTime").val());
                }
                if(Date.parse($("#endTime").val())){
                    data.endTime = Date.parse($("#endTime").val());
                }
                jumpPage(userConvertVue, pageItem,data);
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
    data.userId = sessionStorage.getItem('id');
    sessionStorage.removeItem('id');
    $("#userId").val(data.userId);
    jumpPage(userConvertVue, pageItem,data);

}

function addEvent() {
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(userConvertVue, pageItem);
    });
    $("#shop_verify_search").click(function() {
        var data = {};
        data.userId = $("#userId").val();
        data.type = $("#type").val();
        if(Date.parse($("#beginTime").val())){
            data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
            data.endTime = Date.parse($("#endTime").val());
        }
        var pageSize = 6;
        var pageIndex = 1;
        var pageItem = {
            count: userConvertVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(userConvertVue, pageItem,data);
    });
}

function jumpPage(vue,pageItem,para){
    var pageSize = 6;
    var pageIndex = pageItem.count;
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/user/convertList?pageSize="+pageSize+"&pageIndex="+pageIndex,
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
                vue.convertList = data.resp.convertList.objectList;
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
