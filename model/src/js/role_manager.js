var roleManagerVue;

function initialize() {
    clearForm();
    roleManagerVue = new Vue({
        el: ".role_manager",
        data: {
            roleList: []
        },
        methods: {
            showDetailDialog:function(roleItem){
                sessionStorage.setItem("id",roleItem.roleId);
                $("#roleName").val(roleItem.roleName);
                $("#status").val(roleItem.status);
                $("#detail_dialog").show();
            },
            showPassDialog:function(roleItem){
                sessionStorage.setItem("id",roleItem.roleId);
                $("#pass_dialog").show();
            }
        }
    });
    getRoleList();
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
        para.roleName = $.trim($("#roleName").val());
        if(para.version ==""){
            $(".mistake").html("请输入角色名");
            return;
        }
        para.status = $.trim($("#status").val());
        var roleId = sessionStorage.getItem("id");
        if(roleId){
            para.roleId = roleId;
            $.ajax({
                type:"post",
                data:para,
                url:"/tvmanager/sys/updateRole",
                success:function(data){
                    if(typeof data == "string"){
                        data = JSON.parse(data);
                    }
                    alert(data.msg);
                    getRoleList();
                    $(".b_close").trigger("click");
                }
            });
            return;
        }
        $.ajax({
            type:"post",
            data:para,
            url:"/tvmanager/sys/addRole",
            success:function(data){
                data = JSON.parse(data);
                alert(data.msg);
                getRoleList();
                $(".b_close").trigger("click");
            }
        });
    });
    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.roleId = sessionStorage.getItem("id");
        $.ajax({
            type:"post",
            data:para,
            url:"/tvmanager/sys/delRole",
            success:function(data){
                if(typeof data == "string"){
                    data = JSON.parse(data);
                }
                alert(data.msg);
                getRoleList();
                $(".b_close").trigger("click");
            }
        });
    });
}

function clearForm(){
        sessionStorage.removeItem("id");
        $("#roleName").val("");
}

function getRoleList(){
    $.ajax({
        type:"get",
        url:"/tvmanager/sys/roleList",
        success:function(data){
            if(typeof data == "string"){
                data = JSON.parse(data);
            }
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                roleManagerVue.roleList = data.resp.roleInfo;
            }
        }
    });
}

module.exports = {
    init: initialize
}
