var initPagination;
var productQueryVue;
function initialize() {
  productQueryVue = new Vue({
    el: ".product_query",
    data: {
      productList: [],
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
        data.spaceName = $("#spaceName").val();
        data.productName = $("#productName").val();
        data.status = $("#productStatue").val();
        if(Date.parse($("#beginTime").val())){
          data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
          data.endTime = Date.parse($("#endTime").val());
        }
        jumpPage(productQueryVue, pageItem,data);
      },
      showDetailDialog:function(productItem){
        sessionStorage.setItem("id",productItem.productId);
        productQueryVue.detailContent = productItem;
        $("#detail_dialog").show();
      },
      showPassDialog:function(productItem){
        sessionStorage.setItem("id",productItem.productId);
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
  jumpPage(productQueryVue, pageItem);
}

function addEvent() {
  $(".page_button").click(function() {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(productQueryVue, pageItem);
  });
  $(".b_close").click(function() {
    $(this).parents(".dialog_container").hide();
  });
  $("#shop_verify_search").click(function() {
    var data = {};
    data.spaceName = $("#spaceName").val();
    data.productName = $("#productName").val();
    data.status = $("#productStatue").val();
    if(Date.parse($("#beginTime").val())){
      data.beginTime = Date.parse($("#beginTime").val());
    }
    if(Date.parse($("#endTime").val())){
      data.endTime = Date.parse($("#endTime").val());
    }
    var pageItem = {
      count: productQueryVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(productQueryVue, pageItem,data);
  });
  $("#detail_dialog .agree").click(function(){
    $("#detail_dialog").hide();
    $("#pass_dialog").show();
  });
  $("#pass_dialog .agree").click(function(){
    var para = {};
    para.productId = sessionStorage.getItem("id");
    para.status = $("#pass_dialog input:checked").val();
    changeState(para);
  });
}

function changeState(para){
  $.ajax({
    type:"post",
    data:para,
    url:"/tvmanager/suProductsuProductUpdateStatus",
    success:function(data){
      data = JSON.parse(data);
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
    url:"/tvmanager/suProduct/suProductList?pageSize="+pageSize+"&pageIndex="+pageIndex,
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
        vue.countNum = data.resp.product.countNum;
        vue.productList = data.resp.product.objectList;
        initPagination(vue);
      }
    }
  });
}

module.exports = {
  init: initialize
}
