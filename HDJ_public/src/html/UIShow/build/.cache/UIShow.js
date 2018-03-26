/*TMODJS:{"version":99,"md5":"66651f444773a50653be23400a0f581b"}*/
template('UIShow',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,pre_commodity_management=$data.pre_commodity_management,pre_camera=$data.pre_camera,pre_shop_to_edit=$data.pre_shop_to_edit,pre_shop=$data.pre_shop,iphone=$data.iphone,loading=$data.loading,gif_1=$data.gif_1,pre_live=$data.pre_live,pre_vr=$data.pre_vr,pre_interactive=$data.pre_interactive,pre_order=$data.pre_order,$out='';$out+='<div class="border"></div> <div class="UIShow"> <div class="comm-container"> <section> <figure> <div class="b_gif"> <img src="';
$out+=$escape(pre_commodity_management);
$out+='"> </div> <div> <h4>商品管理</h4> <span>一键式商品上下架功能,简单省时</span> </div> </figure> <figure> <div class="b_gif"> <img src="';
$out+=$escape(pre_camera);
$out+='"> </div> <div> <h4>摄像机管理</h4> <span>多端视频输入，后台管理，清晰可见</span> </div> </figure> <figure> <div class="b_gif"> <img src="';
$out+=$escape(pre_shop_to_edit);
$out+='"> </div> <div> <h4>店铺编辑</h4> <span>自定义店铺编辑菜单，个性化店铺</span> </div> </figure> <figure> <div class="b_gif"> <img src="';
$out+=$escape(pre_shop);
$out+='"> </div> <div> <h4>多彩热铺</h4> <span>品类商铺呈现，丰富多彩，夺人眼球</span> </div> </figure> </section> <section> <div class="mobile_show"> <img src="';
$out+=$escape(iphone);
$out+='"> <figure class="loading" ><img src="';
$out+=$escape(loading);
$out+='"></figure> <img class="gif" src="';
$out+=$escape(gif_1);
$out+='"> </div> </section> <section> <figure> <div class="b_gif"><img src="';
$out+=$escape(pre_live);
$out+='"></div> <div> <h4>全景直播</h4> <span>多元场景，360度无死角展现</span> </div> </figure> <figure> <div class="b_gif"><img src="';
$out+=$escape(pre_vr);
$out+='"></div> <div> <h4>VR直播</h4> <span>真实场景+VR展现，给你最真实的体验</span> </div> </figure> <figure> <div class="b_gif"><img src="';
$out+=$escape(pre_interactive);
$out+='"></div> <div> <h4>直播互动</h4> <span>线上面对面无延迟互动、聊天、打赏</span> </div> </figure> <figure> <div class="b_gif"><img src="';
$out+=$escape(pre_order);
$out+='"></div> <div> <h4>订单管理</h4> <span>包含所有电商模块，订单管理清晰明了</span> </div> </figure> </section> </div> </div>';
return new String($out);
});