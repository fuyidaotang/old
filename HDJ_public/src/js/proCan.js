function setVideoHeight(){
	var screenWidth = $(document).width()-18;
	console.log(screenWidth);
	var width = screenWidth/2;
	$('.videoContainer').css({
		"width":width,
		"height":parseInt(width*9/16+50)
	});
	
	window.onresize = function(){
		$('.videoContainer').removeAttr("style");
		width = $('.videoContainer').width();
		$('.videoContainer').height(parseInt(width*9/16+50));
	};
}
function initProCan(){
	setVideoHeight();
	// $('.proCan video').hover(function(){
	// 	$(this).siblings('h2').addClass('animated flipOutY');
	// 	this.play();
	// },function(){
	// 	$(this).siblings('h2').removeClass('flipOutY');
	// 	$(this).siblings('h2').addClass('animated flipInY');
	// 	this.pause();
	// });
}
module.exports = initProCan;