var initPagination;
var orderPagination;
var shopGetCashVue;

function initialize() {
    shopGetCashVue = new Vue({
        el: ".shop_get_cash",
        data: {
            shopList: [],
            orderList: [],
            currentPage: 1,
            orderPage: 1,
            pageSize: 6,
            countNum: 0,
            orderNum: 0,
            pageArray: [],
            orderPageArray: [],
            convertList: [],
            giftRecordList: [],
            detailItem: {}
        },
        computed: {
            pagesCount: function () {
                return Math.ceil(this.countNum / this.pageSize);
            },
            orderCount: function () {
                return Math.ceil(this.orderNum / this.pageSize);
            },
            shopIndex: function () {
                return this.pageSize * (this.currentPage - 1) + 1;
            }
        },
        methods: {
            jumpPage: function (pageItem) {
                var data = {};
                data.userId = $("#userId").val();
                data.realname = $("#realName").val();
                data.phoneNo = $("#phoneNo").val();
                data.cashMoney = $("#cashRmb").val();
                data.status = $("#status").val();
                jumpPage(shopGetCashVue, pageItem, data);
            },
            jumpOrderPage: function (pageItem) {
                var data = {};
                var index = $("#withdraw_dialog ul.cf li.active").index()
                if (index === 0) {
                    data.toUserId = sessionStorage.getItem('userId')
                    jumpOrderPage(shopGetCashVue, pageItem, data, 'order/orderList')
                } else if (index === 1) {
                    data.toUserId = sessionStorage.getItem('userId')
                    jumpOrderPage(shopGetCashVue, pageItem, data, 'user/giftRecordList')
                } else if (index === 2) {
                    data.toUserId = sessionStorage.getItem('userId')
                    jumpOrderPage(shopGetCashVue, pageItem, data, 'user/convertList')
                } else {
                    data.userId = sessionStorage.getItem('userId')
                    jumpOrderPage(shopGetCashVue, pageItem, data, 'user/verifyList')
                }
            },
            isShowPass: function (status) {
                if (status == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            showPassDialog: function (shopItem) {
                sessionStorage.setItem("id", shopItem.recordId);
                $("#pass_dialog").show(200);
            },
            showRefuseDialog: function (shopItem) {
                sessionStorage.setItem("id", shopItem.recordId);
                $("#refuse_dialog").show(200);
            },
            showDetailDialog: function (shopItem) {
                $("#withdraw_dialog").show(200);
                $("#withdraw_dialog ul.cf li.order").addClass("active");
                var data = {};
                data.userId = shopItem.recordId;
                sessionStorage.setItem('userId', shopItem.userId);
                this.detailItem = shopItem
                $(".order").trigger('click');
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
    jumpPage(shopGetCashVue, pageItem);
}

function addEvent() {
    $(".page_button").click(function () {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(shopGetCashVue, pageItem);
    });
    $("#withdraw_dialog .page_button").click(function () {
        var pageItem = {
            count: $("#page_index2").val(),
            isActive: true,
            isHidden: false
        };
        var data = {};
        data.userId = sessionStorage.getItem('userId');
        // jumpOrderPage(shopGetCashVue, pageItem, data, 'order/orderList');
        $("#withdraw_dialog ul.cf li.active").index() === 0 ?
            (jumpOrderPage(shopGetCashVue, pageItem, data, 'order/orderList')) :
            $("#withdraw_dialog ul.cf li.active").index() === 1 ?
                (jumpOrderPage(shopGetCashVue, pageItem, data, 'user/giftRecordList')) :
                (jumpOrderPage(shopGetCashVue, pageItem, data, 'user/convertList'));
    });
    $(".b_close").click(function () {
        $(this).parents(".dialog_container").hide(200);
        $("#withdraw_dialog ul.cf li.active").removeClass("active");

    });
    $("#shop_verify_search").click(function () {
        var data = {};
        data.userId = $("#userId").val();
        data.realname = $("#realName").val();
        data.phoneNo = $("#phoneNo").val();
        data.cashMoney = $("#cashRmb").val();
        data.status = $("#status").val();
        var pageItem = {
            count: shopGetCashVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(shopGetCashVue, pageItem, data);
    });
    $("#pass_dialog .agree").click(function () {
        var para = {};
        para.recordId = sessionStorage.getItem("id");
        para.status = 1;
        changeState(para);
    });
    $("#refuse_dialog .refuse").click(function () {
        var para = {};
        para.recordId = sessionStorage.getItem("id");
        para.status = -1;
        para.cause=$('#reject_value').val();
        console.log(para)
        changeState(para);
    });
    $('#detail_dialog .accordion').click(function () {
        $(this).next().toggle();
    });
    $(".order").click(function () {
        $(".giftList,.capitalList,.historyList").css("display", 'none')
        $(".orderList").css("display", 'block')
        $("#withdraw_dialog li.active").removeClass("active");
        $(this).addClass("active");
        var pageItem = {
            count: 1,
            isActive: true,
            isHidden: false
        };
        var data = {};
        data.toUserId = sessionStorage.getItem('userId');
        orderPagination = require("./pagination2.js");
        jumpOrderPage(shopGetCashVue, pageItem, data, 'order/orderList');
    });
    $(".gift").click(function () {
        $(".orderList,.capitalList,.historyList").css("display", 'none')
        $(".giftList").css("display", 'block')
        $("#withdraw_dialog li.active").removeClass("active");
        $(this).addClass("active");
        $("#withdraw_dialog").show(200);
        var pageItem = {
            count: 1,
            isActive: true,
            isHidden: false
        };
        var data = {};
        data.toUserId = sessionStorage.getItem('userId');
        jumpOrderPage(shopGetCashVue, pageItem, data, 'user/giftRecordList');
    });
    $(".capital").click(function () {
        $(".orderList,.giftList,.historyList").css("display", 'none')
        $(".capitalList").css("display", 'block')
        $("#withdraw_dialog li.active").removeClass("active");
        $(this).addClass("active");
        var pageItem = {
            count: 1,
            isActive: true,
            isHidden: false
        };
        var data = {};
        data.toUserId = sessionStorage.getItem('userId');
        jumpOrderPage(shopGetCashVue, pageItem, data, 'user/convertList');
    });
    $(".history").click(function () {
        $(".orderList,.giftList,.capitalList").css("display", 'none')
        $(".historyList").css("display", 'block')
        $("#withdraw_dialog li.active").removeClass("active");
        $(this).addClass("active");
        var pageItem = {
            count: 1,
            isActive: true,
            isHidden: false
        };
        var data = {};
        data.userId = sessionStorage.getItem('userId');
        jumpOrderPage(shopGetCashVue, pageItem, data, 'user/verifyList');
    });
}

function changeState(para) {
    $.ajax({
        type: "post",
        data: para,
        url: "/tvmanager/user/VerifyCash",
        success: function (data) {
            if (data.code == 20000) {
                alert(data.resp.verifyStatus);
                $(".dialog_container").hide(200);
                $("#shop_verify_search").trigger("click");
            } else {
                alert(data.msg);
                $(".dialog_container").hide(200);
                $("#shop_verify_search").trigger("click");
            }
        }
    });
}

//提现列表请求
function jumpPage(vue, pageItem, para) {
    var pageSize = 6;
    var pageIndex = pageItem.count;
    $.ajax({
        type: "get",
        data: para,
        url: "/tvmanager/user/verifyList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
        success: function (data) {
            if (data.code == 20004) {
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href = "login.html";
            }
            if (data.resp) {
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.verifyList.countNum;
                vue.shopList = data.resp.verifyList.objectList;
                initPagination(vue);
            }
        }
    });
}

//订单请求
function jumpOrderPage(vue, pageItem, para, myUrl) {
    var pageSize = 6;
    var pageIndex = pageItem.count;
    $.ajax({
        type: "get",
        data: para,
        url: "/tvmanager/" + myUrl + "?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
        success: function (data) {
            // console.log(data);
            if (data.code == 20004) {
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href = "login.html";
            }
            if (data.resp) {
                vue.orderPage = pageIndex;
                vue.pageSize = pageSize;
                if (data.resp.productList) {
                    vue.orderNum = data.resp.productList.countNum
                    vue.orderList = data.resp.productList.objectList
                }
                if (data.resp.convertList) {
                    vue.orderNum = data.resp.convertList.countNum
                    vue.orderList = data.resp.convertList.objectList
                }
                if (data.resp.verifyList) {
                    vue.orderNum = data.resp.verifyList.countNum
                    vue.orderList = data.resp.verifyList.objectList
                }
                orderPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}