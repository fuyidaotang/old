/**
 * Created by Administrator on 2017/4/6.
 */
var tagListVue;
function initialize() {
    clearForm();
    tagListVue = new Vue({
        el: ".live_tag",
        data: {
            tagList: []
        },
        methods: {
            jumpPage: function() {
                var data = {};
                data.tagName = $("#tagName").val();
                data.tagId = $("#tagId").val();
                data.tagStatus = $("#tagStatus").val();
                jumpPage(tagListVue,data);
            },
            updateTag: function(tagItem){
                console.dir(tagItem);
                if(tagItem){
                    sessionStorage.setItem("id",tagItem.tagId);
                    $("#tagId").val(tagItem.tagId);
                    $("#tagName").val(tagItem.tagName);
                    $("#statusShow").val(tagItem.status);
                }
                $("#detail_dialog").show();
            },
            delTag:function(tagItem){
                sessionStorage.setItem("id",tagItem.tagId);
                $("#pass_dialog").show();
            }
        }
    });
    Vue.nextTick(function () {
        if(!$(".pic_container").hasClass("hidden")){
            $(".pic_container").addClass("hidden");
        }
    })
    jumpPage(tagListVue);
    addEvent();
}

function addEvent() {
    $(".page_button").click(function() {
        var pageItem = {
            count: $("#page_index").val(),
            isActive: true,
            isHidden: false
        };
        jumpPage(tagListVue, pageItem);
    });
    $(".b_close").click(function() {
        clearForm();
        $(this).parents(".dialog_container").hide();
    });
    $("#detail_dialog .agree").click(function(){
        var para = {};
        para.tagName = $.trim($("#tagName").val());
        para.status = $.trim($("#statusShow").val());
        if(para.tagName ==""||para.tagId ==""||para.status ==""){
            $(".mistake").html("请输入完整的参数");
            return;
        }
        var tagId = sessionStorage.getItem("id");
        if(tagId){
            para.tagId = tagId;
            $.ajax({
                type:"post",
                data:para,
                url:"/tvmanager/live/updateTag",
                success:function(data){
                    if(typeof data == "string"){
                        data = JSON.parse(data);
                    }
                    alert(data.msg);
                    $(".b_close").trigger("click");
                    jumpPage(tagListVue);
                }
            });
            return;
        }
        $.ajax({
            type:"post",
            data:para,
            url:"/tvmanager/live/addTag",
            success:function(data){
                if(typeof data == "string"){
                    data = JSON.parse(data);
                }
                alert(data.msg);
                $(".b_close").trigger("click");
                jumpPage(tagListVue);
            }
        });
    });



    $("#pass_dialog .agree").click(function(){
        var para = {};
        para.tagId = sessionStorage.getItem("id");
        $.ajax({
            type:"post",
            data:para,
            url:"/tvmanager/live/delTag",
            success:function(data){
                if(typeof data == "string"){
                    data = JSON.parse(data);
                }
                alert(data.msg);
                $(".b_close").trigger("click");
                jumpPage(tagListVue);
            }
        });
    });
}

function clearForm(){
    sessionStorage.removeItem("id");
    $("#tagId").val("");
    $("#tagName").val("");
    $(".mistake").html('');
}

function jumpPage(vue){
    $.ajax({
        type:"get",
        url:"/tvmanager/live/getLiveTagList",
        success:function(data){
            console.log(data);
            if(data.code == 20004){
                alert("登录失效,请重新登录");
                sessionStorage.removeItem("loginInfo");
                location.href="login.html";
            }
            if(data.resp){
                vue.tagList = data.resp.tagList;
            }
        }
    });
}

module.exports = {
    init: initialize
}
