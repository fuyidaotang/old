var initPagination;
var agentManagerVue;
var initAreaInfo
var initExtraAreaInfo = ''
function initialize() {
  agentManagerVue = new Vue({
    el: ".agent_manager",
    data: {
      agentList: [],
      currentPage: 1,
      pageSize: 6,
      countNum: 0,
      targetPage: 1,
      pageArray: [],
      detailContent:{},
      areaInfo:[],
      extraAreaInfo: [],
      spaceCate:[],
      spaceClassify: -1,
      agentType: -1,
      casValue:{
        chosenAreas: [[],[],[]],
        areaValue: '',
        areaIds: ''
      },
      addCasValue:{
        chosenAreas: [[],[],[]],
        areaValue: '',
        areaIds: ''
      },
      isShowCse: false,
      isShowAddCse: false,
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
          url:"/tvmanager/agent/getAgentList?pageSize="+this.pageSize+"&pageIndex="+pageIndex,
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
              self.agentList = data.resp.account.objectList;
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
        data.agentType = $("#agentType").val();
        data.agentLevel = $("#agentLevel").val();
        if(Date.parse($("#beginTime").val())){
          data.beginTime = Date.parse($("#beginTime").val());
        }
        if(Date.parse($("#endTime").val())){
          data.endTime = Date.parse($("#endTime").val());
        }
        data.areaId = this.casValue.areaIds
        return data
      },
      search: function(){
        this.jumpPage(this.currentPage)
      },
      add: function(){
        $('#detail_dialog').show()
      },
      showEditDialog:function(agent){
        sessionStorage.setItem("id",agent.agentId);
        $("#editAgentName").val(agent.agAgentName)
        $("#editPhone").val(agent.agPhone)
        $("#edit_dialog").show();
      },
      showPassDialog:function(agent){
        sessionStorage.setItem("id",agent.agentId);
        $("#pass_dialog").show();
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
      getExtraAreaInfo: function (agentType, spaceClassify) {
        if(agentType == 2){
          this.isShowCate = true
        }else{
          this.isShowCate = false
          this.spaceClassify = -1
        }
        var self = this
        var data = {}
        if(agentType != -1){
          data.agentType = agentType
        }
        if(spaceClassify != -1){
          data.spaceClassify = spaceClassify
        }
        $.ajax({
          type: 'get',
          url: '/tvmanager/agent/getWholeCountryExclude',
          data: data,
          success: function(res){
            if(res.code == 20004){
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href="login.html";
            }
            if(res.code == 20000) {
              self.extraAreaInfo = res.resp.areaInfo
              initExtraAreaInfo = JSON.parse(JSON.stringify(res.resp.areaInfo))
              self.isShowCascader = true
            }
          }
        })
      },
      getSpaceCate: function(){
        var self = this
        $.ajax({
          type: 'get',
          url: '/tvmanager/space/storeClassifyList',
          data:{
            pageSize: 100,
            pageIndex: 1
          },
          success: function(res){
            if(res.code == 20004){
              alert("登录失效,请重新登录");
              sessionStorage.removeItem("loginInfo");
              location.href="login.html";
            }
            if(res.code == 20000){
              self.spaceCate = res.resp.storeClassifyList.objectList
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
        this.extraAreaInfo = JSON.parse(JSON.stringify(initExtraAreaInfo))
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
      this.getSpaceCate()
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
    data.agentName = $('#addAgentName').val()
    data.phone = $('#addPhone').val()
    data.agentType = agentManagerVue.agentType
    if(data.agentType == 1){
      data.areaId = agentManagerVue.addCasValue.areaIds
      data.agentLevel = $('#addAgentLevel').val()
    }else if(data.agentType == 2){
      data.spaceClassify = agentManagerVue.spaceClassify
    }
    data.power = $('#power').val()
    $.ajax({
      type: 'post',
      url: '/tvmanager/agent/addAgent',
      data: data,
      success: function(res){
        alert(res.msg)
        location.reload()
      }
    })
    $(this).parents(".dialog_container").hide();
  });
  $("#edit_dialog .agree").click(function(){
    var data = {}
    data.agentId = sessionStorage.getItem('id')
    data.agentName = $("#editAgentName").val()
    data.phone = $("#editPhone").val()
    $.ajax({
      type: 'post',
      url: '/tvmanager/agent/alterAgent',
      data: data,
      success: function(res){
        alert(res.msg)
        location.reload()
      }
    })
  })
  $("#pass_dialog .agree").click(function(){
    var data = {}
    data.agentId = sessionStorage.getItem('id')
    $.ajax({
      type: 'post',
      url: '/tvmanager/agent/delAgent',
      data: data,
      success: function(res){
        alert(res.msg)
        location.reload()
      }
    })
  })
}


module.exports = {
  init: initialize
}
