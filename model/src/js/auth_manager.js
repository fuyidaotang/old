var authManagerVue;
function initialize() {
    clearForm()
    getAuthList();
    authManagerVue = new Vue({
        el:".auth_manager",
        data:{
            authList:[]
        },
        methods:{
            slideDownUp:function(event){
                var className = event.target.className;
                if(className == "plus"){
                    event.target.className = "mult";
                    $(event.target).html("-");
                    $(event.target).parent().siblings(".trees").slideDown(200);
                }
                if(className == "mult"){
                    event.target.className = "plus";
                    $(event.target).html("+");
                    $(event.target).parent().siblings(".trees").slideUp(200);
                }
            },
            addAuth:function(authItem){
                sessionStorage.setItem("id",authItem.menuId);
                $("#auth_dialog").show();
            },
            editAuth:function(authItem,menuId){
                sessionStorage.setItem("id",menuId);
                sessionStorage.setItem("authId",authItem.permissionId);
                $("#authName").val(authItem.permissionName);
                $("#authAction").val(authItem.permissionOrder);
                $("#authUrl").val(authItem.permissionUrl);
                $("#status input").removeProp("checked");
                $("#status input[value='"+authItem.status+"']").prop("checked","checked");
                $("#auth_dialog").show();
            }
        }
    });
    addEvent();
}

function getAuthList(){
    $.ajax({
        type:"get",
        url:"/tvmanager/sys/menuAuthList",
        success:function(data){
            data = JSON.parse(data);
            console.log(data);
            if(data.code = 20000){
                var menuInfo = data.resp.menuAuthList;
                var authList = menuInit(menuInfo);
                authManagerVue.authList = authList;
            }else if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            
        }
    });
}

function menuInit(menuInfo){
    var menuListOne = [];
    var menuListTwo = [];
    for(var i=0;i<menuInfo.length;i++){
        var menuItem = {};
        if(menuInfo[i].parentId == 0){
            menuItem.menuId = menuInfo[i].menuId;
            menuItem.menuName = menuInfo[i].menuName;
            menuItem.children = [];
            menuListOne.push(menuItem);
        }else{
            menuItem.parentId = menuInfo[i].parentId;
            menuItem.menuName = menuInfo[i].menuName;
            menuItem.menuOrder = menuInfo[i].menuOrder;
            menuItem.permission = menuInfo[i].permission;
            menuItem.menuId = menuInfo[i].menuId;
            menuListTwo.push(menuItem);
        }
    }
    for(var i=0;i<menuListTwo.length;i++){
        for(var j=0;j<menuListOne.length;j++){
            if(menuListOne[j].menuId == menuListTwo[i].parentId){
                menuListOne[j].children.push(menuListTwo[i]);
            }
        }
    }
    for(var i=0;i<menuListOne.length;i++){
        menuListOne[i].children.sort(compare("menuOrder"));
    }
    return menuListOne;
}

function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
    }
}

function addEvent() {
    $(".plus").click(function(){
        $(this).parent().siblings(".trees").slideToggle(200);
    });
    $(".b_close").click(function() {
        clearForm();
        $(this).parents(".dialog_container").hide();
    });
    $("#auth_dialog .agree").click(function(){
        var para = {};
        para.menuId = sessionStorage.getItem("id");
        para.authName = $.trim($("#authName").val());
        if(para.authName ==""){
            $(".mistake").html("请输入权限名称");
            return;
        }
        para.authAction = $.trim($("#authAction").val());
        if(para.authAction ==""){
            $(".mistake").html("请输入权限动作(数字)");
            return;
        }
        para.authUrl = $.trim($("#authUrl").val());
        para.status = $.trim($("#status input[checked]").val());
        var authId = sessionStorage.getItem("authId");
        if(authId){
            para.authId = authId;
            $.ajax({
                type:"post",
                data:para,
                url:"/tvmanager/sys/updateAuth",
                success:function(data){
                    data = JSON.parse(data);
                    alert(data.msg);
                    getAuthList();
                    $(".b_close").trigger("click");
                }
            });
            return;
        }
        $.ajax({
            type:"post",
            data:para,
            url:"/tvmanager/sys/addAuth",
            success:function(data){
                data = JSON.parse(data);
                alert(data.msg);
                getAuthList();
                $(".b_close").trigger("click");
            }
        });
        console.log(para);
    });
}

function clearForm(){
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("authId");
        $("#authName").val("");
        $("#authAction").val("");
        $("#authUrl").val("");
}

module.exports = {
    init: initialize
}
