var Masonry = require('masonry-layout');
var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
var modName;
var masonry;
var indexVue;
var indexParam;
var indexSwiper;
//导航条原top值
var top;
var picErrorCount = 0;

function initialize(param) {
    $("footer").show();
    $("#footer li.active").removeClass("active");
    $("#footer li").eq(1).addClass("active");
    indexParam = param;
    modName = param.modName;
    indexVue = new Vue({
        el: "#index",
        data: {
            shopInfo: "",
            proList: [],
            bannerPics:[]
        },
        methods:{
        	goDetail:function(id){
        		sessionStorage.setItem("proId",id);
            location.href = "?spaceNum="+indexParam.spaceNum+"&proId="+id+"#detail";
        	}
        }
    });
    $('.swiper-container').width("7.5rem");
    $('.swiper-container').height("5rem");
    top = $('#index .section_3').offset().top;
    masonry = new Masonry('#masonry', {
		        itemSelector: '.box',
		        isAnimated: true,
		    });
    //获取到产品列表后应该更新msnry
    indexParam.pageIndex = 1;
    getProList();
    getShopInfo();
    addEvent();
}

function reload() {
    if (modName == "index") {
        masonry.reloadItems();
        indexSwiper.update();
    } else {
        window.removeEventListener(resizeEvt, reload, false);
    }
}

function getProList() {
    var data = {};
    data.spaceId = indexParam.spaceId;
    data.pageIndex = indexParam.pageIndex;
    data.pageSize = "8";
    data.orderCaulse = indexParam.orderCaulse;
    $.ajax({
        type: "post",
        data: data,
        url: "http://wap.hongdoujiao.tv/wap/product/list.do",
        success: function(data) {
            data = JSON.parse(data);
            var proList = data.resp.productCompleteinfo.productInfo.productInfoList;
            if(proList){
                for(var i=0;i<proList.length;i++){
                    proList[i].productImage = proList[i].productImage.replace("thum","icon");
                }
            }
            indexVue.proList = proList;
            Vue.nextTick(function(){
            	//update没用
                     var errorCount = 0;
                     addErrorEvent($('.box img'));
            	$('.box img').load(function(){
            		masonry = new Masonry('#masonry', {
				        itemSelector: '.box',
				        isAnimated: true,
				    });
            	});
            });
        }
    });
}

function addErrorEvent(target){
    target.bind("error",function(){
        picErrorCount++;
        if(picErrorCount<20){
            var src = $(this).attr("src");
            $(this).attr("src",src+"?"+new Date());
        }else{
            $("img").unbind("error");
            picErrorCount = 0;
        }
    });
}

function getShopInfo() {
    var data = {};
    data.spaceId = indexParam.spaceId;
    data.userId = 0;
    $.ajax({
        type: "post",
        data: data,
        url: "http://wap.hongdoujiao.tv/wap/space/index.do",
        success: function(data) {
            data = JSON.parse(data);
            console.log(data)
            indexVue.shopInfo = data.resp.spaceInfo.spaceInfo;
            if(data.resp.SpaceBannerInfo.spacebanner){
                indexVue.bannerPics = data.resp.SpaceBannerInfo.spacebanner;
            }else{
                indexVue.bannerPics = [{
                    "picpath":data.resp.spaceInfo.SpareParameter[2].value
                }]
            }
            sessionStorage.setItem("spaceName",data.resp.spaceInfo.spaceName);
            sessionStorage.setItem("headPic",data.resp.spaceInfo.SpareParameter[2].value);
            $("title")[0].innerHTML = data.resp.spaceInfo.spaceName;
            Vue.nextTick(function(){
                addErrorEvent($('.bannerPic'));
                if (indexSwiper) {
                    indexSwiper.destroy();
                }
                indexSwiper = new Swiper('.detail-swiper-container', {
                    loop: true,
                    autoplay: 5000,
                    autoplayDisableOnInteraction: false,
                    initialSlide: 0,
                    speed:300,
                    pagination: '.detail-swiper-container .swiper-pagination'
                });
                // $('.detail-swiper-container .bannerPic').load(function(){
                //     $(this).siblings(".loading").hide();
                //     $(this).show();
                // });
            });
        }
    });
}

function addEvent() {
    window.addEventListener(resizeEvt, reload, false);
    $(window).scroll(function() {
        if ($(this).scrollTop() >= top) {
            $('#index .section_3').css({
                "position": "fixed",
                "top": 0,
                "left": 0,
                "z-index": 20
            });
        } else {
            $('#index .section_3').css({
                "position": "static",
                "top": 0,
                "left": 0
            });
        }
    });
    $('.index .section_3 li').click(function() {
        $('.index .section_3 .active').removeClass("active");
        $(this).addClass("active");
        switch($(this).index()){
        	case 0:indexParam.orderCaulse = "";break;
        	case 1:indexParam.orderCaulse = "price";break;
        	case 2:indexParam.orderCaulse = "time";break;
        }
        getProList();
    });
}
module.exports = {
    init: initialize
}
