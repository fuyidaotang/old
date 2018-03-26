var addUserVue;
function initialize() {
  addUserVue = new Vue({
    el: ".add_active_user",
    data: {
      phone:'',
      spaceId:'',
      spaceName:'',
      userName:'',
      tableData: [],
      pageSize:10,
      para:{
        pageSize:10,
        pageIndex:1
      },
      eventInfo:{},
      user:{},
      verifyName:'',
      addShow:false,
      noList:false,
      index:0
    },
    methods: {
      addUser(){
        let self=this;
        if(self.verifyName!==''){
          $.ajax({
            url:'/tvmanager/activity/addDraftUser',
            type:'post',
            data:{
              userId:self.user.userId,
              spaceId:self.user.spaceId,
              verifyName:self.verifyName
            },
            dataType:'json',
            success:function (data) {
              if (data.code == 20004) {
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href = "login.html";
              }else if(data.code==20000){
                self.tableData.splice(self.index,1)
                alert('添加成功');
                self.addShow=false;
              }else{
                alert(data.msg)
              }
            }
          })
        }else{
          alert('请输入网红真实姓名')
        }
      },
      search(){
        let self=this;
        if(self.phone!==''){
          self.para.phoneNo=self.phone;
        }else{
          delete self.para.phoneNo;
        }
        if(self.spaceId!==''){
          self.para.spaceNum=self.spaceId;
        }else {
          delete self.para.spaceNum;
        }
        if(self.spaceName!==''){
          self.para.spaceName=self.spaceName;
        }else{
          delete self.para.spaceName;
        }
        if(self.userName!==''){
          self.para.userName=self.userName;
        }else{
          delete self.para.userName;
        }
        $.ajax({
          type:'get',
          data: self.para,
          url:'/tvmanager/activity/getDraftUser',
          success:function(data){
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }
            if(data.resp){
              if(data.resp.draftUser.objectList){
                self.tableData=data.resp.draftUser.objectList;
              }else{
                self.tableData.splice(0,10)
                self.noList=true;
              }
            }else{
              alert(data.msg)
            }
          }
        })
      },
      showAddBox(item,index){
        this.user=item;
        this.addShow=true;
        this.index=index;
      },
      hideAdd(){
        this.addShow=false;
        this.verifyName='';
      }
    },
    mounted(){
      this.$nextTick(function () {
        let self=this;
        $.ajax({
          type:'get',
          data: self.para,
          url:'/tvmanager/activity/getDraftTodayInfo',
          success:function(data){
            console.log(data)
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }else if(data.code==20000){
              self.eventInfo=data.resp.draftTodayInfo;
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
