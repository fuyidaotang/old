/*TMODJS:{"version":23,"md5":"880ff4531b98db9dea81f1b87af558d7"}*/
template('linkUs',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,company_address=$data.company_address,map=$data.map,contacat_information=$data.contacat_information,telephone=$data.telephone,QQ=$data.QQ,e_mail=$data.e_mail,$out='';$out+='<div class="link"> <figure class="banner"> </figure> <div class="comm-container"> <img src="';
$out+=$escape(company_address);
$out+='" alt=""> <img src="';
$out+=$escape(map);
$out+='" alt=""> </div> <section> <div class="comm-container"> <img src="';
$out+=$escape(contacat_information);
$out+='" alt=""> <figure> <img src="';
$out+=$escape(telephone);
$out+='"> <img src="';
$out+=$escape(QQ);
$out+='"> <img src="';
$out+=$escape(e_mail);
$out+='"> </figure> </div> </section> </div> ';
return new String($out);
});