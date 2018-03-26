var voteDetailVue;
function initialize() {
  voteDetailVue = new Vue({
    el: ".vote_detail",
    data: {
      data:{},
      para:{},
      delShow:false
    },
    methods: {
      search(){
        let self=this;
        if($('#endTime').val()!==''){
          this.para.endTime=new Date($('#endTime').val()).getTime();
        }else{
          delete this.para.endTime;
        }
        if($('#beginTime').val()!==''){
          this.para.startTime=new Date($('#beginTime').val()).getTime();
        }else {
          delete this.para.startTime;
        }
        this.para.userId=sessionStorage.getItem('activeVoteDetailId');
        $.ajax({
          type:'get',
          data: self.para,
          url:'/tvmanager/activity/getDraftUserDetail',
          success:function(data){
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }
            if(data.resp) {
              self.data=data.resp.draftUserDetail;
            }
          }
        })
      },
      deleteUser(){
        let self=this;
        $.ajax({
          url:'/tvmanager/activity/delDraftUser',
          data:{
            userIds:sessionStorage.getItem('activeVoteDetailId')
          },
          dataType:'json',
          type:'post',
          success:function (data) {
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }else if(data.code==20000){
              location.href='#active_vote_manager'
            }
          }
        })
      },
    },
    mounted(){
      this.$nextTick(function () {
        let self=this;
        $.ajax({
          type:'get',
          data: {
            userId:sessionStorage.getItem('activeVoteDetailId'),
          },
          url:'/tvmanager/activity/getDraftUserDetail',
          success:function(data){
            console.log(data)
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }else if(data.code==20000){
              self.data=data.resp.draftUserDetail;
            }
          }
        })
      })
    }
  });
}
module.exports = {
  init: initialize
}