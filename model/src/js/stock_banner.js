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
    url:'/tvmanager/purchase/getPicture',
    success:function(data){
      if(data.code == '20000'){
        willGoodVue.picUrl = data.resp.picPath
        willGoodVue.hasPic = true
      }else{
        alert(data.msg)
      }
    }
  })
  $('.add_button').click(function(){
    $("#uploadForm").ajaxSubmit({
      type: "post",
      url: "/tvmanager/app/upload",
      success: function (data) {
        $.ajax({
          type: 'post',
          url: '/tvmanager/purchase/addPicture',
          data: {
            picId: data
          },
          success:function(res){
            willGoodVue.picUrl = res.resp.picPath
            willGoodVue.hasPic = true
          }
        })
      }
    })
  })
}
module.exports = {
  init: initialize
}