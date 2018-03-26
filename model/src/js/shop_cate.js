var initPagination;
var shopCateVue;
require('../../libs/js/jquery.form.js');
function initialize() {
  shopCateVue = new Vue({
    el: ".shop_cate",
    data: {
      shopList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      pageArray: [],
      menuList: []
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
        data.classifyId = $("#classifyId").val();
        data.classifyName = $("#classifyName").val();
        data.status = $("#status").val();
        data.parentId = $("#parentId").val();
        jumpPage(shopCateVue, pageItem, data);
      },
      showDetailDialog: function (shopItem) {
        if (shopItem) {
          sessionStorage.setItem("id", shopItem.classifyId);
          $("#classifyNameShow").val(shopItem.classifyName);
          $("#parentIdShow").val(shopItem.parentId);
          $("#statusShow").val(shopItem.status);
        }
        $("#detail_dialog").show();
      },
      showPassDialog: function (shopItem) {
        sessionStorage.setItem("id", shopItem.classifyId);
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
  jumpPage(shopCateVue, pageItem);
}
function addEvent() {
  $(".page_button").click(function () {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(shopCateVue, pageItem);
  });
  $(".b_close").click(function () {
    clearForm();
    $(this).parents(".dialog_container").hide();
  });
  $("#shop_verify_search").click(function () {
    var data = {};
    data.classifyId = $("#classifyId").val();
    data.classifyName = $("#classifyName").val();
    data.status = $("#status").val();
    data.parentId = $("#parentId").val();
    var pageItem = {
      count: shopCateVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(shopCateVue, pageItem, data);
  });
  $("#detail_dialog .agree").click(function () {
    var para = {};
    para.classifyName = $.trim($("#classifyNameShow").val());
    para.picId = $.trim($("#picId").val());
    if (para.classifyName == "") {
      $(".mistake").html("请输入类别名");
      return;
    }
    if(para.picId == ""){
      $(".mistake").html("请上传图片");
      return;
    }
    para.parentId = $.trim($("#parentIdShow").val());
    para.status = $.trim($("#statusShow").val());
    var classifyId = sessionStorage.getItem("id");
    if (classifyId) {
      para.classifyId = classifyId;
      $.ajax({
        type: "post",
        data: para,
        url: "/tvmanager/space/updateStoreClassify",
        success: function (data) {
          $("#shop_verify_search").trigger("click");
          $(".b_close").trigger("click");
        }
      });
      return;
    }
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/space/addStoreClassify",
      success: function (data) {
        $("#shop_verify_search").trigger("click");
        $(".b_close").trigger("click");
      }
    });
  });
  $("#pass_dialog .agree").click(function () {
    var para = {};
    para.classifyId = sessionStorage.getItem("id");
    console.log(para);
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/space/delStoreClassify",
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
function getFirstMenu() {
  var para = {};
  //获取所有查询结果
  para.pageSize = 100;
  para.pageIndex = 1;
  para.parentId = 0;
  para.status = 1;
  $.ajax({
    type: "get",
    url: "/tvmanager/space/storeClassifyList",
    data: para,
    success: function (data) {
      var newList = [{
        classifyId: "0",
        classifyName: "根类目"
      }];
      shopCateVue.menuList = newList.concat(data.resp.storeClassifyList.objectList);
      Vue.nextTick(function () {
        $("#parentIdShow").parent().removeClass("hidden");
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
    url: "/tvmanager/space/storeClassifyList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.storeClassifyList.countNum;
        vue.shopList = data.resp.storeClassifyList.objectList;
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
