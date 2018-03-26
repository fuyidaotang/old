 var docEl = document.documentElement;
 //当设备的方向变化（设备横向持或纵向持）此事件被触发。绑定此事件时，
 //注意现在当浏览器不支持orientationChange事件的时候我们绑定了resize 事件。
 //总来的来就是监听当然窗口的变化，一旦有变化就需要重新设置根字体的值
 resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
 recalc = function() {
    FastClick.attach(document.body); 
     //判断横屏,竖屏
     var tagFont = 100 * (docEl.clientWidth / 750);
     // if(docEl.clientWidth>docEl.clientHeight){
     //    //此时为横屏
     //    tagFont = 100 * (docEl.clientHeight / 750);
     // }else{
     //    tagFont = 100 * (docEl.clientWidth / 750);
     // }
     //设置根字体大小
     if (tagFont > 160) {
         docEl.style.fontSize = '160px';
     } else {
         docEl.style.fontSize = tagFont + 'px';
     }
 };
 //绑定浏览器缩放与加载时间,重设rem
 window.addEventListener(resizeEvt, recalc, false);
 document.addEventListener('DOMContentLoaded', recalc, false);
