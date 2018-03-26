var cateManagerVue;
require('../../libs/js/jquery.form.js');
function initialize() {
  cateManagerVue = new Vue({
    el: ".cateList",
    data: {
      cateList: [],
      columnList: [],
      isEdit: false
    },
    methods: {
      showEditDialog: function (cateItem) {
        this.isEdit = true
        $('#classifyId').val(cateItem.classifyId)
        $('#classifyTitle').val(cateItem.classifyTitle)
        $('#picId').val(cateItem.picId)
        $('#sortNum').val(cateItem.sortNum)
        $('#status').val(cateItem.status)
        $("#picShow").attr('src',cateItem.picturePath);
        $('#detail_dialog').show();
      },
      delItem: function(id){
        $.ajax({
          type: 'post',
          data: {
            classifyId: id
          },
          url: '/tvmanager/officalWeb/delDayClassify',
          success: function (data){
            if(data.code == 20000) {
              alert(data.msg)
              location.reload()
            }
          }
        })
      }
    }
  });
  //加载图片
  Vue.nextTick(function () {
    if (!$(".pic_container").hasClass("hidden")) {
      $(".pic_container").addClass("hidden");
    }
  });
  getDefaultPage();
  addEvent();
}

function getDefaultPage() {
  $.ajax({
    type: 'get',
    url: '/tvmanager/officalWeb/getDayClassifyList',
    success: function (data){
      if (data.code == 20000) {
        cateManagerVue.cateList = data.resp.dayClassify
      }
    }
  })
  $.ajax({
    type: 'get',
    url: '/tvmanager/space/storeClassifyList',
    data:{
      pageSize: 100,
      pageIndex: 1
    },
    success: function (data){
      if (data.code == 20000) {
        cateManagerVue.columnList = data.resp.storeClassifyList.objectList
      }
    }
  })
}

function addEvent() {
  $('#detail_dialog .agree').click(function () {
      var para = {};
      para.classifyId = $('#classifyId').val()
      para.classifyTitle = $('#classifyTitle').val()
      para.picId = $('#picId').val()
      para.sortNum = $('#sortNum').val()
      para.status = $('#status').val()
      if(cateManagerVue.isEdit){
        editCate(para)
      }else{
        addCate(para)
      }
    }
  )
  $(".add_button").click(function(){
    cateManagerVue.isEdit = false
    $('#detail_dialog').show();
  })
  //上传图片
  $(".uploadFile").change(function () {
    $("#uploadForm").ajaxSubmit({
      type: "post",
      url: "/tvmanager/app/uploadPic2",
      success: function (data) {
        $("#detail_dialog").show();
        $("#picId").val(data.resp.pic.picId);
        $("#picShow").attr('src',data.resp.pic.file_path);
      }
    })
  })
  //小窗口关闭按钮
  $(".b_close").click(function () {
    $(this).parents(".dialog_container").hide();
  });
}

//添加类别
function addCate(para) {
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/officalWeb/addDayClassify",
    success: function (data) {
      alert(data.msg);
      $("#detail_dialog").hide();
      location.reload()
    }
  });
}
function editCate(para) {
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/officalWeb/updateDayClassify",
    success: function (data) {
      alert(data.msg);
      $("#detail_dialog").hide();
      location.reload()
    }
  });
}

module.exports = {
  init: initialize
}