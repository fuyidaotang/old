var initPagination;
var orderApplyVue;
function initialize() {
    orderApplyVue = new Vue({
        el: ".order_apply",
        data: {
            refundAppealList: [],
            currentPage: 1,
            pageSize: 6,
            countNum: 0,
            pageArray: [],
            detailContent:{},
            detailReturn:{}
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
            //页码对应页面跳转
            jumpPage: function(pageItem) {
                var data = {};
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
                jumpPage(orderApplyVue, pageItem,data);
            },
            showRefundReturn:function(productItem){
                sessionStorage.setItem("id",productItem.appealId);
                sessionStorage.setItem("money",productItem.amount);
                orderApplyVue.detailReturn= productItem.refundReturn;
                $("#detail_return").show();
            },
            showDetailDialog:function(productItem){
                sessionStorage.setItem("id",productItem.appealId);
                sessionStorage.setItem("money",productItem.amount);
                orderApplyVue.detailContent = productItem.refundReturn.ordreInfo;
                $("#detail_dialog").show();
            },
            showPassDialog:function(productItem){
                sessionStorage.setItem("id",productItem.appealId);
                sessionStorage.setItem("money",productItem.amount);
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
    jumpPage(orderApplyVue, pageItem);
}

function addEvent() {
    //页码手动跳转事件绑定
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(orderApplyVue, pageItem);
    });
    //关闭退款界面
    $(".b_close").click(function() {
        $(this).parents(".dialog_container").hide();
    });

    //搜索界面点击事件
    $("#shop_verify_search").click(function() {
        var data = {};
        data.orderNumber = $("#orderNumber").val();
        data.LockOrderStatus = $("#LockOrderStatus").val();
        data.orderStatus = $("#orderStatus").val();
        data.refundStatus = $("#refundStatus").val();
        data.spaceId = $("#spaceId").val();
        var pageSize = 6;
        var pageIndex = 1;
        var pageItem = {
            count: orderApplyVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(orderApplyVue, pageItem,data);
    });

    //编辑按钮事件绑定
    $("#detail_dialog .agree,#detail_return .agree").click(function(){
        $("#detail_dialog,#detail_return").hide();
        $("#pass_dialog").show();
    });
    //退款界面事件绑定
    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.appealId = sessionStorage.getItem("id");
        para.dealDetail= $('#pass_dialog textarea').val()
        if($("#pass_dialog input:checked").val()==='0'){
            para.refundMoney = sessionStorage.getItem("money");
            changeState(para,"/tvmanager/order/acceptRefundAppeal");
        }else{
            changeState(para,"/tvmanager/order/refuseRefundAppeal");
        }

    });
}

//更新商品状态
function changeState(para,myUrl){
    $.ajax({
        type:"post",
        data:para,
        url:myUrl,
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
        url:"/tvmanager/order/refundAppealList?pageSize="+pageSize+"&pageIndex="+pageIndex,
        success:function(data){
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.appealList.totalRows;
                vue.refundAppealList = data.resp.appealList.list;
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
