var versionManagerVue;
function initialize() {
    clearForm();
    versionManagerVue = new Vue({
        el: ".version_manager",
        data: {
            versionList: []
        },
        methods: {
            showDetailDialog:function(versionItem){
                sessionStorage.setItem("id",versionItem.versionId);
                $("#version").val(versionItem.version);
                $("#downloadUrl").val(versionItem.downloadUrl);
                $("#updateContent").val(versionItem.updateContent);
                $("#isUpdate").val(versionItem.isUpdate);
                $("#appenv").val(versionItem.appenv);
                $("#detail_dialog").show();
            },
            showPassDialog:function(versionItem){
                sessionStorage.setItem("id",versionItem.versionId);
                $("#pass_dialog").show();
            }
        }
    });
    getVersionList();
    addEvent();
}

function addEvent() {
    $(".b_close").click(function() {
        clearForm();
        $(this).parents(".dialog_container").hide();
    });

    $(".add_button").click(function(){
        $("#detail_dialog").show();
    });

    $("#detail_dialog .agree").click(function(){
        var para = {};
        para.version = $.trim($("#version").val());
        if(para.version ==""){
            $(".mistake").html("请输入版本号");
            return;
        }
        para.appenv = $.trim($("#appenv").val());
        para.downloadUrl = $.trim($("#downloadUrl").val());
        para.updateContent = $.trim($("#updateContent").val());
        para.isUpdate = $.trim($("#isUpdate").val());
        var versionId = sessionStorage.getItem("id");
        if(versionId){
            para.versionId = versionId;
            $.ajax({
                type:"post",
                data:para,
                url:"/tvmanager/app/updateVersion",
                success:function(data){
                    data = JSON.parse(data);
                    alert(data.msg);
                    getVersionList();
                    $(".b_close").trigger("click");
                }
            });
            return;
        }
        $.ajax({
            type:"post",
            data:para,
            url:"/tvmanager/app/addVersion",
            success:function(data){
                if(typeof data == "string"){
                    data = JSON.parse(data);
                }
                alert(data.msg);
                getVersionList();
                $(".b_close").trigger("click");
            }
        });
    });
    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.versionId = sessionStorage.getItem("id");
        console.log(para);
        $.ajax({
            type:"post",
            data:para,
            url:"/tvmanager/app/delVersion",
            success:function(data){
                data = JSON.parse(data);
                alert(data.msg);
                getVersionList();
                $(".b_close").trigger("click");
            }
        });
    });
}

function clearForm(){
        sessionStorage.removeItem("id");
        $("#version").val("");
        $("#appenv").val("");
        $("#menuUrl").val("");
        $("#updateContent").val("");
}

function getVersionList(){
    $.ajax({
        type:"get",
        url:"/tvmanager/app/versionList",
        success:function(data){
            data = JSON.parse(data);
            console.log(data);
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                versionManagerVue.versionList = data.resp.versionListInfo;
            }
        }
    });
}

module.exports = {
    init: initialize
}
