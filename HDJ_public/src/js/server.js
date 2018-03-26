var startFlag;
var startTimer;
//currentStart为-1时说明没有正在执行下拉操作的动画
var currentStart = -1;

function initServer() {
    startFlag = 0;
    $('.server section').mouseenter(function() {
        var index = $('.server section').index(this);
        if (currentStart == -1) {
            //没有下拉动画在执行
            currentStart = $('.server section').index(this);
            startAnimate(this);

        } else if (currentStart != index) {
            //终止正在执行的下拉动画,返回原来的状态,进行第二个
            var el = $('.server section')[currentStart];
            stopAnimate(el);
            stopAnimate(this);

            clearTimeout(startTimer);
            endAnimate($(el).siblings('.set_content')[0]);

            startFlag = 0;
            currentStart = $('.server section').index(this);

            startAnimate(this);
        }
    });
}

function startAnimate(el) {
    //全部动画执行完毕时flag为6,此时执行第二轮动画,开启监听
    startGo(el);

    $(el).css({
        "background": "#4BBBC0"
    });
    //大方块变小及移动,动画1
    $(el).animate({
            "width": 110,
            "height": 64,
            "margin-left": 105
        }, 500, function() {
            startFlag++;
        })
        //方块内文字字体大小变化,动画2,3(两个元素)
    $(el).children().animate({
        "font-size": 24,
        "margin-top": 0,
        "margin-bottom": 0,
        "height": 32,
        "line-height": 32
    }, function() {
        startFlag++;
    });
    //方块内文字字体大小变化,动画4
    $(el).find('span').animate({
        "font-size": 16
    }, function() {
        startFlag++;
    });
    //大方块上面长出三角形,动画5
    $(el).siblings('.top').animate({
        "border-bottom-width": 32,
        "border-left-width": 55,
        "border-right-width": 55,
        "margin-left": 105
    }, 500, function() {
        startFlag++;
    });
    //大方块下面长出三角形,动画6
    $(el).siblings('.bottom').animate({
        "border-top-width": 32,
        "border-left-width": 55,
        "border-right-width": 55,
        "margin-left": 105
    }, 500, function() {
        startFlag++;
    });
    //大方块容器距离顶部距离的变化,动画7
    $(el).parent().animate({
        "margin-top": 48
    }, 500, function() {
        startFlag++;
    });
}

function endAnimate(el) {
    $(el).animate({
        "height": 0
    }, 500, function() {
        $(el).siblings('img').hide();
        $(el).parent().css({
            "margin-bottom": 0
        });
        endAnimate2(el);
    });
}

function startAnimate2(el) {
    $(el).parent().css({
        "margin-bottom": 0
    });
    $(el).siblings('img').show();
    $(el).siblings('.set_content').animate({
        "height": 840
    }, 500, function() {
        //开始动画完全结束,进入初始状态
        startFlag = 0;
        //下拉动画结束
        currentStart = $('.server section').index(el);
    });
}

function endAnimate2(el) {
    $(el).siblings('section').animate({
        "width": 320,
        "height": 450,
        "margin-left": 0
    }, 500,function(){
        $(this).removeAttr("style");
    });
    $(el).siblings('.top').animate({
        "border-bottom-width": 0,
        "border-left-width": 160,
        "border-right-width": 160,
        "margin-left": 0
    }, 500);
    $(el).siblings('.bottom').animate({
        "border-top-width": 0,
        "border-left-width": 160,
        "border-right-width": 160,
        "margin-left": 0
    }, 500);
    $(el).parent().animate({
        "margin-top": 110
    }, 500);
    $(el).siblings('section').children().eq(1).animate({
        "font-size": 58,
        "height": 60,
        "line-height": 58
    }, 500);
    $(el).siblings('section').children().first().animate({
        "margin-top": 150,
        "margin-bottom": 50,
        "font-size": 58,
        "height": 60,
        "line-height": 58
    }, 500);
    $(el).siblings('section').find('span').animate({
        "font-size": 38
    }, 500);

}

function stopAnimate(el) {
    //停止所有开始动画
    $(el).stop();
    $(el).children().stop();
    $(el).find('span').stop();
    $(el).siblings('.top').stop();
    $(el).siblings('.bottom').stop();
    $(el).parent().stop();
    $(el).siblings('.set_content').stop();

}
//用setTimeout模拟setInterval
function startGo(el) {
    if (startFlag != 7) {
        startTimer = setTimeout(function() {
            startGo(el);
        }, 100);
    } else {
        startAnimate2(el);
    }
}


module.exports = initServer;
