/*TMODJS:{"version":82,"md5":"387c4f9ca7714810dbc1b4ade7498e5a"}*/
template('liveShop',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,p1=$data.p1,p2=$data.p2,p3=$data.p3,prev=$data.prev,next=$data.next,videoSrcMp4=$data.videoSrcMp4,videoPlayButton=$data.videoPlayButton,productImg=$data.productImg,$out='';$out+='<div class="liveShop"> <div class="swiper-container" id="shop_banner"> <div class="swiper-wrapper"> <div class="swiper-slide red-slide"> <figure> <img src="';
$out+=$escape(p1);
$out+='"> <h2>喵小姐手工皂</h2> </figure> </div> <div class="swiper-slide blue-slide"> <figure> <img src="';
$out+=$escape(p2);
$out+='"> <h2>清风花艺店</h2> </figure> </div> <div class="swiper-slide orange-slide"> <figure> <img src="';
$out+=$escape(p3);
$out+='"> <h2>朵拉茶具店</h2> </figure> </div> </div> <div class="swiper-button-prev"> <img src="';
$out+=$escape(prev);
$out+='"> </div> <div class="swiper-button-next"> <img src="';
$out+=$escape(next);
$out+='"> </div> </div> <div id="jumpDiv"> <div class="close">×</div> <h1>清风花艺店</h1> <div id="iscrollContainer"> <article id="iscroll"> <section>用户知悉并同意：个人隐私信息是指能够对用户进行个人辨识或涉及个人通信的信息，包括用户真实姓名、身份证号、手机号码、银行账户、IP地址等。非个人隐私信息是指用户对本服务的操作状态以及使用习惯等一些明确且客观反映在红豆角服务器端的基本记录信息和其他一切个人隐私信息范围外的普通信息，以及用户同意公开的上述隐私信息。</section> <div class="videoContainer"> <div class="controllVideo"> <video class="video" preload="none" width="600" height="340"> <source src="';
$out+=$escape(videoSrcMp4);
$out+='" type=\'video/mp4\'> </video> <figure> <img class="livePlay" src="';
$out+=$escape(videoPlayButton);
$out+='"> </figure> </div> </div> <section>红豆角尊重用户个人隐私信息的私有性，红豆角将会采取合理的措施保护用户的个人隐私信息，除法律或有法律赋予权限的政府部门要求或用户同意等原因外，红豆角未经用户同意不向除合作单位以外的第三方公开、透露用户个人隐私信息。</section> <section>用户在注册时选择同意，或用户与红豆角及合作单位之间就用户个人隐私信息公开或使用另有约定的除外，用户应自行承担因此可能产生的任何风险红豆角对此不承担责任。</section> <section>为了运营和改善红豆角的技术和服务，便于红豆角向用户提供更好的用户体验和提高红豆角的服务质量，红豆角将可能会自行收集使用或向第三方提供用户的非个人隐私信息。</section> <img src="';
$out+=$escape(productImg);
$out+='"> <section>用户在注册时选择同意，或用户与红豆角及合作单位之间就用户个人隐私信息公开或使用另有约定的除外，用户应自行承担因此可能产生的任何风险红豆角对此不承担责任。</section> <section>为了运营和改善红豆角的技术和服务，便于红豆角向用户提供更好的用户体验和提高红豆角的服务质量，红豆角将可能会自行收集使用或向第三方提供用户的非个人隐私信息。</section> </article> </div> </div> </div> <div id="vague"></div> ';
return new String($out);
});