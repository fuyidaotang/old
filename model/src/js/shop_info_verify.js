var initPagination;
var shopInfoVerifyVue;
function initialize() {
  shopInfoVerifyVue = new Vue({
    el: ".shop_info_verify",
    data: {
      shopList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      pageArray: [],
      detailContent: {},
      isChooseAll: false
    },
    computed: {
      pagesCount: function () {
        return Math.ceil(this.countNum / this.pageSize);
      },
      shopIndex: function () {
        return this.pageSize * (this.currentPage - 1) + 1;
      }
    },
    watch: {
      isChooseAll: function () {
        let self = this
        this.shopList.forEach(function(item){
          item.isChoose = self.isChooseAll
        })
      }
    },
    methods: {
      jumpPage: function (pageItem) {
        console.log('123')
        var data = {};
        data.verifyName = $("#verifyName").val();
        data.verifyPhone = $("#verifyPhone").val();
        data.verifyNo = $("#verifyNo").val();
        data.verifyType = $("#verifyType").val();
        data.storeName = $("#storeName").val();
        data.userName = $("#userName").val();
        data.verifyStatus = $("#verifyStatus").val();
        data.appFansNum = $("#appFans").val();
        data.orderNum = $("#orderNum").val();
        data.depositStatus=$('#bzj').val();
        console.log($('#bzj').val())
        if (Date.parse($("#beginTime").val())) {
          data.beginTime = Date.parse($("#beginTime").val());
        }
        if (Date.parse($("#endTime").val())) {
          data.endTime = Date.parse($("#endTime").val());
        }
        jumpPage(shopInfoVerifyVue, pageItem, data);
      },
      isShowPass: function (status) {
        if (status == 0) {
          return false;
        } else {
          return true;
        }
      },
      iconPic: function (picList, index, index2) {
        var sfz = [];
        if (picList.length === undefined) {
          return
        }
        for (var i = 0; i < picList.length; i++) {
          if (picList[i].picType == index) {
            if (index == 3) {
              sfz.push(picList[i].picUrl.replace("thum", "icon"));
              continue;
            }
            return picList[i].picUrl.replace("thum", "icon");
          }
        }
        if (index == 3 && index2 == 1) {
          return sfz[0];
        }
        if (index == 3 && index2 == 2) {
          return sfz[1];
        }
      },
      showDetailDialog: function (shopItem) {
        sessionStorage.setItem("id", shopItem.spaceVerify.verifyId);
        var picList = shopItem.verifyPics;
        var pics1 = [];
        var pics2 = [];
        var pics3 = [];
        var pics4 = [];
        var pics5 = [];
        var pics6 = [];
        var pics7 = [];
        var pics8 = [];
        var pics9 = [];
        for (var i = 0; i < picList.length; i++) {
          if (picList[i].picType == 1) {
            pics1.push(picList[i].picUrl);
          } else if (picList[i].picType == 2) {
            pics2.push(picList[i].picUrl);
          } else if (picList[i].picType == 3) {
            pics3.push(picList[i].picUrl);
          } else if (picList[i].picType == 4) {
            pics4.push(picList[i].picUrl);
          } else if (picList[i].picType == 5) {
            pics5.push(picList[i].picUrl);
          } else if (picList[i].picType == 6) {
            pics6.push(picList[i].picUrl);
          } else if (picList[i].picType == 7) {
            pics7.push(picList[i].picUrl);
          } else if (picList[i].picType == 8) {
            pics8.push(picList[i].picUrl);
          } else if (picList[i].picType == 9) {
            pics9.push(picList[i].picUrl);
          }
        }
        shopItem.spaceVerify.pics1 = pics1;
        shopItem.spaceVerify.pics2 = pics2;
        shopItem.spaceVerify.pics3 = pics3;
        shopItem.spaceVerify.pics4 = pics4;
        shopItem.spaceVerify.pics5 = pics5;
        shopItem.spaceVerify.pics6 = pics6;
        shopItem.spaceVerify.pics7 = pics7;
        shopItem.spaceVerify.pics8 = pics8;
        shopItem.spaceVerify.pics9 = pics9;
        shopInfoVerifyVue.detailContent = shopItem.spaceVerify;
        $("#detail_dialog").show();
      },
      showRefuseDialog: function (shopItem) {
        if (shopItem) {
          sessionStorage.setItem("id", shopItem.spaceVerify.verifyId);
        }else{
          sessionStorage.removeItem("id")
        }
        $("#refuse_dialog").show();
      }
    }
  });
  initPagination = require("./pagination.js");
  getDefaultPage();
  addEvent();
}

function getDefaultPage() {
  //默认一页6条数据,显示第一页
  var pageSize = 6;
  var pageIndex = 1;
  var pageItem = {
    count: 1,
    isActive: true,
    isHidden: false
  };
  jumpPage(shopInfoVerifyVue, pageItem);
}

function addEvent() {
  $(".page_button").click(function () {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(shopInfoVerifyVue, pageItem);
  });
  $(".b_close").click(function () {
    $(this).parents(".dialog_container").hide();
  });
  $("#shop_verify_search").click(function () {
    var data = {};
    data.verifyName = $("#verifyName").val();
    data.verifyPhone = $("#verifyPhone").val();
    data.verifyNo = $("#verifyNo").val();
    data.verifyType = $("#verifyType").val();
    data.storeName = $("#storeName").val();
    data.userName = $("#userName").val();
    data.verifyStatus = $("#verifyStatus").val();
    data.appFansNum = $("#appFans").val();
    data.orderNum = $("#orderNum").val();
    data.depositStatus=$('#bzj').val();
    if (Date.parse($("#beginTime").val())) {
      data.beginTime = Date.parse($("#beginTime").val());
    }
    if (Date.parse($("#endTime").val())) {
      data.endTime = Date.parse($("#endTime").val());
    }
    var pageSize = 6;
    var pageIndex = 1;
    var pageItem = {
      count: shopInfoVerifyVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(shopInfoVerifyVue, pageItem, data);
  });
  $("#download").click(function () {
    var data = {};
    data.verifyName = $("#verifyName").val();
    data.verifyPhone = $("#verifyPhone").val();
    data.verifyNo = $("#verifyNo").val();
    data.verifyType = $("#verifyType").val();
    data.storeName = $("#storeName").val();
    data.userName = $("#userName").val();
    data.verifyStatus = $("#verifyStatus").val();
    data.appFansNum = $("#appFans").val();
    data.orderNum = $("#orderNum").val();
    data.depositStatus=$('#bzj').val();
    if (Date.parse($("#beginTime").val())) {
      data.beginTime = Date.parse($("#beginTime").val());
    }
    if (Date.parse($("#endTime").val())) {
      data.endTime = Date.parse($("#endTime").val());
    }
    var str = '?'
    for(var key in data){
      if(data[key]){
        str += key + '=' + data[key]+'&'
      }
    }
    str = str.substring(0,str.length-1)
    location.href='/tvmanager/space/downloadVerifyExcel'+str
  })
  $("#detail_dialog .refuse").click(function () {
    $("#detail_dialog").hide();
    $("#refuse_dialog").show();
  });
  $("#refuse_dialog .refuse").click(function () {
    var para = {};
    para.status = $("#refuse_dialog input:checked").val();
    para.rejectReason = $("#refuse_dialog textarea").val();
    if(sessionStorage.getItem("id")){
      para.verifyId = sessionStorage.getItem("id");
      changeState(para);
    }else{
     var verifyIds = ''
      shopInfoVerifyVue.shopList.forEach(function(item){
        if(item.isChoose){
          verifyIds += item.spaceVerify.verifyId + ','
        }
      })
      verifyIds = verifyIds.substring(0, verifyIds.length-1)
      para.verifyIds = verifyIds
      changeAllState(para);
    }
  });
}

function jumpPage(vue, pageItem, para) {
  var pageSize = 6;
  var pageIndex = pageItem.count;
  $.ajax({
    type: "get",
    data: para,
    url: "/tvmanager/space/verifySpaceListV1?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        var obgList = data.resp.verifyList.objectList;
        for (var i = 0; i < obgList.length; i++) {
          obgList[i].spaceCamera = obgList[i].spaceCamera.split(",");
        }
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.verifyList.countNum;
        console.log(obgList)
        vue.shopList = obgList;
        initPagination(vue);
      }
    }
  });
}

function changeState(para) {
  if (!para.status) {
    alert("请选择状态");
    return;
  }
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/space/verifySpaceV1",
    success: function (data) {
      if (data.code == 20000) {
        alert(data.resp.verifyStatus);
        $(".dialog_container").hide();
        $("#shop_verify_search").trigger("click");
      } else {
        alert(data.msg);
        $(".dialog_container").hide();
        $("#shop_verify_search").trigger("click");
      }
    }
  });
}

function changeAllState(para) {
  if (!para.status) {
    alert("请选择状态");
    return;
  }
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/space/batchVerifySpace",
    success: function (data) {
      if (data.code == 20000) {
        alert(data.resp.verifyStatus);
        $(".dialog_container").hide();
        $("#shop_verify_search").trigger("click");
      } else {
        alert(data.msg);
        $(".dialog_container").hide();
        $("#shop_verify_search").trigger("click");
      }
    }
  });
}

module.exports = {
  init: initialize
}
