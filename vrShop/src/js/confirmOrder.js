var proPara = {};
var confirmPara ={};
var confirmVue;
var chooseAddress;

function initialize(param) {
    $("footer").hide();
    confirmPara =param;
    $("title").html("确认订单");
    proPara = JSON.parse(sessionStorage.getItem("proPara"));
    console.log(proPara);
    confirmVue = new Vue({
        el: "#confirmOrder",
        data: {
            count: Number(proPara.productnum),
            sizeContent: proPara.sizeContent,
            defaultAddress:"添加收货地址",
            receiveName:"",
            telphone:"",
            addressId:"",
            productPrice:(Number(proPara.productPrice)).toFixed(2),
            productTitle:proPara.productTitle,
            productFreight:(Number(proPara.productFreight)).toFixed(2),
            productImage:proPara.productImage,
            productInventory:proPara.productInventory,
            allPrice:(Number(proPara.productPrice)*Number(proPara.productnum)+Number(proPara.productFreight)).toFixed(2),
            spaceName:sessionStorage.getItem("spaceName")
        },
        methods:{
        	reduce: function() {
                this.count--;
                if (this.count < 1) {
                    this.count = 1;
                }
                confirmVue.allPrice = confirmVue.productPrice*confirmVue.count+Number(confirmVue.productFreight);
            },
            plus: function() {
                this.count++;
                if (this.count > this.productInventory) {
                    this.count = this.productInventory;
                }
                confirmVue.allPrice = confirmVue.productPrice*confirmVue.count+Number(confirmVue.productFreight);
            },
            suit: function() {
                if (this.count < 1) {
                    this.count = 1;
                }
                if (this.count > this.productInventory) {
                    this.count = this.productInventory;
                }
                if (!/^\d+$/.exec(this.count)) {
                    this.count = 1;
                }
                confirmVue.allPrice = confirmVue.productPrice*confirmVue.count+Number(confirmVue.productFreight);
            }
        }
    });
    if(sessionStorage.getItem("chooseAddress")){
        chooseAddress = JSON.parse(sessionStorage.getItem("chooseAddress"));
        confirmVue.defaultAddress = chooseAddress.addressContent;
        confirmVue.receiveName = chooseAddress.receiveName;
        confirmVue.telphone = chooseAddress.receivePhone;
        confirmVue.addressId = chooseAddress.addressId;
        $('.addressInfo').removeClass("hidden");
        if(!$(".con_addAddress").hasClass("hidden")){
            $(".con_addAddress").addClass("hidden");
        }
    }else{
        getAddressList();
    }
    addEvent();
}

function addEvent() {
    $(".goChoosePayType").click(function() {
        var createOrderPara = {};
        createOrderPara.addressId = confirmVue.addressId;
        createOrderPara.inventoryId = proPara.inventoryId;
        createOrderPara.productnum = confirmVue.count;
        createOrderPara.userId = confirmPara.userId;
        createOrderPara.allPrice = confirmVue.allPrice;
        sessionStorage.setItem("createOrderPara",JSON.stringify(createOrderPara));
        location.href = "#choosePayType";
    });
    $(".addressInfo").click(function(){
    	//跳转到选择收货地址列表
    	if(confirmPara.userId == 0){
        sessionStorage.setItem("addLastPage","confirmOrder");
        location.href = "#addAddress";
      }else{
        sessionStorage.setItem("lastPage","confirmOrder");
        location.href = "#chooseAddress";
      }
    });
    $(".con_addAddress").click(function(){
        //跳转到添加地址
      sessionStorage.setItem("addLastPage","confirmOrder");
      location.href = "#addAddress";
    });
}

function getAddressList() {
    $.ajax({
        type: "post",
        url: "http://wap.hongdoujiao.tv/wap/address/list.do",
        data: {
            "userId": confirmPara.userId
        },
        success: function(json) {
            json = JSON.parse(json);
            console.log(json);
            var addressList = json.resp && json.resp.addressList;
            var flag = false;
            var flag2 = false;
            let addressInfo = sessionStorage.getItem('addressInfo')
            if(addressList){
                for (var i = 0; i < addressList.length; i++) {
                    flag = true;
                    if (addressList[i].defaulted == 1) {
                        flag2 = true;
                        var addressObj = addressList[i];
                        confirmVue.defaultAddress = addressObj.addressProvincesInfo + " " +addressObj.addressCityInfo + " " + addressObj.addressDistrictInfo + " " + addressObj.addressStreet;
                        confirmVue.receiveName = addressObj.receiveName;
                        confirmVue.telphone = addressObj.receivePhone;
                        confirmVue.addressId = addressObj.addressId;
                    }
                }
                if(!flag2){
                    var addressObj = addressList[0];
                    confirmVue.defaultAddress = addressObj.addressProvincesInfo + " " +addressObj.addressCityInfo + " " + addressObj.addressDistrictInfo + " " + addressObj.addressStreet;
                    confirmVue.receiveName = addressObj.receiveName;
                    confirmVue.telphone = addressObj.receivePhone;
                    confirmVue.addressId = addressObj.addressId;
                }
            }
            if(addressInfo){
              flag = true;
              var addressObj = JSON.parse(addressInfo);
              console.log(addressObj)
              confirmVue.defaultAddress = addressObj.addressProvincesInfo + " " +addressObj.addressCityInfo + " " + addressObj.addressDistrictInfo + " " + addressObj.addressStreet;
              confirmVue.receiveName = addressObj.receiveName;
              confirmVue.telphone = addressObj.receivePhone;
              confirmVue.addressId = addressObj.addressId;
            }
            if(flag){
            	$('.addressInfo').removeClass("hidden");
            	if(!$(".con_addAddress").hasClass("hidden")){
            		$(".con_addAddress").addClass("hidden");
            	}
            }else{
            	$('.con_addAddress').removeClass("hidden");
            	if(!$(".addressInfo").hasClass("hidden")){
            		$(".addressInfo").addClass("hidden");
            	}
            }
        }
    });
}

module.exports = {
    init: initialize
}
