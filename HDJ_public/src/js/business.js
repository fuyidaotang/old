function initBusiness(){
	$('#userInfo_sub').click(function(){
		var para = $('#userInfo').serializeArray();
		console.log(para);
		$.ajax({
			type: "POST",
			url: "http://115.239.231.162/webSite/web/index.do",
  			// crossDomain:true,
  			data: para,
  			success:function(data){
  				console.log(data);
  			}
		});
	});
}

module.exports = initBusiness;