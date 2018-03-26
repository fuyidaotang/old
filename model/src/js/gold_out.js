var goldOutVue;
var initPagination;
function initialize() {
  goldOutVue = new Vue({
    el: ".gold_out",
    data: {
      delBox:false,
      detailBox:false,
      spaceName:'',
      phone:'',
      starTime:'',
      endTime:'',
      zhiding:'3',
      tableData:[],
      pageArray: [],
      currentPage:0,
      targetPage: 1,
      pageSize:6,
      delReason:'',
      data:{
        pageSize:6,
        pageIndex:1
      },
      countNum:0,
      pagesCount:0,
      activeData:{
        articleId:'',
        index:''
      },
      articleTitle:'',
      articleContent:'',
      picUrls:[],
      activeSpaceName:'',
      actionBox:false
    },
    methods: {
      refused(){
        let self=this;
        if(this.delReason==''){
          alert('请输入拒绝原因')
        }else{
          $.ajax({
            type:'post',
            url:'/tvmanager/user/refuseDepositRefund',
            data:{
              refundId:this.activeData.refundId,
              reason:this.delReason
            },
            success:function (res) {
              if(res.code===20000){
                self.getList()
                alert('成功')
                self.delBox=false;
              }else{
                alert(res.msg)
              }
            }
          })
        }
      },
      jumpPage(page){
        let self=this;
        self.data.pageIndex=page;
        self.getList();
      },
      getList(){
        let self=this;
        $(".pic_container").removeClass("hidden");
        $.ajax({
          type:'get',
          url:'/tvmanager/user/getDepositRefundList',
          data:self.data,
          success:function(res){
            if (res.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }
            if(res.resp.depositRefundList.objectList&&res.resp.depositRefundList.objectList.length>0) {
              self.tableData = res.resp.depositRefundList.objectList;
            }else{
              self.tableData.splice(0,self.tableData.length)
            }
            self.currentPage = self.data.pageIndex;
            self.countNum = res.resp.depositRefundList.countNum;
            self.pagesCount = res.resp.depositRefundList.pagination;
            initPagination(self);
            $(".pic_container").addClass("hidden");
          }
        })
      },
      search(){
        if(this.spaceName!==''){
          this.data.spaceName=this.spaceName;
        }else{
          delete this.data.spaceName;
        }
        if(this.phone!==''){
          this.data.verifyPhone=this.phone;
        }else{
          delete this.data.verifyPhone;
        }
        if(this.starTime!==''){
          this.data.startTime=new Date(this.starTime).getTime();
        }else{
          delete this.data.starTime;
        }
        if(this.endTime!==''){
          this.data.endTime=new Date(this.endTime).getTime();
        }else{
          delete this.data.endTime;
        }
        console.log(this.data)
        this.getList();
      },
      showDel(item){
        this.activeData.refundId=item.depositRefund.refundId;
        this.delBox=true;
      },
      agree(){
        let self=this;
        $.ajax({
          type:'post',
          url:'/tvmanager/user/acceptDepositRefund',
          data:{
            refundId:this.activeData.refundId
          },
          success:function (res) {
            if(res.code===20000){
              self.getList()
              alert('成功')
              self.actionBox=false;
            }else{
              alert(res.msg)
            }
          }
        })
      },
      showAgree(item){
        this.activeData.refundId=item.depositRefund.refundId;
        this.actionBox=true;
      }
    },
    mounted(){
      this.$nextTick(function () {
        let self=this;
        self.getList();
      })
    }
  });
  initPagination = require("./pagination.js");
}
module.exports = {
  init: initialize
}
