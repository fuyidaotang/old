var createOrderPara;
var choosePayVue;

function initialize(param) {
    $("footer").hide();
    createOrderPara = JSON.parse(sessionStorage.getItem("createOrderPara"));
    console.log(createOrderPara);
    // sessionStorage.removeItem("createOrderPara");
    choosePayVue = new Vue({
        el: "#choosePayType",
        data: {
            allPrice: createOrderPara.allPrice
        }
    });
    addEvent();
}

function addEvent() {
    $(".choosePayType li").click(function() {
        $(".choosePayType .active").removeClass("active");
        $(this).children(".radio").addClass("active");
    });
    $(".goPay").click(function() {
        var orderPara = {};
        orderPara.addressId = createOrderPara.addressId;
        orderPara.inventoryId = createOrderPara.inventoryId;
        orderPara.productnum = createOrderPara.productnum;
        orderPara.userId = createOrderPara.userId;
        sessionStorage.setItem("orderPara",JSON.stringify(orderPara));
        location.href = "#shareCode";
    });
}

module.exports = {
    init: initialize
}
