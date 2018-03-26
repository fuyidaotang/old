var initPagination;
var productQueryVue;
function initialize() {
    productQueryVue = new Vue({
        el: ".product_query",
        data: {
            productList: [],
            currentPage: 1,
            pageSize: 6,
            countNum: 0,
            pageArray: [],
            detailContent:{},
            caryCode:'0',
            productId:'',
            codeList:[],
            data:{}
        },
        computed: {
            pagesCount: function() {
                return Math.ceil(this.countNum / this.pageSize);
            },
            shopIndex: function() {
                return this.pageSize * (this.currentPage - 1) + 1;
            }
        },
        methods: {
            scoreChange(item,e){
              console.log(item)
              console.log(e.target.value)
                $.ajax({
                  type:"post",
                  data:{
                    productId:item.productId,
                    score:e.target.value
                  },
                  url:"/tvmanager/product/updateProductScore",
                  success:function(data){
                    var pageItem = {
                      count: productQueryVue.currentPage,
                      isActive: true,
                      isHidden: false
                    };
                    jumpPage(productQueryVue, pageItem,productQueryVue.data);
                  }
                });
              },
            jumpPage: function(pageItem) {
                let self=this;
                jumpPage(productQueryVue, pageItem,self.data);
            },
            showDetailDialog:function(productItem){
                sessionStorage.setItem("id",productItem.productId);
                productQueryVue.detailContent = productItem;
                $("#detail_dialog").show();
            },
            showPassDialog:function(productItem){
                sessionStorage.setItem("id",productItem.productId);
                $("#pass_dialog").show();
            }
        },//tvmanager/product/productCategoryList
        mounted(){
            let self=this;
            this.$nextTick(function () {
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
    getDefaultPage();
    addEvent();
}

function getDefaultPage() {
    //默认一页6条数据,显示第一页
    var pageItem = {
        count: 1,
        isActive: true,
        isHidden: false
    };
    jumpPage(productQueryVue, pageItem);
}

function addEvent() {
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(productQueryVue, pageItem);
    });
    $(".b_close").click(function() {
        $(this).parents(".dialog_container").hide();
    });
    $("#shop_verify_search").click(function() {
        if($("#spaceName").val()!==''){
          productQueryVue.data.spaceName = $("#spaceName").val();
        }else{
            delete productQueryVue.data.spaceName;
        }
        if($("#productName").val()!==''){
          productQueryVue.data.productName = $("#productName").val();
        }else{
            delete productQueryVue.data.productName
        }
        if($("#productStatue").val()!==''){
          productQueryVue.data.status = $("#productStatue").val();
        }else{
            delete productQueryVue.data.status
        }
        if(Date.parse($("#beginTime").val())){
          productQueryVue.data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
          productQueryVue.data.endTime = Date.parse($("#endTime").val());
        }
        if(productQueryVue.productId!==''){
          productQueryVue.data.spaceId=productQueryVue.productId;
        }else{
            delete productQueryVue.data.spaceId
        }
        if(productQueryVue.caryCode!=='0'){
          productQueryVue.data.productCategoryCode=productQueryVue.caryCode
        }else{
            delete productQueryVue.data.productCategoryCode
        }
        var pageItem = {
            count: productQueryVue.currentPage,
            isActive: true,
            isHidden: false
        };
        jumpPage(productQueryVue, pageItem,productQueryVue.data);
    });
    $("#detail_dialog .agree").click(function(){
        $("#detail_dialog").hide();
        $("#pass_dialog").show();
    });
    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.productId = sessionStorage.getItem("id");
        para.status = $("#pass_dialog input:checked").val();
        changeState(para);
    });
}

function changeState(para){
    $.ajax({
        type:"post",
        data:para,
        url:"/tvmanager/product/productUpdateStatus",
        success:function(data){
            data = JSON.parse(data);
            alert(data.msg);
            $(".dialog_container").hide();
            $("#shop_verify_search").trigger("click");
        }
    });
}

function jumpPage(vue,pageItem,para){
    var pageSize = 6;
    var pageIndex = pageItem.count;
    $.ajax({
        type:"get",
        data:para,
        url:"/tvmanager/product/productList?pageSize="+pageSize+"&pageIndex="+pageIndex,
        success:function(data){
            console.log(data);
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                vue.currentPage = pageIndex;
                vue.pageSize = pageSize;
                vue.countNum = data.resp.productList.countNum;
                vue.productList = data.resp.productList.objectList;
                initPagination(vue);
            }
        }
    });
}

module.exports = {
    init: initialize
}
