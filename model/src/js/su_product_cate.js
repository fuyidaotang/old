var initPagination;
var stockCateVue;
require('../../libs/js/jquery.form.js');
function initialize() {
  stockCateVue = new Vue({
    el: ".stock_cate",
    data: {
      cateList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      pageArray: []
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
        jumpPage(stockCateVue, pageItem, data);
      },
      showDetailDialog: function (cateItem) {
        if (cateItem) {
          sessionStorage.setItem("id", cateItem.productCategoryCode);
          $("#editCateName").val(cateItem.productCategoryName);
          $("#picId").val(cateItem.picId);
          $("#editStatus").val(cateItem.status);
          $("#sortNum").val(cateItem.sortNumber);
          $("#categoryPercent").val(cateItem.categoryPercent);
        }
        $("#detail_dialog").show();
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
  jumpPage(stockCateVue, pageItem);
}
function addEvent() {
  $(".page_button").click(function () {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(stockCateVue, pageItem);
  });
  $(".b_close").click(function () {
    clearForm();
    $(this).parents(".dialog_container").hide();
  });
  $("#stock_cate_search").click(function () {
    var data = {};
    data.productCategoryName = $("#productCategoryName").val();
    data.productCategoryCode = $("#productCategoryCode").val();
    data.status = $("#status").val();
    data.parentCode = $("#parentCode").val();
    var pageItem = {
      count: stockCateVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(stockCateVue, pageItem, data);
  });
  $("#detail_dialog .agree").click(function () {
    var para = {};
    para.picId = $.trim($("#picId").val());
    if(para.picId == ""){
      $(".mistake").html("请上传图片");
      return;
    }
    para.status = $.trim($("#editStatus").val());
    var productCategoryCode = sessionStorage.getItem("id");
    para.productCategoryCode = productCategoryCode;
    para.sortNumber = $.trim($("#sortNum").val());
    para.categoryPercent = $.trim($("#categoryPercent").val());
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/suProduct/updateSUProductCategory",
      success: function (data) {
        alert(data.msg)
        $("#stock_cate_search").trigger("click");
        $(".b_close").trigger("click");
      }
    });
    return;
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
function jumpPage(vue, pageItem, para) {
  var pageSize = 6;
  var pageIndex = pageItem.count;
  $.ajax({
    type: "get",
    data: para,
    url: "/tvmanager/suProduct/suProductCategoryList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.productCategory.countNum;
        vue.cateList = data.resp.productCategory.objectList;
        initPagination(vue);
      }
    }
  });
}
function clearForm() {
  sessionStorage.removeItem("id");
  $("#picId").val("");
  $("#editStatus").val("");
}
module.exports = {
  init: initialize
}
