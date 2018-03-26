var icon1 = [];
var icon2 = [];
var gif = [];
icon1.push(require('../img/commodity_management.png'));
icon1.push(require('../img/camera.png'));
icon1.push(require('../img/shop_to_edit.png'));
icon1.push(require('../img/shop.png'));
icon1.push(require('../img/live.png'));
icon1.push(require('../img/vr.png'));
icon1.push(require('../img/interactive.png'));
icon1.push(require('../img/order.png'));

icon2.push(require('../img/pre_commodity_management.png'));
icon2.push(require('../img/pre_camera.png'));
icon2.push(require('../img/pre_shop_to_edit.png'));
icon2.push(require('../img/pre_shop.png'));
icon2.push(require('../img/pre_live.png'));
icon2.push(require('../img/pre_vr.png'));
icon2.push(require('../img/pre_interactive.png'));
icon2.push(require('../img/pre_order.png'));

gif.push(require('../img/gif/gif_1.gif'));
gif.push(require('../img/gif/gif_2.gif'));
gif.push(require('../img/gif/gif_3.gif'));
gif.push(require('../img/gif/gif_4.gif'));
gif.push(require('../img/gif/gif_5.gif'));
gif.push(require('../img/gif/gif_6.gif'));
gif.push(require('../img/gif/gif_7.gif'));
gif.push(require('../img/gif/gif_8.gif'));

function initIcon(){
	var index = $('.b_gif').index($('.prev'));
	$('.b_gif').eq(index).children('img').attr('src',icon2[index]);
}
function initUIShow(){
	$('.b_gif').mouseenter(function(){
		initIcon();
		var index = $('.b_gif').index(this) ;
		$('.prev').removeClass('prev');
		$(this).addClass('prev');
		$(this).children('img').attr('src',icon1[index]);
		$('.gif').attr("src",gif[index]);
		$('.gif').hide();
		$('.gif')[0].onload = function(){
			$(".gif").show();
		}
		// $('.gif').hide();
		// $('.gif').eq(index).show();
	});
}
module.exports = initUIShow;