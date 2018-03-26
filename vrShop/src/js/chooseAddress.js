var addressParam;
var addressListVue;
var defaultAddressId;

function initialize(param) {
    $("footer").hide();
    sessionStorage.removeItem("editAddress")
    addressParam = param;
    setTimeout(function() {
        $(".b_addAddress").css({
            "display": "block"
        });
        $(".b_addAddress").show();
    }, 500);
    addressListVue = new Vue({
        el: "#chooseAddress",
        data: {
            addressList: []
        },
        methods: {
            setDefault: function(index, event) {
                event.stopPropagation();
                for (var i = 0; i < this.addressList.length; i++) {
                    this.addressList[i].defaulted = false;
                }
                this.addressList[index].defaulted = true;
                defaultAddressId = this.addressList[index].addressId;
            },
            jump: function(address) {
                var lastPage = sessionStorage.getItem("lastPage");
                if (lastPage == "confirmOrder") {
                    var chooseAddress = {};
                    chooseAddress.addressContent = address.addressProvincesInfo + " " + address.addressCityInfo + " " + address.addressDistrictInfo + " " + address.addressStreet;
                    chooseAddress.receiveName = address.receiveName;
                    chooseAddress.receivePhone = address.receivePhone;
                    chooseAddress.addressId = address.addressId;
                    console.log(chooseAddress);
                    sessionStorage.setItem("chooseAddress", JSON.stringify(chooseAddress));
                    changeDefault(defaultAddressId);
                    location.href = "#confirmOrder";
                } else {
                    console.log("进入编辑页面");
                }
            },
            del: function(index, addressId) {
                $.ajax({
                    url: "http://wap.hongdoujiao.tv/wap/address/delete.do",
                    data: {
                        "userId": addressParam.userId,
                        "addressId": addressId
                    },
                    type: "post",
                    success: function(data) {
                        addressListVue.addressList.splice(index, 1);
                    }
                });
            },
            edit: function(address) {
                event.stopPropagation();
                sessionStorage.setItem("editAddress", JSON.stringify(address));
                location.href = "#addAddress";
            }
        }
    });
    addEvent();
    getAddressList();
}

function addEvent() {
    $(".b_addAddress").click(function() {
        sessionStorage.setItem("addLastPage", "chooseAddress");
        location.href = "#addAddress";
    });
}

function getAddressList() {
    $.ajax({
        type: "post",
        url: "http://wap.hongdoujiao.tv/wap/address/list.do",
        data: {
            "userId": addressParam.userId
        },
        success: function(json) {
            json = JSON.parse(json);
            console.log(json);
            var addressList = json.resp.addressList;
            if (addressList) {
                for (var i = 0; i < addressList.length; i++) {
                    if (addressList[i].defaulted != 1) {
                        addressList[i].defaulted = false;
                    } else {
                        addressList[i].defaulted = true;
                        defaultAddressId = addressList[i].addressId;
                    }
                }
                addressListVue.addressList = addressList;
            }

        }
    });
}

function changeDefault(addressId) {
    $.ajax({
        type: "post",
        url: "http://wap.hongdoujiao.tv/wap/address/defaulted.do",
        data: {
            "userId": addressParam.userId,
            "addressId": addressId
        },
        success: function(data) {
            console.log(data);
        }
    });
}

module.exports = {
    init: initialize
}
