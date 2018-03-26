/**
 * Created by Administrator on 2017/4/5.
 */
var initPagination;
var shopListVue;
function initialize() {
  shopListVue = new Vue({
    el: ".shop_list",
    data: {
      shopList: [],
      recommendList: [],
      classifyList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      pageArray: [],
      detailContent: {}
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
        data.spaceName = $("#spaceName").val();
        data.spaceType = $("#spaceType").val();
        data.spaceLevel = $("#spaceLevel").val();
        data.verifyStatus = $("#verifyStatus").val();
        data.recommend = $("#isRecommend").val();
        data.spacePhone = $("#spacePhone").val();
        data.classifyId = $("#classify").val();
        if (Date.parse($("#beginTime").val())) {
          data.beginTime = Date.parse($("#beginTime").val());
        }
        if (Date.parse($("#endTime").val())) {
          data.endTime = Date.parse($("#endTime").val());
        }
        jumpPage(shopListVue, pageItem, data);
      },
      showPassDialog: function (shopItem) {
        sessionStorage.setItem("id", shopItem.spaceId);
        sessionStorage.setItem("score", shopItem.spaceScore);
        $("#pass_dialog").show();
      },
      showPassDialog2: function (shopItem) {
        sessionStorage.setItem("id", shopItem.spaceId);
        sessionStorage.setItem("classifyId", shopItem.classifyId);
        $("#pass_dialog2").show();
      },
      addRecommend: function (id) {
        sessionStorage.setItem("id", id);
        $("#recom_dialog").show();
      },
      delRecommend: function(id){
        $.ajax({
          type:"post",
          data:{
            spaceId: id
          },
          url: '/tvmanager/space/delRecommend',
          success:function(data){
            alert(data.msg)
            $("#shop_verify_search").trigger("click");
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
  $.ajax({
    type: 'get',
    url: '/tvmanager/officalWeb/getDayClassifyList',
    data: {
      pageSize: 100,
      pageIndex: 1
    },
    success: function (data) {
      if(data.code == '20000'){
        shopListVue.recommendList = data.resp.dayClassify
      }else{
        alert(data.msg)
      }
    }
  })
  var pageItem = {
    count: 1,
    isActive: true,
    isHidden: false
  };
  $.ajax({
    type: 'get',
    url: '/tvmanager/space/storeClassifyList',
    data: {
      pageSize:100,
      pageIndex: 1
    },
    success: function (res){
      if(res.code == '20000'){
        shopListVue.classifyList = res.resp.storeClassifyList.objectList
      }else{
        alert(res.msg)
      }
    }
  })
  jumpPage(shopListVue, pageItem);
}

function addEvent() {
  $("#download").click(function () {
    location.href='/tvmanager/space/downloadExcel'
  })
  $(".page_button").click(function () {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(shopListVue, pageItem);
  });
  $(".b_close").click(function () {
    $(this).parents(".dialog_container").hide();
  });
  $("#shop_verify_search").click(function () {
    var data = {};
    data.spaceName = $("#spaceName").val();
    data.spaceType = $("#spaceType").val();
    data.spaceLevel = $("#spaceLevel").val();
    data.verifyStatus = $("#verifyStatus").val();
    data.recommend = $("#isRecommend").val();
    data.spacePhone = $("#spacePhone").val();
    data.classifyId = $("#classify").val();
    if (Date.parse($("#beginTime").val())) {
      data.beginTime = Date.parse($("#beginTime").val());
    }
    if (Date.parse($("#endTime").val())) {
      data.endTime = Date.parse($("#endTime").val());
    }
    var pageItem = {
      count: shopListVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(shopListVue, pageItem, data);
  });
  $("#pass_dialog2 .agree").click(function () {
    var para = {};
    para.spaceId = sessionStorage.getItem("id");
    para.classifyId = $("#classifyId2").val();
    changeCate(para);
  });
  $("#pass_dialog .agree").click(function () {
    var para = {};
    para.spaceId = sessionStorage.getItem("id");
    para.score = $("#pass_dialog input").val();
    if (sessionStorage.getItem("score") == para.score || para.score == '') {
      alert('您并未修改店铺评分');
      $(".dialog_container").hide();
      return;
    } else {
      changeScore(para);
    }
  });
  $("#recom_dialog .agree").click(function () {
    var para = {};
    para.spaceid = sessionStorage.getItem("id");
    if($('#sortNum').val() == ''){
      alert('请输入排序')
      return;
    }
    para.sortNum = $('#sortNum').val()
    para.classifyId = $("#classifyId").val()
    $.ajax({
      type: 'post',
      data: para,
      url: '/tvmanager/space/addRecommend',
      success: function(data){
        alert(data.msg)
        $("#recom_dialog").hide()
        $("#shop_verify_search").trigger("click");
      }
    })
  });
}
//更新商品状态
function changeScore(para) {
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/space/updateSpaceScore",
    success: function (data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      alert(data.msg);
      $(".dialog_container").hide();
      $("#shop_verify_search").trigger("click");
    }
  });
}

function changeCate(para) {
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/space/updateClassify",
    success: function (data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      alert(data.msg);
      $(".dialog_container").hide();
      $("#shop_verify_search").trigger("click");
    }
  });
}

function jumpPage(vue, pageItem, para) {
  var pageSize = 6;
  var pageIndex = pageItem.count;
  console.log(para);
  $.ajax({
    type: "get",
    data: para,
    url: "/tvmanager/space/getSpaceList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.space.countNum;
        vue.shopList = data.resp.space.objectList;
        initPagination(vue);
      }
    }
  });
}

module.exports = {
  init: initialize
}