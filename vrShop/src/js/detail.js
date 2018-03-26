var Masonry = require('masonry-layout');
var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
var modName;
var msnry;
var mySwiper;
var top;
var detailVue;
var detailParam;
var picErrorCount = 0;
var proPara = {};
function initialize(param) {
    detailParam = param;
    detailParam.id = GetRequest()['proId'];
    if(!detailParam.id){
        location.href = "#index";
    }
    $("title").html(sessionStorage.getItem("spaceName"));
    $("footer").hide();
    modName = param.modName;
    detailVue = new Vue({
        el: "#detail",
        data: {
            productInventory: 0,
            productTitle: "",
            productFreight: 0,
            productDesc: "",
            productPrice: 0,
            bannerPics: [],
            proList: [],
            proDetail: {},
            productImage: '',
            //评论
            score: 0,
            countNum: 0,
            commentList: [],
            count: 1
        },
        methods: {
            chooseSize: function(size) {
                if(this.proDetail.sizes){
                    for (var i = 0; i < this.proDetail.sizes.length; i++) {
                        this.proDetail.sizes[i].isActive = false;
                    }
                }
                size.isActive = true;
                this.proDetail.proPrice = size.proPrice;
                this.proDetail.proImg = size.proImg;
                this.proDetail.productInventory = size.productInventory;
                this.proDetail.sizeContent = size.content;
                proPara.inventoryId = size.inventoryId;
                proPara.sizeContent = size.content;
            },
            reduce: function() {
                this.count--;
                if (this.count < 1) {
                    this.count = 1;
                }
            },
            plus: function() {
                this.count++;
                if (this.count > this.proDetail.productInventory) {
                    this.count = this.proDetail.productInventory;
                }
            },
            suit: function() {
                if (this.count < 1) {
                    this.count = 1;
                }
                if (this.count > this.proDetail.productInventory) {
                    this.count = this.proDetail.productInventory;
                }
                if (!/^\d+$/.exec(this.count)) {
                    this.count = 1;
                }
            },
            goDetail: function(id) {
                location.href = "?spaceNum="+detailParam.spaceNum+"&proId="+id+"#detail";
            }
        }
    });
    $('.swiper-container').width("7.5rem");
    $('.swiper-container').height("7.5rem");
    //获取导航条与顶部距离
    top = $('#detail .section_2').offset().top;
    msnry = new Masonry('#masonry', {
        itemSelector: '.box',
        isAnimated: true,
    });
    getProduct();
    getCommenList();
    addEvent();
}

function reload() {
    if (modName == 'detail') {
        msnry.reloadItems();
        mySwiper.update();
    } else {
        window.removeEventListener(resizeEvt, reload, false);
    }
}

function addEvent() {
    window.addEventListener(resizeEvt, reload, false);
    $(window).scroll(function() {
        if ($(this).scrollTop() >= top) {
            $('#detail .section_2').css({
                "position": "fixed",
                "top": 0,
                "left": 0,
                "z-index": 20
            });
            $("#detail .replace").show();
        } else {
            $('#detail .section_2').css({
                "position": "static",
                "top": 0,
                "left": 0
            });
            $("#detail .replace").hide();
        }
    });
    //商品图文与评论切换
    $('#detail .section_2 li').click(function() {
        $('#detail .section_2 .active').removeClass("active");
        $(this).addClass("active");
        if ($(this).index() == 0) {
            if (!$('#detail .section_4').hasClass("hidden")) {
                $('#detail .section_4').addClass("hidden");
            }
            $('#detail .section_3').removeClass("hidden");
        } else {
            if (!$('#detail .section_3').hasClass("hidden")) {
                $('#detail .section_3').addClass("hidden");
            }
            $('#detail .section_4').removeClass("hidden");
        }
    });
    //回到首页
    $(".shop_index").click(function() {
        location.href = "#index";
    });
    //弹出购买层
    $(".buy").click(function() {
        $(".chooseSize.hidden").removeClass("hidden");
    });
    //规格选择时间
    $("#sizes li").click(function() {
        $("#sizes .active").removeClass("active");
        $(this).addClass("active");
    });
    //关闭弹出层
    $('#pro_detail .close').click(function() {
        $('#pro_detail').addClass("hidden");
    });
    //跳到确认页
    var flag = true;
    $(".goConfirm").click(function() {
        if (flag) {
            flag = false;
            if ($('#sizes .active').length == 0) {
                $('#alertMes2 span').html("请选择规格");
                $('#alertMes2').show();
                $('#alertMes2 span').animate({
                    "opacity": 1
                }, 500);
                setTimeout(function() {
                    $('#alertMes2 span').animate({
                        "opacity": 0
                    }, 500, function() {
                        $('#alertMes2').hide();
                        flag = true;
                    });
                }, 300);
            } else {
                flag = true;
                proPara.productnum = detailVue.count;
                proPara.productInventory = detailVue.productInventory;
                proPara.spaceName = $("title")[0].innerHTML;
                sessionStorage.setItem("proPara", JSON.stringify(proPara));
                location.href = "#confirmOrder";
            }
        }
    });
}

function getCommenList() {
    var data = {};
    data.productId = detailParam.id;
    data.pageIndex = "1";
    data.pageSize = "8";
    $.ajax({
        type: "post",
        data: data,
        url: "http://wap.hongdoujiao.tv/wap/comment/list.do",
        success: function(data) {
            data = JSON.parse(data);
            detailVue.countNum = data.resp.page.countNum;
            if (!data.resp.page.countNum || data.resp.page.countNum == 0) {
                $(".commen_list").hide();
                $(".noComment").show();
            } else {
                $(".commen_list").show();
                $(".noComment").hide();
                var commemtList = data.resp.productCompleteinfo.commentInfo.productCommentInfo;
                var allCount = 0;
                if(commemtList){
                    for (var i = 0; i < commemtList.length; i++) {
                        for (var j = 0; j < commemtList[i].SpareParameter.length; j++) {
                            if (commemtList[i].SpareParameter[j].key == "headPath") {
                                commemtList[i].headPath = commemtList[i].SpareParameter[j].value;
                            }
                            if (commemtList[i].SpareParameter[j].key == "username") {
                                commemtList[i].username = commemtList[i].SpareParameter[j].value;
                            }
                        }
                        commemtList[i].commentTime = getDateDiff(commemtList[i].commentTime);
                        allCount += commemtList[i].commentScore;
                    }
                    detailVue.score = (allCount / commemtList.length).toFixed(1);
                }
                for (var i = 0; i < detailVue.score; i++) {
                    var x = detailVue.score - i;
                    var y;
                    if (x > 1) {
                        y = 1;
                        var imgWidth = y * 0.3 + "rem";
                        $('.pre_score .light').eq(i).css("width", imgWidth);
                    } else {
                        y = x;
                        var imgWidth = y * 0.3 + "rem";
                        $('.pre_score .light').eq(i).css("width", imgWidth);
                    }
                }
                detailVue.commentList = commemtList;
            }
        }
    });
}

function getProduct() {
    var data = { 'spaceId': detailParam.spaceId, "productId": detailParam.id, "userId": detailParam.userId };
    $.ajax({
        type: "POST",
        url: "http://wap.hongdoujiao.tv/wap/product/getProduct.do",
        data: data,
        success: function(json) {
            var proDetail = {};
            json = JSON.parse(json);
            console.log(json);
            //banner图
            var bannerPics = json.resp.productpic.productPictureinfo;
            // proLoadImg(bannerPics);
            detailVue.bannerPics = bannerPics;
            //商品基本信息
            detailVue.productPrice = json.resp.productInfo.productPrice.toFixed(2);
            detailVue.productTitle = json.resp.productInfo.productName;
            detailVue.productFreight = json.resp.productInfo.productFreight ? json.resp.productInfo.productFreight.toFixed(2) : 0;
            detailVue.productDesc = json.resp.productInfo.productDesc;
            detailVue.productImage = json.resp.productInfo.productImage.replace("thum", "icon");
            for(var i=0;i<json.resp.productInfo.SpareParameter.length;i++){
                if(json.resp.productInfo.SpareParameter[i].key == "productInventories"){
                    detailVue.productInventory = json.resp.productInfo.SpareParameter[i].value;
                    break;
                }
            }
            //参数
            proPara.productPrice = detailVue.productPrice;
            proPara.productTitle = detailVue.productTitle;
            proPara.productFreight = detailVue.productFreight;
            proPara.productImage = detailVue.productImage;
            //推荐产品
            var proList = json.resp.productInfo.productInfoList;
            if(proList){
                for (var i = 0; i < proList.length; i++) {
                    proList[i].productImage = proList[i].productImage.replace("thum", "icon");
                }
            }
            detailVue.proList = proList;
            Vue.nextTick(function() {
                addErrorEvent($('.detail img'));
                // $('.detail-swiper-container .bannerPic').hide();
                // $('.detail-swiper-container .loading').show();
                if (mySwiper) {
                    mySwiper.destroy();
                }
                mySwiper = new Swiper('.detail-swiper-container', {
                    loop: true,
                    autoplay: 5000,
                    autoplayDisableOnInteraction: false,
                    initialSlide: 0,
                    speed:600,
                    pagination: '.detail-swiper-container .swiper-pagination'
                });
                masonry = new Masonry('#masonry', {
                        itemSelector: '.box',
                        isAnimated: true,
                    });
                // $('.detail-swiper-container .bannerPic').load(function() {
                //     $(this).siblings(".loading").hide();
                //     $(this).show();
                // });
                $('.box img').load(function() {
                    masonry = new Masonry('#masonry', {
                        itemSelector: '.box',
                        isAnimated: true,
                    });
                });
                $(window).scrollTop(0);
            });
            //规格库存
            proDetail.sizeContent = "请选择规格";
            var incomoleteInfoList = json.resp.inventorycompleteInfo.incomoleteInfoList;
            var length = 0;
            if(incomoleteInfoList){
                 length = incomoleteInfoList.length;
             }
            proDetail.sizes = [];
            proDetail.allInventory = 0;
            proDetail.proPrice = json.resp.productInfo.productPrice.toFixed(2);
            for (var i = 0; i < length; i++) {
                var size = {};
                var inskuInfoList = incomoleteInfoList[i].inskuInfo.inskuInfoList;
                var content = inskuInfoList[0].optionalName;
                for (var j = 1; j < inskuInfoList.length; j++) {
                    content += " ";
                    content += inskuInfoList[j].optionalName;
                }
                size.content = content;
                size.inventoryId = incomoleteInfoList[i].inventory.inventoryId;
                size.productInventory = incomoleteInfoList[i].inventory.productInventory;
                size.proPrice = incomoleteInfoList[i].inventory.productPrice;
                size.isActive = false;
                proDetail.allInventory += parseInt(size.productInventory);
                proDetail.productInventory = proDetail.allInventory;
                proDetail.sizes.push(size);
            }
            detailVue.proDetail = proDetail;
        }
    });
}

function getDateDiff(dateStr) {
    var publishTime = dateStr / 1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime() / 1000),
        d,

        date = new Date(publishTime * 1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    //小于10的在前面补0
    if (M < 10) {
        M = '0' + M;
    }
    if (D < 10) {
        D = '0' + D;
    }
    if (H < 10) {
        H = '0' + H;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    d = timeNow - publishTime;
    d_days = parseInt(d / 86400);
    d_hours = parseInt(d / 3600);
    d_minutes = parseInt(d / 60);
    d_seconds = parseInt(d);

    if (d_days > 0 && d_days < 3) {
        return d_days + '天前';
    } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + '小时前';
    } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + '分钟前';
    } else if (d_seconds < 60) {
        if (d_seconds <= 0) {
            return '刚刚发表';
        } else {
            return d_seconds + '秒前';
        }
    } else if (d_days >= 3 && d_days < 30) {
        return M + '-' + D + '&nbsp;' + H + ':' + m;
    } else if (d_days >= 30) {
        return Y + '-' + M + '-' + D + '&nbsp;' + H + ':' + m;
    }
}

function addErrorEvent(target) {
    target.bind("error", function() {
        picErrorCount++;
        console.log(picErrorCount);
        if (picErrorCount < 20) {
            var src = $(this).attr("src");
            console.log(src);
            $(this).attr("src", src + "?" + new Date());
        } else {
            $("img").unbind("error");
            picErrorCount = 0;
        }
    });
}

function GetRequest() {
  var params = location.href.split('?')[1]; //获取url中"?"符后的字串
  let obj = {}
  strs = params.split("#")[0];
  strs = strs.split("&");
  for(var i = 0; i < strs.length; i ++) {
    obj[strs[i].split("=")[0]] = strs[i].split("=")[1];
  }
  return obj;
}

module.exports = {
    init: initialize
}
