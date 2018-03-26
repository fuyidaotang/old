var douyoushuoVue;
var initPagination;
require('../../libs/js/jquery.form.js');
function initialize() {
  douyoushuoVue = new Vue({
    el: ".douyoushuo",
    data: {
      delBox:false,
      detailBox:false,
      spaceId:'',
      spaceName:'',
      title:'',
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
      activeSpaceName:''
    },
    methods: {
      jumpPage(page){
        let self=this;
        console.log(page)
        self.data.pageIndex=page;
        self.getList();
      },
      noTop(item){
        let self=this;
        $.ajax({
          type:'post',
          url:'/tvmanager/user/doTop',
          data:{
            articleId:item.articleId
          },
          success:function (res) {
            if(res.code==20000){
              alert('成功')
              self.getList();
            }else{
              alert(res.msg)
            }
          }
        })
      },
      getList(){
        let self=this;
        $(".pic_container").removeClass("hidden");
        $.ajax({
          type:'get',
          url:'/tvmanager/user/getArticleList',
          data:self.data,
          success:function(res){
            if (res.code == 20004) {
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href = "login.html";
            }
            if(res.resp.articleList.objectList&&res.resp.articleList.objectList.length>0) {
              self.tableData = res.resp.articleList.objectList;
            }else{
              self.tableData.splice(0,self.tableData.length)
            }
            self.currentPage = self.data.pageIndex;
            self.countNum = res.resp.articleList.countNum;
            self.pagesCount = res.resp.articleList.pagination;
            initPagination(self);
            $(".pic_container").addClass("hidden");
          }
        })
      },
      search(){
        if(this.spaceId!==''){
          this.data.spaceNum=this.spaceId;
        }else{
          delete this.data.spaceNum;
        }
        if(this.spaceName!==''){
          this.data.spaceName=this.spaceName;
        }else{
          delete this.data.spaceName;
        }
        if(this.title!==''){
          this.data.articleTitle=this.title;
        }else{
          delete this.data.articleTitle;
        }
        if(this.zhiding!=='3'){
          this.data.isTop=this.zhiding;
        }else{
          delete this.data.isTop;
        }
        this.getList();
      },
      del(){
        let self=this;
        if(self.delReason==''){
          alert('请输入原因')
        }else{
          $.ajax({
            type:'post',
            url:'/tvmanager/user/delArticle',
            data:{
              articleId:self.activeData.articleId,
              delReason:self.delReason
            },
            success:function (res) {
              if(res.code==20000){
                alert('成功')
                self.delBox=false;
                self.tableData.splice(self.activeData.index,1)
                self.delReason='';
              }else{
                alert(res.msg)
              }
            }
          })
        }

      },
      showDel(id,index){
        this.activeData.articleId=id;
        this.activeData.index=index;
        this.delBox=true;
      },
      showDetail(item){
        this.picUrls=item.picUrls;
        this.articleContent=item.articleContent;
        this.articleTitle=item.articleTitle;
        this.activeSpaceName=item.spaceName;
        this.detailBox=true;
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
