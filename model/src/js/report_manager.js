var initPagination;
var newsQueryVue;
var wangEditor = require("wangeditor/dist/js/wangeditor.js");
require('../../libs/js/jquery.form.js');
var upPic=require('../img/timg.png');
function initialize() {
  newsQueryVue = new Vue({
    el: ".notice_manager",
    data: {
      noticeInfoList: [],
      title: "",
      type: "",
      source: "",
      keys: "",
      description: "",
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      newsUrl: '',
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
        data.newsTitle = $("#newsTitle").val();
        data.source = $("#source").val();
        data.newsKeys = $("#keys").val();
        data.newsType = $("#type").val();
        jumpPage(newsQueryVue, pageItem, data);
      },
      showNewsDialog: function (newsItem) {
        $("#add_dialog").show();
        $('#add_dialog .dialog_title').html('编辑新闻');
        $("input[type='radio']").attr('checked',false);
        sessionStorage.setItem('newsId',newsItem.newsId);
        this.title=newsItem.newsTitle;
        this.newsUrl = newsItem.newsUrl
        newsItem.status===0?
          $("#newsStatus input[value='0']").attr('checked',true):
          $("#newsStatus input[value='1']").attr('checked',true);
        newsItem.newsType===1?
          $("#newsType input[value='1']").attr('checked',true):
          newsItem.newsType===2?
            $("#newsType input[value='2']").attr('checked',true):
            $("#newsType input[value='3']").attr('checked',true);
        this.source=newsItem.source;
        $('#picShow').attr('src',newsItem.picturePath);
        $('#picId').val(newsItem.picId);
        this.keys=newsItem.newsKeys;
        this.description=newsItem.description;
        editor.$txt.html(newsItem.newsContext)
      },
      delNewsDialog: function (newsItem) {
        $('#pass_dialog').show();
        sessionStorage.setItem('newsId',newsItem.newsId);
      }
    }
  });
  //加载图片
  initEditor();
  initPagination = require("./pagination.js");
  getDefaultPage();
  addEvent();
}

//富文本框
function initEditor(){
  editor = new wangEditor('customEditor');
  editor.config.menus = [
    'fontfamily',
    'fontsize',
    'bold',
    'italic',
    'underline',
    'lineheight',
    'strikethrough',
    'forecolor',
    'orderlist',
    'alignleft',
    'aligncenter',
    'alignright',
    'img',
    'emotion'
  ];
  editor.config.uploadImgUrl = '/tvmanager/app/uploadPic2';
  editor.config.uploadImgFileName = "file";
  editor.config.uploadParams = {
    type: '2'
  };
  editor.config.hideLinkImg = true;
  editor.config.uploadImgFns.onload = function (res) {
    console.log(editor.uploadImgFileExt)
    if(typeof res != "object"){
      res = JSON.parse(res);
    }
    if(editor.uploadImgFileExt != "jpg"){
      alert("请上传jpg格式的图片");
      return;
    }
    var html = '<img src="' + res.resp.pic.file_path + '" style="display:inline-block;max-width:100%;"/>';
    editor.command(null, 'insertHtml', html);
  }
  editor.create();
  editor.$txt.html(localStorage.getItem("editText"));
}

function getDefaultPage() {
  //默认一页6条数据,显示第一页
  var pageItem = {
    count: 1,
    isActive: true,
    isHidden: false
  };
  jumpPage(newsQueryVue, pageItem);
}

function addEvent() {
  var vue=newsQueryVue
  //页面跳转
  $(".page_button").click(function () {
    var pageItem = {
      count: $("#page_index").val(),
      isActive: true,
      isHidden: false
    };
    jumpPage(newsQueryVue, pageItem);
  });
  //小窗口关闭按钮
  $(".b_close").click(function () {
    $(this).parents(".dialog_container").hide();
    $("input[type='radio']").attr('checked',false);
    vue.title='';
    vue.newsUrl = '';
    $("#newsStatus input[value='0']").attr('checked',true);
    $("#newsType input[value='1']").attr('checked',true);
    vue.source='';
    $('#picShow').attr('src',upPic);
    $('#picId').val('');
    vue.keys='';
    vue.description='';
    editor.$txt.html('<p><br></p>');
  });
  //搜索按钮
  $("#news_search").click(function () {
    var data = {};
    data.newsTitle = $("#newsTitle").val();
    data.source = $("#source").val();
    data.newsKeys = $("#keys").val();
    data.newsType = $("#type").val();
    var pageItem = {
      count: newsQueryVue.currentPage,
      isActive: true,
      isHidden: false
    };
    jumpPage(newsQueryVue, pageItem, data);
  });
  $('#pass_dialog .agree').click(function () {
      var para = {};
      para.newsId=sessionStorage.getItem('newsId');
      deleteNews(para);
    }
  )
  //添加新闻确定按钮
  $("#add_dialog .agree").click(function () {
    var para = {};
    var vue = newsQueryVue;
    para.newsTitle = vue.title;
    para.newsUrl = vue.newsUrl;
    para.source = vue.source;
    para.picId = $("#picId").val();
    para.status = $("#newsStatus input:checked").val();
    para.newsType = $("#newsType input:checked").val();
    para.newsContext = editor.$txt.html();
    para.newsKeys = vue.keys;
    para.description = vue.description;
    if($('#add_dialog .dialog_title').html()==='添加新闻') {
      addNews(para);
    }else if($('#add_dialog .dialog_title').html()==='编辑新闻'){
      para.newsId=sessionStorage.getItem('newsId');
      updateNews(para);
    }

  });
  //新闻添加按钮
  $("#news_add").click(function () {
    $("#add_dialog").show();
    $('#add_dialog .dialog_title').html('添加新闻');
  });
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
}

//添加新闻
function addNews(para) {
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/officalWeb/addNoticeInfo",
    success: function (data) {
      if(typeof data === "string"){
        data = JSON.parse(data);
      }
      alert(data.msg);
      $("#add_dialog").hide();
      $("#news_search").trigger("click");
    }
  });
}

//删除新闻
function deleteNews(para) {
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/officalWeb/delNoticeInfo",
    success: function (data) {
      if(typeof data === "string"){
        data = JSON.parse(data);
      }
      alert(data.msg);
      $("#pass_dialog").hide();
      $("#news_search").trigger("click");
    }
  });
}

//编辑新闻
function updateNews(para) {
  $.ajax({
    type: "post",
    data: para,
    url: "/tvmanager/officalWeb/updateNoticeInfo",
    success: function (data) {
      if(typeof data === "string"){
        data = JSON.parse(data);
      }
      alert(data.msg);
      $("#add_dialog").hide();
      $("#news_search").trigger("click");
    }
  });
}

// 获取请求
function jumpPage(vue, pageItem, para) {
  var pageSize = 6;
  var pageIndex = pageItem.count;
  $.ajax({
    type: "get",
    data: para,
    url: "/tvmanager/officalWeb/getNoticeInfoList?pageSize=" + pageSize + "&pageIndex=" + pageIndex,
    success: function (data) {
      if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
      if (data.resp) {
        vue.currentPage = pageIndex;
        vue.pageSize = pageSize;
        vue.countNum = data.resp.noticeInfo.countNum;
        vue.noticeInfoList = data.resp.noticeInfo.objectList;
        initPagination(vue);
      }
    }
  });
}

module.exports = {
  init: initialize
}
