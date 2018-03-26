require('../../libs/js/jquery.form.js');
function initialize(){
  // 移除loading图标
  $(".pic_container").addClass("hidden");
  var willGoodVue = new Vue({
    el: '.willGood',
    data:{
      picUrl: '',
      hasPic: false
    }
  })
  $.ajax({
    type:'get',
    url:'/tvmanager/officalWeb/getLiveInfoPic',
    success:function(data){
      if(data.code == '20000'){
        willGoodVue.picUrl = data.resp.picturePath
        willGoodVue.hasPic = true
      }else{
        alert(data.msg)
      }
    }
  })
  $('.add_button').click(function(){
    $("#uploadForm").ajaxSubmit({
      type: "post",
      url: "/tvmanager/officalWeb/addLiveInfoPicId",
      success: function (data) {
        if(data.code == '20000'){
          willGoodVue.picUrl = data.resp.picturePath
          willGoodVue.hasPic = true
        }else{
          alert(data.msg)
        }
      }
    })
  })
}
module.exports = {
  init: initialize
}