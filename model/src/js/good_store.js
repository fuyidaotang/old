/**
 * Created by Administrator on 2017/4/5.
 */
var initPagination;
var shopListVue;
function initialize() {
  shopListVue = new Vue({
    el: ".good_store",
    data: {
      shopList: [],
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
        data.spaceType = $("#spaceType").val();
        data.spaceLevel = $("#spaceLevel").val();
        data.verifyStatus = $("#verifyStatus").val();
        data.spacePhone = $("#spacePhone").val();
        if(Date.parse($("#beginTime").val())){
          data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
          data.endTime = Date.parse($("#endTime").val());
        }
        jumpPage(shopListVue, pageItem,data);
      },
      showPassDialog:function(productItem){
        sessionStorage.setItem("id",productItem.spaceId);
        sessionStorage.setItem("score",productItem.spaceScore);
        $("#pass_dialog").show();
      },
      changeState: function(id) {
        $.ajax({
          type:'post',
          url: '/tvmanager/space/delRecommend',
          data: {
            spaceId: id
          },
          success: function (data) {
            alert(data.msg)
            $("#shop_verify_search").trigger('click')
          }
        })
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
  jumpPage(shopListVue, pageItem);
}

function addEvent() {
  $(".page_button").click(function() {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(shopListVue, pageItem);
  });
  $(".b_close").click(function() {
    $(this).parents(".dialog_container").hide();
  });
  $("#shop_verify_search").click(function() {
    var data = {};
    data.spaceName = $("#spaceName").val();
    data.spaceType = $("#spaceType").val();
    data.spaceLevel = $("#spaceLevel").val();
    data.verifyStatus = $("#verifyStatus").val();
    data.spacePhone = $("#spacePhone").val();
    if(Date.parse($("#beginTime").val())){
      data.beginTime = Date.parse($("#beginTime").val());
    }
    if(Date.parse($("#endTime").val())){
      data.endTime = Date.parse($("#endTime").val());
    }
    var pageItem = {
      count: shopListVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(shopListVue, pageItem,data);
  });
  $("#pass_dialog .agree").click(function(){
    var para = {};
    para.spaceId = sessionStorage.getItem("id");
    para.sortNum = $("#pass_dialog input").val();
    changeSort(para)
  });
}
//更新商品状态
function changeSort(para){
  $.ajax({
    type:"post",
    data:para,
    url:"/tvmanager/space/updateSortNum",
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
    url:"/tvmanager/space/getDaySpaceInfo?pageSize="+pageSize+"&pageIndex="+pageIndex,
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
        vue.countNum = data.resp.daySpaceInfo.countNum;
        vue.shopList = data.resp.daySpaceInfo.objectList;
        initPagination(vue);
      }
    }
  });
}

module.exports = {
  init: initialize
}
