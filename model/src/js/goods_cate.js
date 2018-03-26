var initPagination;
var goodsCateVue;
function initialize() {
  clearForm();
  goodsCateVue = new Vue({
    el: ".goods_cate",
    data: {
      goodsList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      pageArray: [],
      menuList: [],
      childList: [],
      rootList: []
    },
    computed: {
      pagesCount: function () {
        return Math.ceil(this.countNum / this.pageSize);
      },
      shopIndex: function () {
        return this.pageSize * (this.currentPage - 1) + 1;
      }
    },
    methods: {
      jumpPage: function (pageItem) {
        var data = {};
        data.productCategoryName = $("#productCategoryName").val();
        data.productCategoryCode = $("#productCategoryCode").val();
        data.status = $("#status").val();
        data.parentCode = $("#parentCode").val();
        jumpPage(goodsCateVue, pageItem, data);
      },
      showDetailDialog: function () {
        clearForm()
        goodsCateVue.menuList = goodsCateVue.rootList
        $("#detail_dialog").show();
      },
      showPassDialog: function (goodsItem) {
        sessionStorage.setItem("id", goodsItem.productCategoryCode);
        $("#pass_dialog").show();
      }
    }
  });
  initPagination = require("./pagination.js");
  getDefaultPage();
  getFirstMenu();
  addEvent();
}

function getDefaultPage() {
  //默认一页6条数据,显示第一页
  var pageItem = {
    count: 1,
    isActive: true,
    isHidden: false
  };
  jumpPage(goodsCateVue, pageItem);
}

function addEvent() {
  $(".page_button").click(function () {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(goodsCateVue, pageItem);
  });
  $(".b_close").click(function () {
    clearForm();
    $(this).parents(".dialog_container").hide();
  });
  $("#shop_verify_search").click(function () {
    var data = {};
    data.productCategoryCode = $("#productCategoryCode").val();
    data.productCategoryName = $("#productCategoryName").val();
    data.status = $("#status").val();
    data.parentCode = $("#parentCode").val();
    var pageSize = 6;
    var pageIndex = 1;
    var pageItem = {
      count: goodsCateVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(goodsCateVue, pageItem, data);
  });
  $("#detail_dialog .agree").click(function () {
    var para = {};
    para.productCategoryName = $.trim($("#productCategoryNameShow").val());
    if (para.productCategoryName == "") {
      $(".mistake").html("请输入类别名");
      return;
    }
    if ($("#childCodeShow").val() && $("#childCodeShow").val() != -1) {
      para.parentCode = $.trim($("#childCodeShow").val());
    } else {
      para.parentCode = $.trim($("#parentCodeShow").val());
    }
    para.status = $.trim($("#statusShow").val());
    var productCategoryCode = sessionStorage.getItem("id");
    if (productCategoryCode) {
      para.productCategoryCode = productCategoryCode;
      $.ajax({
        type: "post",
        data: para,
        url: "/tvmanager/product/updateProductCategory",
        success: function (data) {
          if (typeof data == "string") {
            data = JSON.parse(data);
          }
          alert(data.msg);
          $("#shop_verify_search").trigger("click");
          $(".b_close").trigger("click");
        }
      });
      return;
    }
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/product/addProductCategory",
      success: function (data) {
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        alert(data.msg);
        $("#shop_verify_search").trigger("click");
        $(".b_close").trigger("click");
      }
    });
  });
  $("#pass_dialog .agree").click(function () {
    var para = {};
    para.productCategoryCode = sessionStorage.getItem("id");
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/product/delProductCategory",
      success: function (data) {
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        alert(data.msg);
        $("#shop_verify_search").trigger("click");
        $(".b_close").trigger("click");
      }
    });
  });
  $("#parentCodeShow").change(function () {
    $("#childList").addClass('hidden')
    $.ajax({
      type: "get",
      url: "/tvmanager/product/productCategoryList?pageSize=100&pageIndex=1",
      data: {
        parentCode: $("#parentCodeShow").val()
      },
      success: function (res) {
        if (res.code == 20004) {
          alert("登录失效,请重新登录");
          sessionStorage.removeItem("loginInfo");
          location.href = "login.html";
        }
        if (res.resp) {
          var childList = [{
            productCategoryCode: "-1",
            productCategoryName: "不选择"
          }];
          var itemList = res.resp.productCategoryList.objectList;
          for (var i = 0; i < itemList.length; i++) {
            if (itemList[i].status == 1) {
              childList.push(itemList[i]);
            }
          }
          goodsCateVue.childList = childList
          goodsCateVue.$nextTick(function () {
            $("#childList").removeClass('hidden')
          })
        }
      }
    })
  })
}

function clearForm() {
  sessionStorage.removeItem("id");
  $("#productCategoryNameShow").val("");
}

function getFirstMenu() {
  var para = {};
  //获取所有查询结果
  para.pageSize = 100;
  para.pageIndex = 1;
  para.parentCode = 0;
  $.ajax({
    type: "get",
    url: "/tvmanager/product/productCategoryList",
    data: para,
    success: function (data) {
      var newList = [{
        productCategoryCode: "0",
        productCategoryName: "根类目"
      }];
      var itemList = data.resp.productCategoryList.objectList;
      for (var i = 0; i < itemList.length; i++) {
        if (itemList[i].status == 1) {
          newList.push(itemList[i]);
        }
      }
      goodsCateVue.rootList = newList
      Vue.nextTick(function () {
        $("#parentCodeShow").parent().removeClass("hidden");
        $(".menu_loading").hide();
      });
    }
  })
}

function jumpPage(vue, pageItem, para) {
  var pageSize = 6;
  var pageIndex = pageItem.count;
  console.log(para);
  $.ajax({
    type: "get",
    data: para,
    url: "/tvmanager/product/productCategoryList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.productCategoryList.countNum;
        vue.goodsList = data.resp.productCategoryList.objectList
        initPagination(vue);
      }
    }
  });
}

module.exports = {
  init: initialize
}
