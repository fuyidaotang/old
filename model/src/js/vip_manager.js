var initPagination;
var vipManagerVue;
var initAreaInfo
require('../../libs/js/jquery.form.js');
function initialize() {
  vipManagerVue = new Vue({
    el: ".vip_manager",
    data: {
      vipList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      targetPage: 1,
      pageArray: [],
      detailContent:{},
      areaInfo:[],
      spaceCate:[],
      spaceClassify: -1,
      agentType: -1,
      casValue:{
        chosenAreas: [[],[],[]],
        areaValue: '',
        areaIds: ''
      },
      isShowCse: false,
      isShowCascader: false
    },
    computed: {
      pagesCount: function() {
        return Math.ceil(this.countNum / this.pageSize);
      },
      shopIndex: function() {
        return this.pageSize * (this.currentPage - 1) + 1;
      }
    },
    methods: {
      jumpPage: function(pageIndex) {
        var self = this
        var data = this.getSearchPara()
        $.ajax({
          type:"get",
          url:"/tvmanager/agent/getAgentListTop?pageSize="+this.pageSize+"&pageIndex="+pageIndex,
          data: data,
          success:function(data){
            if(data.code == 20004){
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href="login.html";
            }
            if(data.resp){
              self.currentPage = pageIndex;
              self.countNum = data.resp.account.countNum;
              self.vipList = data.resp.account.objectList;
              initPagination(self);
            }
          }
        });
      },
      getSearchPara: function () {
        var data = {};
        data.agentName = $("#agentName").val();
        data.phone = $("#phone").val();
        data.agNumber = $("#agNumber").val();
        data.areaId = this.casValue.areaIds
        return data
      },
      search: function(){
        this.jumpPage(this.currentPage)
      },
      add: function(id){
        $("#detail_dialog .agree").hide();
        sessionStorage.setItem('id', id)
        $('#detail_dialog').show()
      },
      getAreaInfo: function () {
        var self = this
        $.ajax({
          type: 'get',
          url: '/tvmanager/agent/getWholeCountry',
          success: function(res){
            if(res.code == 20004){
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href="login.html";
            }
            if(res.code == 20000) {
              self.areaInfo = res.resp.areaInfo
              initAreaInfo = JSON.parse(JSON.stringify(res.resp.areaInfo))
            }
          }
        })
      },
      chooseArea: function (obj, area, type) {
        var index = -1
        this[obj].chosenAreas[type].forEach(function(item,_index){
          if(item.areaId == area.areaId){
            index = _index
          }
        })
        if(index == -1){
          this[obj].chosenAreas[type].push({
            areaId: area.areaId,
            areaName: area.areaName
          })
          Vue.set(area,'active',true)
        }else{
          this[obj].chosenAreas[type].splice(index, 1)
          if(type == 0){
            this[obj].chosenAreas[1] = []
            this[obj].chosenAreas[2] = []
          }
          if(type == 1){
            this[obj].chosenAreas[2] = []
          }
          area.active = false
        }
      },
      getAreaName: function (obj, type) {
        var areaInfo = ''
        var areaIds = ''
        try{
          this[obj].chosenAreas[type].forEach(function(item){
            areaInfo += item.areaName + ','
            areaIds += item.areaId + ','
          })
        }catch(err){}
        areaInfo = areaInfo.substring(areaInfo.length - 1,-1)
        areaIds = areaIds.substring(areaIds.length - 1,-1)
        if(this[obj].areaValue){
          this[obj].areaValue = this[obj].areaValue + ',' + areaInfo
        }else{
          this[obj].areaValue = areaInfo
        }
        if(this[obj].areaIds){
          this[obj].areaIds = this[obj].areaIds + ',' + areaIds
        }else{
          this[obj].areaIds = areaIds
        }
        this[obj].chosenAreas = [[],[],[]]
        this.areaInfo = JSON.parse(JSON.stringify(initAreaInfo))
      },
      sure: function(obj){
        this[obj].chosenAreas = [[],[],[]]
        this.isShowCse = false
        this.isShowAddCse = false
      },
      clear:function(obj){
        this[obj] = {
          chosenAreas: [[],[],[]],
          areaValue: '',
          areaIds: ''
        }
      }
    },
    created: function(){
      this.jumpPage(1);
      this.getAreaInfo()
    }
  });
  initPagination = require("./pagination.js");
  addEvent();
}

function addEvent() {
  $(".b_close").click(function() {
    $(this).parents(".dialog_container").hide();
  });
  $("#detail_dialog .agree").click(function(){
    var data = {}
    data.agentId = sessionStorage.getItem('id')
    data.count = $('#count').val()
    data.picId = $('#picId').val()
    $.ajax({
      type: 'post',
      url: '/tvmanager/agent/createVipNo',
      data: data,
      success: function(res){
        alert(res.msg)
        location.reload()
      }
    })
    $(this).parents(".dialog_container").hide();
  });
  $(".uploadFile").change(function () {
    $("#uploadForm").ajaxSubmit({
      type: "post",
      url: "/tvmanager/app/upload",
      success: function (data) {
        console.log(data)
        $("#detail_dialog .agree").show();
        $("#picId").val(data);
      }
    })
  })
}


module.exports = {
  init: initialize
}
