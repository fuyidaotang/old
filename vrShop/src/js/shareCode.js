function initialize(param) {
  var orderPara = JSON.parse(sessionStorage.getItem("orderPara"));
  var liveParam = JSON.parse(sessionStorage.getItem("liveParam"));
  $.ajax({
    url: "http://wap.hongdoujiao.tv/wap/order/create.do",
    data: orderPara,
    type: "post",
    success: function (data) {
      var para = {};
      para.out_trade_no = data.resp.orderId;
      para.subject = "红豆角商品";
      para.total_fee = "0.01";
      para.openId = liveParam.openId;
      $.ajax({
        url: "http://wap.hongdoujiao.tv/wap/pay/wxpay.do",
        type: "post",
        data: para,
        success: function (data) {
          var data = data.resp.payInfo;
          console.log(data)
          onBridgeReady(data);
        }
      });
    },
  });
}

function onBridgeReady(para) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', {
      "appId": para.appid, //公众号名称，由商户传入
      "timeStamp": para.timestamp + "", //时间戳，自1970年以来的秒数
      "nonceStr": para.noncestr, //随机串
      "package": "prepay_id=" + para.prepayid,
      "signType": "MD5", //微信签名方式：
      "paySign": para.sign //微信签名
    },
    function (res) {
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        location.href = "http://wap.hongdoujiao.tv/vrShop/index.html";
      } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
    }
  );
}
module.exports = {
  init: initialize
}
