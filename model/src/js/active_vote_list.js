var voteListVue;
var initPagination;
function initialize() {
  voteListVue = new Vue({
    el: ".vote_list",
    data: {
      phone:'',
      spaceId:'',
      spaceName:'',
      number:'',
      tableData: [],
      pageSize:10,
      para:{
        pageSize:10,
        pageIndex:1
      },
      countNum: 0,
      currentPage:0,
      targetPage: 1,
      pageArray: [],
      pagesCount:0,
      ids:[],
      eventInfo:{},
      delShow:false,
      userItem:{},
      userIndex:0,
      allDelShow:false
    },
    methods: {
      addUser(){
        location.href = "index.html#active_add_user";
        $('.comm_nav_item').removeClass('active');
        $('.comm_nav_item[jump=active_add_user]').addClass('active')
      },
      jumpPage: function(pageIndex,item) {
        let self = this;
        self.para.pageIndex=pageIndex;
        $.ajax({
          type:"get",
          url:"/tvmanager/activity/getDraftUserList",
          data: self.para,
          success:function(data){
            if(data.code == 20004){
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href="login.html";
            }
            if(data.resp){
              self.currentPage = self.para.pageIndex;
              self.countNum = data.resp.draftUser.countNum;
              self.pagesCount=data.resp.draftUser.pagination;
              self.tableData=data.resp.draftUser.objectList;
            }
            initPagination(self);
          }
        });
      },
      search:function(){
        let self=this;
        if(self.phone!==''){
          self.para.phoneNo=self.phone;
        }else{
          delete self.para.phoneNo;
        }
        if(self.spaceId!==''){
          self.para.number=self.spaceId;
        }else {
          delete self.para.number;
        }
        if(self.spaceName!==''){
          self.para.spaceName=self.spaceName;
        }else{
          delete self.para.spaceName;
        }
        if(self.number!==''){
          self.para.spaceNum=self.number;
        }else{
          delete self.para.spaceNum;
        }
        $.ajax({
          type:'get',
          data: self.para,
          url:'/tvmanager/activity/getDraftUserList',
          success:function(data){
            console.log(data)
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }
            if(data.resp.draftUser.objectList.length>0){
              self.tableData=data.resp.draftUser.objectList;
              self.currentPage = self.para.pageIndex;
              self.countNum = data.resp.draftUser.countNum;
              self.pagesCount=data.resp.draftUser.pagination;
            }else{
              self.tableData.splice(0,10)
            }
            initPagination(self);
          }
        })
      },
      changeName(item,e){
        $.ajax({
          type:'post',
          url:'/tvmanager/activity/updateDraftUser',
          data:{
            userId:item.userId,
            verifyName:$(e.target).val()
          },
          success:function (data) {
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }else if(data.code==20000){
              alert('成功')
            }
          }
        })
      },
      deleteUser(item,index){
        let self=this;
        $.ajax({
          url:'/tvmanager/activity/delDraftUser',
          data:{
            userIds:item.userId
          },
          dataType:'json',
          type:'post',
          success:function (data) {
            console.log(data)
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }else if(data.code==20000){
              self.tableData.splice(index,1)
              self.delShow=false;
            }
          }
        })
      },
      checkChange(item,e){
        let self=this;
        console.log($.inArray(String(item.userId), self.ids))
        if($(e.target).is(':checked')){
          if($.inArray(String(item.userId), self.ids)){
            self.ids.push(String(item.userId))
          }
        }else{
          if($.inArray(String(item.userId), self.ids)>=0){
            self.ids.splice($.inArray(String(item.userId), self.ids),1)
          }
        }
        console.log(self.ids)
      },
      checkAll(e){
        let self=this;
        if($(e.target).is(':checked')){
          $('.checked').each(function(){
            $(this).get()[0].checked=true;
            if($.inArray(String($(this).val()), self.ids)<0){
              self.ids.push(String($(this).val()))
            }
          })
        }else{
          $('.checked').each(function(){
            $(this).get()[0].checked=false;
            if($.inArray(String($(this).val()), self.ids)>=0){
              self.ids.splice($.inArray(String($(this).val()), self.ids),1)
            }
          })
        }
      },
      deleteAll(){
        let ids=this.ids.join(',');
        let self=this;
        $.ajax({
          url:'/tvmanager/activity/delDraftUser',
          data:{
            userIds:ids
          },
          dataType:'json',
          type:'post',
          success:function (data) {
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }else if(data.code==20000){
              self.ids.splice(0,self.ids.length);
              $.ajax({
                type:'get',
                data: self.para,
                url:'/tvmanager/activity/getDraftUserList',
                success:function(data){
                  if (data.code == 20004) {
                    alert("登录失效,请重新登录");
                    sessionStorage.removeItem("loginInfo");
                    location.href = "login.html";
                  }
                  if(data.resp.draftUser.objectList&&data.resp.draftUser.objectList.length>0){
                    self.tableData=data.resp.draftUser.objectList;
                    self.currentPage = self.para.pageIndex;
                    self.countNum = data.resp.draftUser.countNum;
                    self.pagesCount=data.resp.draftUser.pagination;
                    if($('#check_all').is(':checked')){
                      $('#check_all').get()[0].checked=false;
                    }
                    $('.checked').each(function(){
                      $(this).get()[0].checked=false;
                    })
                  }
                  initPagination(self);
                }
              })
              self.allDelShow=false;
            }
          }
        })
      },
      showDelBox(item,index){
        this.delShow=true;
        if(item!==undefined){
          this.userItem=item;
          this.userIndex=index;
        }
      },
      allShow(){
        if(this.ids.length==0){
          alert('至少选中一条')
        }else{
          this.allDelShow=true;
        }
      },
      routerDetai(id){
        sessionStorage.setItem('activeVoteDetailId',id)
        location.href='#active_vote_detail';
      }
    },
    mounted(){
      this.$nextTick(function () {
        let self=this;
        $.ajax({
          type:'get',
          data: self.para,
          url:'/tvmanager/activity/getDraftUserList',
          success:function(data){
            if (data.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }
            if(data.resp.draftUser.objectList&&data.resp.draftUser.objectList.length>0){
              self.tableData=data.resp.draftUser.objectList;
              self.currentPage = self.para.pageIndex;
              self.countNum = data.resp.draftUser.countNum;
              self.pagesCount=data.resp.draftUser.pagination;
            }
            initPagination(self);
          }
        })
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
  initPagination = require("./pagination.js");
}
module.exports = {
  init: initialize
}
