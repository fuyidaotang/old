var bannerManagerVue;
require('../../libs/js/jquery.form.js');
function initialize() {
  clearForm();
  getBannerList();
  bannerManagerVue = new Vue({
    el: ".banner_manager",
    data: {
      bannerList: []
    },
    methods: {
      showDetailDialog: function (banner) {
        if (banner) {
          sessionStorage.setItem("id", banner.bannerId);
          sessionStorage.setItem("picId", banner.picId);
          $("#name").val(banner.bannerContent);
          $("#url").val(banner.redirectUrl);
          $("#statusShow").val(banner.status);
          $("#redirectType").val(banner.redirectType);
          $("#bannerType").val(banner.bannerType);
          $("#menuOrder").val(banner.orderNum);
        }
        $("#detail_dialog").show();
        $("#detail_dialog .agree").show();
      },
      showPassDialog: function (banner) {
        sessionStorage.setItem("id", banner.bannerId);
        $("#pass_dialog").show();
      }
    }
  });
  addEvent();
}

function getBannerList() {
  $.ajax({
    type: "get",
    url: "/tvmanager/app/bannerListV1",
    success: function (data) {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        bannerManagerVue.bannerList = data.resp.bannerList;
      }
    }
  });
}

function addEvent() {
  $(".b_close").click(function () {
    clearForm();
    $(this).parents(".dialog_container").hide();
  });
  $(".add_button").click(function () {
    $("#detail_dialog").show();
    $("#detail_dialog .agree").hide();
  });
  $("#detail_dialog .agree").click(function () {
    var para = {};
    para.name = $.trim($("#name").val());
    if (para.name == "") {
      $(".mistake").html("请输入广告内容");
      return;
    }
    para.url = $.trim($("#url").val());
    if (para.url == "") {
      $(".mistake").html("请输入跳转链接");
      return;
    }
    para.menuOrder = $.trim($("#menuOrder").val());
    para.status = $.trim($("#statusShow").val());
    if($.trim($("#redirectType").val())){
      para.redirectType = $.trim($("#redirectType").val());
    }
    if($.trim($("#bannerType").val())){
      para.bannerType = $.trim($("#bannerType").val());
    }
    para.areaId = 0
    var bannerId = sessionStorage.getItem("id");
    if (bannerId) {
      para.bannerId = bannerId;
      var uploadPicId = $.trim($("#picId").val());
      if (uploadPicId) {
        para.picId = uploadPicId;
      } else {
        para.picId = sessionStorage.getItem("picId");
      }
      $.ajax({
        type: "post",
        data: para,
        url: "/tvmanager/app/updateBannerV1",
        success: function (data) {
          if (typeof data == "string") {
            data = JSON.parse(data);
          }
          alert(data.msg);
          getBannerList();
          $(".b_close").trigger("click");
        }
      });
      return;
    }
    para.picId = $.trim($("#picId").val());
    if (para.picId == "") {
      $(".mistake").html("请上传图片");
      return;
    }
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/app/addBannerV1",
      success: function (data) {
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        alert(data.msg);
        getBannerList();
        $(".b_close").trigger("click");
      }
    });
  });
  $("#pass_dialog .agree").click(function () {
    var para = {};
    para.bannerId = sessionStorage.getItem("id");
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/app/delBannerV1",
      success: function (data) {
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        alert(data.msg);
        getBannerList();
        $(".b_close").trigger("click");
      }
    });
  });
  $(".uploadFile").change(function () {
    $("#uploadForm").ajaxSubmit({
      type: "post",
      url: "/tvmanager/app/upload",
      success: function (data) {
        console.log(data)
        $("#detail_dialog").show();
        $("#picId").val(data);
        console.log("上传成功,picid为" + data);
        $("#detail_dialog .agree").show();
      }
    })
  })
}

function clearForm() {
  sessionStorage.removeItem("id");
  sessionStorage.removeItem("picId");
  $("#name").val("");
  $("#url").val("");
  $("#menuOrder").val("");
  $("#file").val("");
  $("#picId").val("");
}

module.exports = {
  init: initialize
}
