var addKillVue;
var initPagination;
function initialize() {
  addKillVue = new Vue({
    el: ".addKill",
    data: {
      spaceId:'',
      spaceName:'',
      proName:'',
      phone:'',
      tableData: [],
      pageSize:5,
      countNum: 0,
      para:{
        pageSize:5,
        pageIndex:1,
        eventId:0
      },
      currentPage:0,
      targetPage: 1,
      pageArray: [],
      pagesCount:0,
      checkArr:[],
      data:{},
      addBox:false,
      detailBox:false,
      price:'',
      actionList:{},
      noList:false,
      toastMsg:'',
      toastImg:'',
      imgShow:false,
      actionId:'',
      actionIndex:'',
      actionSpaceId:'',
      type:'2'
    },
    methods: {
      add(type){
        let self=this;
        if(self.price==''){
          self.toastMsg='金额不能为空'
          $('.toast').fadeIn(500)
          setTimeout(function () {
            $('.toast').fadeOut(500)
          },1000)
          return ;
        }
        if(type==3){
          var type1=1;
        }else{
          var type1=self.type;
        }
        $.ajax({
          url:'/tvmanager/activity/addEventProduct',
          type:'post',
          data:{
            eventId:type,
            productId:self.actionId,
            spaceId:self.actionSpaceId,
            eventPrice:self.price,
            categoryId:type1
          },
          success:function (res) {
            if(res.code==20000){
              self.toastMsg='加入成功'
              $('.toast').fadeIn(500)
              setTimeout(function () {
                $('.toast').fadeOut(500)
              },1000)
            }else{
              self.toastMsg=res.msg
              $('.toast').fadeIn(500)
              setTimeout(function () {
                $('.toast').fadeOut(500)
              },1000)
            }
            self.addBox=false;
            self.price=''
          }
        })
      },
      showAdd(index,list){
        this.addBox=true;
        this.actionId=list.productId;
        this.actionIndex=index;
        this.actionSpaceId=list.spaceId;
      },
      search(){
        if(this.phone!==''){
          this.para.spacePhone=this.phone;
        }else{
          delete this.para.spacePhone;
        }
        if(this.spaceName!==''){
          this.para.spaceName=this.spaceName;
        }else{
          delete this.para.spaceName;
        }
        if(this.proName!==''){
          this.para.productName=this.proName;
        }else {
          delete this.para.productName;
        }
        if(this.spaceId!==''){
          this.para.spaceNum=this.spaceId;
        }else{
          delete this.para.spaceNum;
        }
        this.getList();
      },
      getList(){
        let self=this;
        $(".pic_container").removeClass('hidden')
        $.ajax({
          url:'/tvmanager/activity/getDraftProductList',
          data:self.para,
          type:'get',
          success:function (res) {
            if(res.code == 20004){
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href="login.html";
            }
            console.log(res.resp)
            if(res.resp.productList.objectList && res.resp.productList.objectList.length>0){
              self.tableData=res.resp.productList.objectList;
            }else{
              self.tableData.splice(0,self.tableData.length)
              self.noList=true;
            }
            self.currentPage = self.para.pageIndex;
            self.countNum = res.resp.productList.countNum;
            self.pagesCount=res.resp.productList.pagination;
            initPagination(self);
            $(".pic_container").addClass('hidden')
          }
        })
      },
      showDetail(list){
        this.detailBox=true;
        this.actionList=list;
        console.log(list)
      },
      jumpPage(page){
        let self=this;
        self.para.pageIndex=page;
        self.getList()
      },
      showImg(e){
        this.toastImg=e.target.src;
        this.imgShow=true;
      },
    },
    mounted(){
      this.$nextTick(function () {
        let self=this;
      })
    },
  });
  initPagination = require("./pagination.js");
}
module.exports = {
  init: initialize
}
