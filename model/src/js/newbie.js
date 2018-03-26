var newbieVue;
var initPagination;
require('../../libs/js/jquery.form.js');
function initialize() {
  newbieVue = new Vue({
    el: ".newbie",
    data: {
      spaceId:'',
      spaceName:'',
      title:'',
      live:'2',
      phone:'',
      beginTime:'',
      pageArray: [],
      currentPage:0,
      targetPage: 1,
      pageSize:10,
      countNum:0,
      pagesCount:0,
      endTime:'',
      data:{
        pageSize:10,
        pageIndex:1
      },
      detailBox:false,
      codeList:[],
      code:'0',
      userList:[],
      activeUser:{},
      actionBox:false,
      delId:''
    },
    methods: {
      getList(){
        let self=this;
        $.ajax({
          type:'get',
          data:self.data,
          url:'/tvmanager/user/getRookieList',
          success:function (res) {
            if(res.resp.rookieList.objectList && res.resp.rookieList.objectList.length>0){
              self.userList=res.resp.rookieList.objectList;
            }else{
              self.userList.splice(0,self.userList.length)
            }
            self.currentPage = self.data.pageIndex;
            self.countNum = res.resp.rookieList.countNum;
            self.pagesCount = res.resp.rookieList.pagination;
            initPagination(self);
          }
        })
      },
      jumpPage(page){
        this.data.pageIndex=page;
        this.getList();
      },
      search(){
        if(this.spaceName!==''){
          this.data.spaceName=this.spaceName;
        }else{
          delete this.data.spaceName;
        }
        if(this.spaceId!==''){
          this.data.spaceNum=this.spaceId;
        }else{
          delete this.data.spaceNum;
        }
        if(this.live!=='2'){
          this.data.isLive=this.live;
        }else{
          delete this.data.isLive;
        }
        if(this.code!=='0'){
          this.data.classifyId=this.code;
        }else{
          delete this.data.classifyId;
        }
        if(this.phone!==''){
          this.data.spacePhone=this.phone;
        }else{
          delete this.data.spacePhone;
        }
        if(this.beginTime!==''){
          this.data.beginTime=new Date(this.beginTime).getTime();
        }else{
          delete this.data.beginTime;
        }
        if(this.endTime!==''){
          this.data.endTime=new Date(this.endTime).getTime();
        }
        this.getList()
      },
      showDetail(item){
        this.detailBox=true;
        this.activeUser=item;
      },
      showDel(item){
        this.actionBox=true;
        this.delId=item.usersDomain.spaceId;
      },
      del(item){
        let self=this;
        $.ajax({
          type:'post',
          url:'/tvmanager/user/removeRookie',
          data:{
            spaceId:self.delId
          },
          success:function (res) {
            if(res.code==20000){
              alert('成功')
              self.actionBox=false;
              self.getList()
            }
          }
        })
      },
      scoreChange(item,e){
        let self=this;
        let score=e.target.value;
        $.ajax({
          url:'/tvmanager/user/updateRookieScore',
          type:'post',
          data:{
            spaceId:item.spspaceInfoDomain.spaceId,
            score:score
          },
          success:function (res) {
            if(res.code==20000){
              alert('成功')
              self.getList();
            }
          }
        })
      }
    },
    mounted(){
      let self=this;
      this.$nextTick(function () {
        self.getList();
        $.ajax({
          type:"get",
          data:{
            pageSize:100,
            pageIndex:1,
            parentCode:0
          },
          url:"/tvmanager/product/productCategoryList",
          success:function(data){
            console.log(data)
            self.codeList=data.resp.productCategoryList.objectList;
          }
        });
      })
    }
  });
  initPagination = require("./pagination.js");
}
module.exports = {
  init: initialize
}
