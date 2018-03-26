function initLiveShop() {
    var mySwiper = new Swiper('.swiper-container', {
        centeredSlides: true,
        slidesPerView: 3,
        initialSlide: 1,
        onlyExternal: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next',
    })
    $('.swiper-button-next').click(function() {
        mySwiper.swipeNext();
    });
    $('.swiper-button-prev').click(function() {
        mySwiper.swipePrev();
    });
    // $("#shop_banner .swiper-slide img").bind('click', function(event) {
    //     event.stopPropagation();
    //     if($(this).parents('.swiper-slide').hasClass("swiper-slide-active")){
    //         $('#jumpDiv').show();
    //         $("#vague").show();
    //         myScroll.refresh();
    //     }
    // });
    // $(".livePlay").click(function(){
    //     $(this).parent().siblings("video")[0].play();
    //     $(this).parent().hide();
    // });
    // //关闭弹出窗时,暂停所有视频
    // $(".close").click(function(event){
    //     event.stopPropagation();
    //     var length = $('.video').length;
    //     for(var a=0;a<length;a++){
    //         $('.video')[a].pause();
    //     }
    //     $('#jumpDiv').hide();
    //     $("#vague").hide();
    // });
    // var myScroll = new IScroll('#iscrollContainer', { mouseWheel: true, disableMouse: true,scrollbars: 'custom',interactiveScrollbars: true });
}

module.exports = initLiveShop;