var moduleManagerVue;
function initialize() {
  clearForm();
  getModuleList();
  moduleManagerVue = new Vue({
    el: ".module_manager",
    data: {
      moduleList: []
    },
    methods: {
      editMenu: function (menuItem) {
        sessionStorage.setItem("id", menuItem.menuId);
        $("#menuName").val(menuItem.menuName);
        $("#menuOrder").val(menuItem.menuOrder);
        $("#menuUrl").val(menuItem.menuUrl);
        $("#detail_dialog").show();
      },
      removeModule: function (menuId,index) {
        var _this = this;
        $.ajax({
          type: 'post',
          data: {
            menuId: menuId
          },
          url: '/tvmanager/sys/delMenu',
          success: function(res){
            var data = JSON.parse(res)
            if (data.code === 20000) {
              _this.moduleList.splice(index,1);
            }
          }
        });
      }
    }
  });
  addEvent();
}

function getModuleList() {
  $.ajax({
    type: "get",
    url: "/tvmanager/sys/menuList",
    success: function (data) {
      data = JSON.parse(data);
      if (data.code = 20000) {
        var menuList = data.resp.menuInfo;
        menuList = menuInit(menuList);
        console.log(menuList);
        moduleManagerVue.moduleList = menuList;
      } else if (data.code == 20004) {
        alert("登录失效,请重新登录");
        sessionStorage.removeItem("loginInfo");
        location.href = "login.html";
      }
    }
  });
}

function menuInit(menuInfo) {
  var menuListOne = [];
  var menuListTwo = [];
  for (var i = 0; i < menuInfo.length; i++) {
    var menuItem = {};
    if (menuInfo[i].parentId == 0) {
      menuItem.menuId = menuInfo[i].menuId;
      menuItem.menuName = menuInfo[i].menuName;
      menuItem.menuOrder = menuInfo[i].menuOrder;
      menuItem.menuUrl = menuInfo[i].menuUrl;
      menuItem.children = [];
      menuListOne.push(menuItem);
    } else {
      menuItem.parentId = menuInfo[i].parentId;
      menuItem.menuName = menuInfo[i].menuName;
      menuItem.menuOrder = menuInfo[i].menuOrder;
      menuItem.menuId = menuInfo[i].menuId;
      menuItem.menuUrl = menuInfo[i].menuUrl;
      menuListTwo.push(menuItem);
    }
  }
  for (var i = 0; i < menuListTwo.length; i++) {
    for (var j = 0; j < menuListOne.length; j++) {
      if (menuListOne[j].menuId == menuListTwo[i].parentId) {
        menuListOne[j].children.push(menuListTwo[i]);
      }
    }
  }
  for (var i = 0; i < menuListOne.length; i++) {
    menuListOne[i].children.sort(compare("menuOrder"));
  }
  return menuListOne;
}

function compare(property) {
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

function addEvent() {
  $(".b_close").click(function () {
    clearForm();
    $(this).parents(".dialog_container").hide();
  });
  $(".add_button").click(function () {
    $("#detail_dialog").show();
  });
  $("#detail_dialog .agree").click(function () {
    var para = {};
    para.menuName = $.trim($("#menuName").val());
    if (para.menuName == "") {
      $(".mistake").html("请输入菜单名称");
      return;
    }
    para.menuOrder = $.trim($("#menuOrder").val());
    if (para.menuOrder == "") {
      $(".mistake").html("请输入菜单排序(数字)");
      return;
    }
    para.menuUrl = $.trim($("#menuUrl").val());
    para.parentId = $.trim($("#parentId").val());
    var menuId = sessionStorage.getItem("id");
    if (menuId) {
      para.menuId = menuId;
      $.ajax({
        type: "post",
        data: para,
        url: "/tvmanager/sys/updateMenu",
        success: function (data) {
          if (typeof data == "string") {
            data = JSON.parse(data);
          }
          alert(data.msg);
          getModuleList();
          $(".b_close").trigger("click");
        }
      });
      return;
    }
    $.ajax({
      type: "post",
      data: para,
      url: "/tvmanager/sys/addMenu",
      success: function (data) {
        console.log(data);
        data = JSON.parse(data);
        alert(data.msg);
        getModuleList();
        $(".b_close").trigger("click");
      }
    });
  });
}

function clearForm() {
  sessionStorage.removeItem("id");
  $("#menuName").val("");
  $("#menuOrder").val("");
  $("#menuUrl").val("");
}

module.exports = {
  init: initialize
}
