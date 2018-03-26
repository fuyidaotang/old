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
        data.selectionName = $("#selectionName").val();
        data.selectionTitle = $("#selectionTitle").val();
        data.status = $("#status").val();
        data.sortNum = $("#sortNum").val();
        jumpPage(stockCateVue, pageItem, data);
      },
      showDetailDialog: function (cateItem) {
        if (cateItem) {
          sessionStorage.setItem("id", cateItem.selectionId);
          $("#editSelectionName").val(cateItem.selectionName);
          $("#editSelectionTitle").val(cateItem.selectionTitle);
          $("#editSortNum").val(cateItem.sortNum);
          $("#statusShow").val(cateItem.status);
          $("#picId").val(cateItem.picId);
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
    data.selectionName = $("#selectionName").val();
    data.selectionTitle = $("#selectionTitle").val();
    data.status = $("#status").val();
    data.sortNum = $("#sortNum").val();
    var pageItem = {
      count: stockCateVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(stockCateVue, pageItem, data);
  });
  $("#detail_dialog .agree").click(function () {
    var para = {};
    para.selectionName = $.trim($("#editSelectionName").val());
    para.selectionTitle = $.trim($("#editSelectionTitle").val());
    para.picId = $.trim($("#picId").val());
    para.bannerPicId = $.trim($("#bannerPicId").val());
    if (para.selectionName == "") {
      $(".mistake").html("请输入严选名称");
      return;
    }
    if (para.selectionTitle == "") {
      $(".mistake").html("请输入严选标题");
      return;
    }
    if(para.picId == ""){
      $(".mistake").html("请上传图片");
      return;
    }
    para.sortNum = $.trim($("#editSortNum").val());
    para.status = $.trim($("#statusShow").val());
    var selectionId = sessionStorage.getItem("id");
    para.selectionId = selectionId;
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/purchase/updateHomeSelection",
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
  $(".uploadFile2").change(function () {
    $("#uploadForm2").ajaxSubmit({
      type: "post",
      url: "/tvmanager/app/upload",
      success: function (data) {
        $("#bannerPicId").val(data);
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
    url: "/tvmanager/purchase/getHomeSelectionList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.homeSelection.countNum;
        vue.cateList = data.resp.homeSelection.objectList;
        initPagination(vue);
      }
    }
  });
}
function clearForm() {
  sessionStorage.removeItem("id");
  $("#classifyNameShow").val("");
}
module.exports = {
  init: initialize
}
