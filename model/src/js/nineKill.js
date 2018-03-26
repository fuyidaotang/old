var nineKillVue;
var initPagination;
function initialize() {
  nineKillVue = new Vue({
    el: ".nineKill",
    data: {
      spaceId:'',
      spaceName:'',
      proName:'',
      phone:'',
      tableData: [],
      pageSize:5,
      countNum: 0,
      currentPage:0,
      targetPage: 1,
      pageArray: [],
      pagesCount:0,
      checkArr:[],
      data:{},
      delBox:false,
      detailBox:false,
      para:{
        pageSize:5,
        pageIndex:1,
        eventId:3
      },
      actionList:{},
      noList:false,
      toastMsg:'',
      toastImg:'',
      imgShow:false,
      actionId:'',
      actionIndex:'',
      eventProductCategoryCode:''
    },
    methods: {
      showImg(e){
        this.toastImg=e.target.src;
        this.imgShow=true;
      },
      check(e){
        let self=this;
        if(e.target.checked){
          if(this.checkArr.indexOf(e.target.value)<0){
            this.checkArr.push(e.target.value);
          }else{
            this.checkArr.splice(this.checkArr.indexOf(e.target.value),1)
          }
        }else{
          $('#all').get()[0].checked=false;
          if(this.checkArr.indexOf(e.target.value)>=0){
            this.checkArr.splice(this.checkArr.indexOf(e.target.value),1)
          }
        }
        let boolArr=[];
        $('td input').each(function (item) {
          boolArr.push($(this).get()[0].checked)
        })
        if(boolArr.indexOf(false)>=0){
          $('#all').get()[0].checked=false;
        }else{
          $('#all').get()[0].checked=true;
        }
      },
      checkAll(e){
        let self=this;
        if(e.target.checked){
          $('td input[type=checkbox]').each(function (item) {
            $(this).get()[0].checked=true;
            if(self.checkArr.indexOf($(this).val())<0){
              self.checkArr.push($(this).val())
            }
          })
        }else{
          $('td input').each(function (item) {
            $(this).get()[0].checked=false;
          })
          self.checkArr.splice(0,self.checkArr.length)
        }
        console.log(self.checkArr)
      },
      scoreChange(e,list){
        let self=this;
        $.ajax({
          type:'post',
          url:'/tvmanager/activity/updateEventProductScore',
          data:{
            eventId:3,
            productId:list.productId,
            score:e.target.value,
            categoryId:1
          },
          success:function (res) {
            console.log(res)
            if(res.code==20000){
              self.toastMsg='分数更改成功'
              $('.toast').fadeIn(500)
              setTimeout(function () {
                $('.toast').fadeOut(500)
              },1000)
              self.getList()
            }else{
              self.toastMsg=res.msg
              $('.toast').fadeIn(500)
              setTimeout(function () {
                $('.toast').fadeOut(500)
              },1000)
            }
          }
        })
      },
      del(type){
        let self=this;
        $.ajax({
          url:'/tvmanager/activity/delEventProduct',
          type:'post',
          data:{
            eventId:3,
            productIds:self.actionId,
            categoryId:self.eventProductCategoryCode
          },success:function (res) {
            console.log(res)
            self.delBox=false;
            if(res.code==20000){
              self.getList()
              self.toastMsg='删除成功'
              $('.toast').fadeIn(500)
              $('td input[type=checkbox]').each(function (item) {
                $(this).get()[0].checked=false;
              })
              $('#all').get()[0].checked=false;
              setTimeout(function () {
                $('.toast').fadeOut(500)
                self.checkArr.splice(0,self.checkArr.length)
              },1000)
            }else{
              self.toastMsg=res.msg
              $('.toast').fadeIn(500)
              setTimeout(function () {
                $('.toast').fadeOut(500)
              },1000)
            }
          }
        })
      },
      showDel(index,list){
        this.delBox=true;
        this.actionId=list.productId;
        this.actionIndex=index;
        this.eventProductCategoryCode=list.eventProductCategoryCode
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
          }
        })
      },
    },
    mounted(){
      this.$nextTick(function () {
        let self=this;
        self.getList();
      })
    },
  });
  initPagination = require("./pagination.js");
}
module.exports = {
  init: initialize
}
