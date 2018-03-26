function initProIntro(){
	window.onscroll = function(){
		var scrollTop = $(document).scrollTop();
		if( scrollTop >343){
			$('.sideNav').show();
			if(scrollTop < 726){
				$('.sideNav .active').removeClass('active');
				$('.sideNav li:eq(0)').addClass("active");
			}
			if(scrollTop>=726 & scrollTop <1108){
				$('.sideNav .active').removeClass('active');
				$('.sideNav li:eq(1)').addClass("active");
			}
			if(scrollTop>=1108 & scrollTop <1494){
				$('.sideNav .active').removeClass('active');
				$('.sideNav li:eq(2)').addClass("active");
			}
			if(scrollTop>=1494 & scrollTop <1883){
				$('.sideNav .active').removeClass('active');
				$('.sideNav li:eq(3)').addClass("active");
			}
			if(scrollTop>=1883 & scrollTop <1986){
				$('.sideNav .active').removeClass('active');
				$('.sideNav li:eq(4)').addClass("active");
			}
			if(scrollTop>=1986){
				$('.sideNav .active').removeClass('active');
				$('.sideNav li:eq(5)').addClass("active");
			}
		}else{
			$('.sideNav').hide();
		}
	}
	$('.sideNav li').click(function(){
		var index = $(this).index();
		switch(index){
			case 0:$('html,body').animate({scrollTop:344});break;
			case 1:$('html,body').animate({scrollTop:726});break;
			case 2:$('html,body').animate({scrollTop:1108});break;
			case 3:$('html,body').animate({scrollTop:1494});break;
			case 4:$('html,body').animate({scrollTop:1883});break;
			case 5:$('html,body').animate({scrollTop:1986});break;
		}
	});
}
module.exports = initProIntro;