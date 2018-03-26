require("../css/idangerous.swiper.css");
require('commoncss');
require('../css/animate.css');

var defaultRoute = 'index';
var arrHeaderNav = ['liveShop', 'business', 'proIntro', 'proCan', 'UIShow', 'server'];
var arrFooterNav = ['aboutUs', 'linkUs'];
var xhrHeader;
var xhrFooter;

//入口
$(function() {
    initJianrong();
    window.onhashchange = function() {
        var modName = getModeName();
        // if(modName === "index")
        // location.reload();

        if (modName == '') {
            return;
        }

        loadHeaderFooter();

        loadHtml(modName);
    }

    var modName = getModeName();

    modName = modName || defaultRoute;

    loadHeaderFooter();

    loadHtml(modName);
})

//导入头部尾部
function loadHeaderFooter() {
    var modName = window.location.href.split('#')[1];
    modName = modName || defaultRoute;

    if (modName == 'index') {
        //加载头部
        if(xhrHeader){
            xhrHeader.abort();
        }
        if(xhrFooter){
            xhrFooter.abort();
        }
        xhrHeader = $.get("./html/head/headerIndex.html",function(data){
            $('header').html(data);
            indexMenuEventBind();
            $('.headerIndex ul li:eq(0)').addClass('active');
        });
        xhrFooter = $.get("./html/foot/footerIndex.html",function(data){
            $('footer').html(data);
            indexFooterEventBind();
        });
    } else if (arrHeaderNav.indexOf(modName) > -1) {
        //加载 头部导航页面类型 头部和尾部
        if(xhrHeader){
            xhrHeader.abort();
        }
        if(xhrFooter){
            xhrFooter.abort();
        }
        xhrHeader = $.get("./html/head/headerNavOne.html",function(data){
            $('header').html(data);
            navOneMenuBind(modName);
        });
        xhrFooter = $.get("./html/foot/footerOther.html",function(data){
            $('footer').html(data);
        });
    } else if (arrFooterNav.indexOf(modName) > -1) {
        //加载 头部导航页面类型 头部和尾部
        if(xhrHeader){
            xhrHeader.abort();
        }
        if(xhrFooter){
            xhrFooter.abort();
        }
        xhrHeader = $.get("./html/head/headerNavTwo.html",function(data){
            $('header').html(data);
            if (modName == "aboutUs") {
                $(".headerNavTwo").addClass("styleOne");
                $(".linkUs").hide();
                $(".aboutUs").show();
            }
            if (modName == "linkUs") {
                $(".headerNavTwo").addClass("styleTwo");
                $(".linkUs").show();
                $(".aboutUs").hide();
            }
            navTwoMenuBind();
        });
        xhrFooter = $.get("./html/foot/footerOther.html",function(data){
            $('footer').html(data);
        });
    }
}

//主页面导入
function loadHtml(modName) {
    switch (modName) {
        case 'index':
            {
                require.ensure([], function() {
                    var data = {};
                    //load图片视频资源
                    data.bannerSrc = require('../img/index-banner.jpg');
                    data.lightSrc = require('../img/light.png');
                    data.mobileSrc = require('../img/mobile.png');
                    data.videoPlayButton = require('../img/bPlay.png');
                    data.qq = require('../img/qq_index.png');
                    data.tel = require('../img/telephone_index.png');
                    data.code = require('../img/Qr-_code.png');
                    data.red_beans = require('../img/red_beans.png');
                    data.post1 = require('../img/home_picture1.png');
                    data.post2 = require('../img/home_picture2.png');
                    data.post3 = require('../img/home_picture3.png');
                    //tmod模块导入
                    var html = require('../html/index/build/index.js')("index", data);
                    //引用当前页面Js
                    var valiant = require('../js/valiant.js');
                    initIndex = require("../js/index.js");
                    //这一步开始加载资源
                    $(".container").html(html);
                    showContent();
                    initIndex(valiant,THREE);
                }, 'index');
                break;
            };
        case 'proIntro':
            {
                require.ensure([], function() {
                    var data = {};
                    //load图片视频资源
                    data.zbds = require('../img/zbds.png');
                    data.dddr = require('../img/dddr.png');
                    data.zctg = require('../img/zctg.png');
                    data.hydf = require('../img/hydf.png');
                    data.xspm = require('../img/xspm.png');
                    data.lydb = require('../img/lydb.png');
                    //tmod模块导入
                    var html = require('../html/proIntro/build/proIntro.js')("proIntro", data);
                    $(".container").html(html);
                    showContent();
                    //引用当前页面Js
                    var initProIntro = require("../js/proIntro.js");
                    initProIntro();
                }, 'proIntro');
                break;
            };
        case 'business':
            {
                require.ensure([], function() {
                    var data = {};
                    //load图片视频资源
                    data.bannerSrc = require('../img/business-banner.jpg');
                    data.business_and_service = require('../img/business_and_service.png');
                    data.channel_operation = require('../img/channel_operation.png');
                    data.partners = require('../img/partners.png');
                    data.companies_and_individuals = require('../img/companies_and_individuals.png');
                    data.credit_and_image = require('../img/credit_and_image.png');
                    data.idea_and_pattern = require('../img/idea_and_pattern.png');
                    data.rules_and_regulations = require('../img/rules_and_regulations.png');
                    data.satisfaction = require('../img/satisfaction.png');
                    data.qualification = require('../img/qualification.png');
                    data.cooperation_contract = require('../img/cooperation_contract.png');
                    data.official_partner = require('../img/official_partner.png');
                    data.data_support = require('../img/data_support.png');
                    data.marketing_activities_support = require('../img/marketing_activities_support.png');
                    data.media_publicity = require('../img/media_publicity.png');
                    data.technical_support = require('../img/technical_support');
                    data.fill_out_the_form = require('../img/fill_out_the_form.png');
                    //tmod模块导入
                    var html = require('../html/business/build/business.js')("business", data);
                    $(".container").html(html);
                    showContent();
                    //引用当前页面Js
                    var initBusiness = require("../js/business.js");
                    initBusiness();
                }, 'business');
                break;
            }
        case 'liveShop':
            {
                require.ensure([], function() {
                    var data = {};
                    //load图片视频资源
                    data.p1 = require('../img/p1.png');
                    data.p2 = require('../img/p2.png');
                    data.p3 = require('../img/p3.png');
                    data.prev = require('../img/left_arrow.png');
                    data.next = require('../img/right_arrow.png');
                    data.videoSrcMp4 = require('../video/video.mp4');
                    data.videoSrcOgv = require('../video/video.ogv');
                    data.videoPlayButton = require('../img/bPlay.png');
                    data.productImg = require('../img/productImg.png');
                    //tmod模块导入
                    var html = require('../html/liveShop/build/liveShop.js')("liveShop", data);
                    $(".container").html(html);
                    showContent();
                    //引用当前页面Js,并执行一些初始化函数
                    var init = require("../js/liveShop.js");
                    init();
                }, 'liveShop');
                break;
            }
        case 'aboutUs':
            {
                require.ensure([], function() {
                    var data = {};
                    //tmod模块导入
                    data.p1 = require('../img/about_us_p1.png');
                    data.p2 = require('../img/about_us_p2.png');
                    data.p3 = require('../img/about_us_p3.png');
                    data.p4 = require('../img/about_us_p4.png');
                    data.p5 = require('../img/about_us_p5.png');
                    var html = require('../html/aboutUs/build/aboutUs.js')("aboutUs", data);
                    $(".container").html(html);
                    showContent();
                    //引用当前页面Js,并执行一些初始化函数
                    require("../js/aboutUs.js");
                }, 'aboutUs');
                break;
            }
        case 'linkUs':
            {
                require.ensure([], function() {
                    var data = {};
                    //tmod模块导入
                    data.company_address = require('../img/company_address.png');
                    data.contacat_information = require('../img/contacat_information.png');
                    data.e_mail = require('../img/e_mail.png');
                    data.map = require('../img/map.png');
                    data.QQ = require('../img/QQ.png');
                    data.telephone = require('../img/telephone.png');
                    var html = require('../html/linkUs/build/linkUs.js')("linkUs", data);
                    $(".container").html(html);
                    showContent();
                    //引用当前页面Js,并执行一些初始化函数
                    require("../js/linkUs.js");
                }, 'linkUs');
                break;
            }
        case 'proCan':
            {
                require.ensure([], function() {
                    var data = {};
                    data.video1 = require('../video/video.mp4');
                    data.video_poster_1 = require('../img/product_picture1.png');
                    data.video_poster_2 = require('../img/product_picture2.png');
                    data.video_poster_3 = require('../img/product_picture3.png');
                    data.video_poster_4 = require('../img/product_picture4.png');
                    data.video_poster_5 = require('../img/product_picture5.png');
                    data.video_poster_6 = require('../img/product_picture6.png');
                    data.video_poster_7 = require('../img/product_picture7.png');
                    data.video_poster_8 = require('../img/product_picture8.png');
                    data.video_poster_9 = require('../img/product_picture9.png');
                    data.video_poster_10 = require('../img/product_picture10.png');
                    data.video_poster_11 = require('../img/product_picture11.png');
                    data.video_poster_12 = require('../img/product_picture12.png');
                    //tmod模块导入
                    var html = require('../html/proCan/build/proCan.js')("proCan", data);
                    $(".container").html(html);
                    showContent();
                    //引用当前页面Js,并执行一些初始化函数
                    var initProCan = require("../js/proCan.js");
                    initProCan();
                }, 'proCan');
                break;
            }
        case 'UIShow':
            {
                require.ensure([], function() {
                    var data = {};
                    data.pre_commodity_management = require('../img/pre_commodity_management.png');
                    data.pre_camera = require('../img/pre_camera.png');
                    data.pre_shop_to_edit = require('../img/pre_shop_to_edit.png');
                    data.pre_shop = require('../img/pre_shop.png');
                    data.pre_live = require('../img/pre_live.png');
                    data.pre_vr = require('../img/pre_vr.png');
                    data.pre_interactive = require('../img/pre_interactive.png');
                    data.pre_order = require('../img/pre_order.png');
                    data.iphone = require('../img/iPhone.png');
                    data.gif_1 = require('../img/gif/gif_1.gif');
                    data.gif_2 = require('../img/gif/gif_2.gif');
                    data.gif_3 = require('../img/gif/gif_3.gif');
                    data.gif_4 = require('../img/gif/gif_4.gif');
                    data.gif_5 = require('../img/gif/gif_5.gif');
                    data.gif_6 = require('../img/gif/gif_6.gif');
                    data.gif_7 = require('../img/gif/gif_7.gif');
                    data.gif_8 = require('../img/gif/gif_8.gif');
                    data.loading = require('../img/loading2.jpg');
                    //tmod模块导入
                    var html = require('../html/UIShow/build/UIShow.js')("UIShow", data);
                    $(".container").html(html);
                    showContent();
                    var initUIShow = require("../js/UIShow.js");
                    initUIShow();
                },'UIShow');
                break;
            }
        case 'server':
            {
                require.ensure([], function() {
                    var data = {};
                    data.stroke = require('../img/stroke.png');
                    data.checked = require('../img/checked.png');
                    data.unchecked = require('../img/unchecked.png');
                    
                    //tmod模块导入
                    var html = require('../html/server/build/server.js')("server", data);
                    $(".container").html(html);
                    showContent();
                    var initServer = require("../js/server.js");
                    initServer();
                },'server');
                break;
            }
    }
}

//菜单事件绑定
function indexMenuEventBind() {
    initAnimate();
    $('.headerIndex ul li:gt(1)').hover(function() {
        $(this).addClass('animated pulse');
        $(this).css('animation-duration', '.5s');
        if ($('#proNav').css('display') == "block") {
            $('#product').removeClass('animated pulse');
        }
    }, function() {
        $(this).removeClass('animated pulse');
    });
}

function navOneMenuBind(modName) {
    //动画效果初始化
    initAnimate();
    $('.headerNavOne ul li').hover(function() {
        if(!$(this).hasClass('active')){
            $(this).addClass('animated pulse');
            $(this).css('animation-duration', '.5s');
            if ($('#proNav').css('display') == "block") {
                $('#product').removeClass('animated pulse');
            }
        }
    }, function() {
        $(this).removeClass('animated pulse');
    });
    //设置产品选中项高亮
    setProductActive(modName);
}

function navTwoMenuBind() {
    initAnimate();
    $('.headerNavTwo ul li').hover(function() {
        if(!$(this).hasClass('active')){
            $(this).addClass('animated pulse');
            $(this).css('animation-duration', '.5s');
            if ($('#proNav').css('display') == "block") {
                $('#product').removeClass('animated pulse');
            }
        }
    }, function() {
        $(this).removeClass('animated pulse');
    });
}

//通用方法
//获取模块名
function getModeName() {
    var modName = window.location.href.split('#')[1];
    return modName;
}

//设置产品选中项高亮
function setProductActive(modName) {
    $('#proNav').hide();
    $('.headerNavOne ul li.active').removeClass('active');
    switch (modName) {
        case 'proIntro':
            $('.headerNavOne ul li:eq(1)').addClass('active');
            $('#proNav dl dd:eq(0)').addClass('active');
            break;
        case 'UIShow':
            $('.headerNavOne ul li:eq(1)').addClass('active');
            $('#proNav dl dd:eq(1)').addClass('active');
            break;
        case 'proCan':
            $('.headerNavOne ul li:eq(1)').addClass('active');
            $('#proNav dl dd:eq(2)').addClass('active');
            break;
        case 'liveShop':
            $('.headerNavOne ul li:eq(2)').addClass('active');
            break;
        case 'server':
            $('.headerNavOne ul li:eq(3)').addClass('active');
            break;
        case 'business':
            $('.headerNavOne ul li:eq(4)').addClass('active');
            break;
    }
}

//下拉列表
function initAnimate(){
    var timer;
    var flagStart = true;
    var flagEnd = false;
    $('#product').hover(function() {
        $('#proNav').stop();
        $('#proNav').show();
        clearTimeout(timer);
        $('#proNav').animate({
            "opacity": "1",
            "height": "150px"
        },function(){
            flagEnd = true;
        });
    }, function() {
        $('#proNav').stop();
        $('#proNav').animate({
                "opacity": "0",
                "height": "0"
            }, function() {
                flagEnd = true;
                flagStart = true;
                $('#proNav').hide();
            });
    });
}

//兼容IE8
function initJianrong(){
    //ie8 indexOf方法
    if (!Array.prototype.indexOf)
    {
      Array.prototype.indexOf = function(elt /*, from*/)
      {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
          from += len;
        for (; from < len; from++)
        {
          if (from in this &&
              this[from] === elt)
            return from;
        }
        return -1;
      };
    }
}

function showContent(){
    var header = document.getElementById("header");
    var container = document.getElementById("container");
    var footer = document.getElementById("footer");
    var loading = document.getElementById("loading");
    loading.style.display ="none";
    header.style.display = 'block';
    container.style.display = 'block';
    footer.style.display = 'block';
}

function indexFooterEventBind(){
   $("#jumpPro").click(function(){
            $('#jumpDiv').show();
            $("#vague").show();
            var myScroll = new IScroll('#iscrollContainer', { mouseWheel: true, disableMouse: true,scrollbars: 'custom',interactiveScrollbars: true });
            $(".close").click(function(event){
                event.stopPropagation();
                $('#jumpDiv').hide();
                $("#vague").hide();
            });
   });
};
