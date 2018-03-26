var IosSelect = require("./iosSelect.js");
var areaObject = require("./areaData_v2.js");
var addAddressPara;

function initialize(param) {
  addAddressPara = param;
  if (sessionStorage.getItem("editAddress")) {
    var address = JSON.parse(sessionStorage.getItem("editAddress"));
    $('#addressId').val(address.addressId);
    $('#realName').val(address.receiveName);
    $('#telphone').val(address.receivePhone);
    $('#show_contact').attr('data-province-code', address.addressProvinces);
    $('#show_contact').attr('data-city-code', address.addressCity);
    $('#show_contact').attr('data-district-code', address.addressDistrict);

    $('#show_contact').val(address.addressProvincesInfo + " " + address.addressCityInfo + " " + address.addressDistrictInfo);
    $('#inputAddress').val(address.addressStreet);
  }
  $("footer").hide();
  saveAddressEvent();
  initSelector();
}

//添加更新地址事件
function saveAddressEvent() {
  $('#show_contact').parents(".inputArea").siblings(".inputArea").click(function () {
    $(this).children("input").focus();
  });
  //不弹出小键盘
  $('#show_contact').click(function () {
    $(this).blur();
  });
  $('#saveAddress').click(function () {
    var realName = $('#realName').val().trim();
    var telphone = $('#telphone').val().trim();
    var area = $('#show_contact').val().trim();
    var address = $('#inputAddress').val().trim();
    var areaInfo = $('#show_contact').val().split(" ");

    var telReg = new RegExp("^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$");
    if (realName == "") {
      $('#realName').siblings(".mistake").html("请输入真实姓名");
      $('#realName').siblings(".mistake").show();
      return;
    }
    if (!telReg.exec(telphone)) {
      $('#telphone').siblings(".mistake").html("请输入正确的手机号码");
      $('#telphone').siblings(".mistake").show();
      return;
    }
    if (area == "") {
      $('#show_contact').siblings(".mistake").html("请选择所在地区");
      $('#show_contact').siblings(".mistake").show();
      return;
    }
    if (address == "") {
      $('#inputAddress').siblings(".mistake").html("请输入详细地址");
      $('#inputAddress').siblings(".mistake").show();
      return;
    }
    var para = {
      userId: addAddressPara.userId,
      addressProvinces: $('#show_contact').attr('data-province-code'),
      addressCity: $('#show_contact').attr('data-city-code'),
      addressDistrict: $('#show_contact').attr('data-district-code'),
      addressStreet: address,
      receiveName: realName,
      receivePhone: telphone
    }
    if ($('#addressId').val()) {
      var index = $('#addressId').attr('index');
      para.addressId = $('#addressId').val();
      para.addressProvincesInfo = areaInfo[0];
      para.addressCityInfo = areaInfo[1];
      para.addressDistrictInfo = areaInfo[2];
      $.ajax({
        type: "post",
        url: "http://wap.hongdoujiao.tv/wap/address/update.do",
        data: para,
        success: function (data) {
          var addLastPage = sessionStorage.getItem("addLastPage");
          sessionStorage.setItem('addressInfo', JSON.stringify(para))
          if (addLastPage == "chooseAddress") {
            location.href = "#chooseAddress";
          } else {
            location.href = "#confirmOrder";
          }
        }
      });
    } else {
      para.addressProvincesInfo = areaInfo[0];
      para.addressCityInfo = areaInfo[1];
      para.addressDistrictInfo = areaInfo[2];
      $.ajax({
        type: "post",
        url: "http://wap.hongdoujiao.tv/wap/address/insert.do",
        data: para,
        success: function (data) {
          var addLastPage = sessionStorage.getItem("addLastPage");
          para.addressId = data.resp.addressId
          sessionStorage.setItem('addressInfo', JSON.stringify(para))
          if (addLastPage == "chooseAddress") {
            location.href = "#chooseAddress";
          } else {
            location.href = "#confirmOrder";
          }
        }
      });
    }
  });
  $('.addAddress .inputArea input').click(function () {
    $(this).siblings('.mistake').hide();
  });
}

//地区选择
function initSelector() {
  var showContactDom = $('#show_contact');
  showContactDom.bind('click', function () {
    var sccode = showContactDom.attr('data-city-code');
    var scname = showContactDom.attr('data-city-name');

    var oneLevelId = showContactDom.attr('data-province-code');
    var twoLevelId = showContactDom.attr('data-city-code');
    var threeLevelId = showContactDom.attr('data-district-code');
    var iosSelect = new IosSelect(3, [areaObject.p, areaObject.c, areaObject.d], {
      title: '',
      itemHeight: 35,
      relation: [1, 1, 0, 0],
      oneLevelId: oneLevelId,
      twoLevelId: twoLevelId,
      threeLevelId: threeLevelId,
      callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
        showContactDom.attr('data-province-code', selectOneObj.id);
        showContactDom.attr('data-city-code', selectTwoObj.id);
        showContactDom.attr('data-district-code', selectThreeObj.id);
        showContactDom.val(selectOneObj.value + ' ' + selectTwoObj.value + ' ' + selectThreeObj.value);
        $('.addAddress').show();
      },
      closeCallback: function () {
        $('.addAddress').show();
      }
    });
  });
}

module.exports = {
  init: initialize
}
