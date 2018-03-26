var Detector = {

    canvas: !!window.CanvasRenderingContext2D,
    webgl: (function() {
        try {
            var canvas = document.createElement('canvas');
            return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')); } catch (e) {
            return false; } })(),
    workers: !!window.Worker,
    fileapi: window.File && window.FileReader && window.FileList && window.Blob,

    getWebGLErrorMessage: function() {

        var element = document.createElement('div');
        element.id = 'webgl-error-message';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if (!this.webgl) {

            element.innerHTML = window.WebGLRenderingContext ? [
                'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join('\n') : [
                'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
            ].join('\n');

        }

        return element;

    },

    addGetWebGLMessage: function(parameters) {

        var parent, id, element;

        parameters = parameters || {};

        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';

        element = Detector.getWebGLErrorMessage();
        element.id = id;

        parent.appendChild(element);

    }
};
function initIndex(valiant,THREE){
        // console.log(jQuery);
            valiant(jQuery, THREE, Detector, window, document);
            $('.valiantPhoto').Valiant360({
                "autoplay":false,
                "hideControls":true
            });
	$('.b_play').click(function(){
                    for(var i=0;i<$('.videoContainer').find('video').length;i++){
                        $('.videoContainer').find('video')[i].pause();
                    }
                    $('.videoContainer').find('.b_play').show();
		$(this).parents('.controllVideo').find('video')[0].play();
		$(this).hide();
	});
	$('#goTop').click(function(){
		//IE下html的滚动条,其他body的滚动条
		$('html,body').animate({
			scrollTop:0
		});
	});
	$('#index_tel').hover(function(){
		$(this).find('div').show();
	},function(){
		$(this).find('div').hide();
	});
	$('#index_code').hover(function(){
		$(this).find('div').show();
	},function(){
		$(this).find('div').hide();
	});
	var length = $('.index video').length;
	for(var a=0;a<length;a++){
		debugEvents($('.index video')[a],a);
	}
}
function debugEvents(video,index) {
    [
        'loadstart',
        'progress',
        'suspend',
        'abort',
        'error',
        'emptied',
        'stalled',
        'loadedmetadata',
        'loadeddata',
        'canplay',
        'canplaythrough',
        'playing', // fake event
        'waiting',
        'seeking',
        'seeked',
        'ended',
        // 'durationchange',
        'timeupdate',
        'play', // fake event
        'pause', // fake event
        // 'ratechange',
        // 'resize',
        // 'volumechange',
        'webkitbeginfullscreen',
        'webkitendfullscreen',
    ].forEach(function(event) {
        video.addEventListener(event, function() {
            console.info('@'+index+'++', event);
        });
    });
}
module.exports = initIndex;
