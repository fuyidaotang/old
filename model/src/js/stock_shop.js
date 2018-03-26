var initPagination;
var stockShopVue;
require('../../libs/js/jquery.form.js');
function initialize() {
  stockShopVue = new Vue({
    el: ".stock_shop",
    data: {
      shopList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      pageArray: [],
      cateList: [],
      isEdit: false
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
        data.selectionId = $("#selectionId").val();
        data.title = $("#title").val();
        jumpPage(stockShopVue, pageItem, data);
      },
      showDetailDialog: function (shopItem) {
        if (shopItem) {
          this.isEdit = false
          sessionStorage.setItem("id", shopItem.spaceId);
          sessionStorage.setItem("sid", shopItem.selectionId);
          $("#editTitle").val(shopItem.title);
          $("#editSortNum").val(shopItem.sortNum);
          $("#picId").val(shopItem.picId);
          $("#detail_dialog").show();
        }else{
          this.isEdit = true
        }
        $("#detail_dialog").show();
      },
      showPassDialog: function (shopItem) {
        sessionStorage.setItem("id", shopItem.spaceId);
        sessionStorage.setItem("sid", shopItem.selectionId);
        $("#pass_dialog").show();
      }
    }
  });
  initPagination = require("./pagination.js");
  getDefaultPage();
  getStockCate();
  addEvent();
}

function getDefaultPage() {
  //默认一页6条数据,显示第一页
  var pageItem = {
    count: 1,
    isActive: true,
    isHidden: false
  };
  jumpPage(stockShopVue, pageItem);
}
function addEvent() {
  $(".page_button").click(function () {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(stockShopVue, pageItem);
  });
  $(".b_close").click(function () {
    clearForm();
    $(this).parents(".dialog_container").hide();
  });
  $("#stock_shop_search").click(function () {
    var data = {};
    data.title = $("#title").val();
    data.selectionId = $("#selectionId").val();
    var pageItem = {
      count: stockShopVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(stockShopVue, pageItem, data);
  });
  $("#detail_dialog .agree").click(function () {
    var para = {};
    para.title = $.trim($("#editTitle").val());
    para.picId = $.trim($("#picId").val());
    if (para.title == "") {
      $(".mistake").html("请输入标题");
      return;
    }
    if(para.picId == ""){
      $(".mistake").html("请上传图片");
      return;
    }
    para.sortNum = $.trim($("#editSortNum").val());
    var spaceId = sessionStorage.getItem("id");
    if (spaceId) {
      para.spaceId = spaceId;
      para.selectionId = sessionStorage.getItem("sid");
      $.ajax({
        type: "post",
        data: para,
        url: "/tvmanager/purchase/updateHomeSelectionSpace",
        success: function (data) {
          alert(data.msg)
          if(data.code === 20000){
            $("#stock_shop_search").trigger("click");
            $(".b_close").trigger("click");
          }
        }
      });
      return;
    }
    para.spaceId = $.trim($("#editSpaceId").val());
    para.selectionId = $.trim($("#editSelectionId").val());
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/purchase/insetHomeSelectionSpace",
      success: function (data) {
        alert(data.msg)
        if(data.code === 20000){
          $("#shop_verify_search").trigger("click");
          $(".b_close").trigger("click");
        }
      }
    });
  });
  $("#pass_dialog .agree").click(function () {
    var para = {};
    para.spaceId = sessionStorage.getItem("id");
    para.selectionId = sessionStorage.getItem("sid");
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/purchase/delHomeSelectionSpace",
      success: function (data) {
        console.log(data);
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        alert(data.msg);
        $("#shop_verify_search").trigger("click");
        $(".b_close").trigger("click");
      }
    });
  });
  $(".uploadFile").change(function () {
    $("#uploadForm").ajaxSubmit({
      type: "post",
      url: "/tvmanager/app/upload",
      success: function (data) {
        $("#picId").val(data);
      }
    })
  })
}
function getStockCate() {
  var para = {};
  //获取所有查询结果
  para.pageSize = 100;
  para.pageIndex = 1;
  $.ajax({
    type: "get",
    url: "/tvmanager/purchase/getHomeSelectionList",
    data: para,
    success: function (data) {
      stockShopVue.cateList = data.resp.homeSelection.objectList
      Vue.nextTick(function () {
        $("#editSelectionId").parent().removeClass("hidden");
        $(".menu_loading").hide();
      });
    }
  })
}
function jumpPage(vue, pageItem, para) {
  var pageSize = 6;
  var pageIndex = pageItem.count;
  $.ajax({
    type: "get",
    data: para,
    url: "/tvmanager/purchase/getHomeSelectionSpaceList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.homeSelectionSpace.countNum;
        vue.shopList = data.resp.homeSelectionSpace.objectList;
        initPagination(vue);
      }
    }
  });
}
function clearForm() {
  sessionStorage.removeItem("id");
  sessionStorage.removeItem("sid");
  $("#editSpaceId").val('');
  $("#editTitle").val('');
  $("#editSelectionId").val('');
  $("#editSortNum").val('');
  $("#picId").val('');
}
module.exports = {
  init: initialize
}
