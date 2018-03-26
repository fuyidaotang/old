var initPagination;
var orderQueryVue;
function initialize() {
    orderQueryVue = new Vue({
        el: ".order_query",
        data: {
            orderList: [],
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
                data.spaceName = $("#spaceName").val();
                data.orderNumber = $("#orderNumber").val();
                data.status = $("#status").val();
                data.userPhone = $("#userPhone").val();
                if(Date.parse($("#beginTime").val())){
                    data.beginTime = Date.parse($("#beginTime").val());
                }
                if(Date.parse($("#endTime").val())){
                    data.endTime = Date.parse($("#endTime").val());
                }
                console.log('1222'+data);
                jumpPage(orderQueryVue, pageItem,data);
            },
            showDetailDialog:function(productItem){
                sessionStorage.setItem("id",productItem.orderId);
                orderQueryVue.detailContent = productItem;
                $("#detail_dialog").show();
            },
            showPassDialog:function(productItem){
                sessionStorage.setItem("id",productItem.orderId);
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
    var data={};
    data.userId = sessionStorage.getItem('id');
    $("#userId").val(data.userId);
    jumpPage(orderQueryVue, pageItem,data);
}

function addEvent() {
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(orderQueryVue, pageItem);
    });
    $(".b_close").click(function() {
        $(this).parents(".dialog_container").hide();
    });
    $("#shop_verify_search").click(function() {
        var data = {};
        data.userId = $("#userId").val();
        data.spaceName = $("#spaceName").val();
        data.orderNumber = $("#orderNumber").val();
        data.status = $("#status").val();
        data.userPhone = $("#userPhone").val();
        if(Date.parse($("#beginTime").val())){
            data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
            data.endTime = Date.parse($("#endTime").val());
        }
        var pageItem = {
            count: orderQueryVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(orderQueryVue, pageItem,data);
    });
    $("#detail_dialog .agree").click(function(){
        $("#detail_dialog").hide();
        $("#pass_dialog").show();
    });
    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.orderId = sessionStorage.getItem("id");
        para.status = $("#pass_dialog input:checked").val();
        changeState(para);
    });
}
//更新商品状态
function changeState(para){
    $.ajax({
        type:"post",
        data:para,
        url:"/tvmanager/order/orderStatusUpadate",
        success:function(data){
            if(typeof data == "string"){
                data = JSON.parse(data);
            }
            alert(data.msg);
            $(".dialog_container").hide();
            $("#shop_verify_search").trigger("click");
        }
    });
}

function jumpPage(vue,pageItem,para){
    var pageSize = 6;
    var pageIndex = pageItem.count;
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/order/orderList?pageSize="+pageSize+"&pageIndex="+pageIndex,
        success:function(data){
            console.log(data);
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.productList.countNum;
                vue.orderList = data.resp.productList.objectList;
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
