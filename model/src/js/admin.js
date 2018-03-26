function initialize() {
      $("#out").click(function(){
        var para = {};
        para.liveId = $.trim($("#liveId").val());
        para.type = $("#type").val();
        $.ajax({
            type:"post",
            url:"/tvmanager/live/shutdownLive",
            data:para,
            success:function(data){
                $(".dialog_container").hide();
                alert(data);
            }
        })
      });
}

module.exports = {
    init: initialize
}
