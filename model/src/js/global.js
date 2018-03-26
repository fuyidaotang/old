var global = function () {
  // 通用
  Vue.filter('trans-date', function (tm) {
    if (tm < 10000000000) {
      tm = tm * 1000;
    }
    var tt = new Date(parseInt(tm));
    var yy=tt.getFullYear();
    if((tt.getMonth()+1)<10){
      var mm='0'+(tt.getMonth()+1)
    }else{
      var mm=tt.getMonth()+1;
    }
    if(tt.getDate()<10){
      var dd='0'+tt.getDate();
    }else{
      var dd=tt.getDate();
    }
    if(tt.getHours()<10){
      var hh='0'+tt.getHours();
    }else {
      var hh=tt.getHours();
    }
    if(tt.getMinutes()<10){
      var cc='0'+tt.getMinutes();
    }else {
      var cc=tt.getMinutes();
    }
    if(tt.getSeconds()<10){
      var ss='0'+tt.getSeconds();
    }else {
      var ss=tt.getSeconds();
    }
    return yy + "-" + mm + "-" + dd + " " + hh + ":" + cc + ":" + ss;
  })
  Vue.filter('trans-money', function (money) {
    if(money){
      return money.toFixed(2)+"元";
    }else{
      return "";
    }
  })
  Vue.filter('trans-verify-type', function (type) {
    switch (parseInt(type)) {
      case 0:
        return "未认证";
      case 1:
        return "实名认证";
      case 2:
        return "实体店认证";
      case 3:
        return "全景店认证";
      case 4:
        return "网络红人";
      case 5:
        return "海外买手";
      case 6:
        return "实力工厂";
      case 7:
        return "源头好货";
      case 8:
        return "旗舰店";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-verify-status', function (status) {
    switch (parseInt(status)) {
      case -1:
        return "失败";
      case 0:
        return "审核中";
      case 1:
        return "通过";
      default:
        return "未知错误";
    }
  })
  // 版本管理
  Vue.filter('trans-update-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不需要更新";
      case 1:
        return "需要更新";
      case 2:
        return "需要强制更新";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-appenv-status', function (status) {
    switch (parseInt(status)) {
      case 1:
        return "IOS";
      case 2:
        return "Android";
      default:
        return "未知错误";
    }
  })
  // banner管理
  Vue.filter('trans-banner-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "H5网页";
      case 2:
        return "APP页面";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-banner-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不可用";
      case 1:
        return "可用";
      default:
        return "未知错误";
    }
  })
  // 商品分类管理
  Vue.filter('trans-goods-cate-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不可用";
      case 1:
        return "可用";
      default:
        return "未知错误";
    }
  })
  // 直播标签管理
  Vue.filter('trans-tag-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不可用";
      case 1:
        return "可用";
      default:
        return "未知错误";
    }
  })
  // 新闻列表管理
  Vue.filter('trans-news-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不可用";
      case 1:
        return "可用";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-news-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "升级动态";
      case 2:
        return "直播资讯";
      case 3:
        return "主播内参";
      default:
        return "未知错误";
    }
  })
  //订单管理
  Vue.filter('trans-order-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "取消";
      case 10:
        return "未付款";
      case 20:
        return "未发货";
      case 30:
        return "已发货";
      case 40:
        return "待评论";
      case 50:
        return "已完成";
      case -1:
        return "已删除";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-goods-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "默认";
      case 2:
        return "团购商品";
      case 3:
        return "限时折扣商品";
      case 4:
        return "组合套装";
    }
  })
  Vue.filter('trans-refuse-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "退款";
      case 2:
        return "退货";
    }
  })
  Vue.filter('trans-seller-status', function (status) {
    switch (parseInt(status)) {
      case 1:
        return "待审核";
      case 2:
        return "同意";
      case 3:
        return "不同意";
    }
  })
  Vue.filter('trans-refuse-status', function (status) {
    switch (parseInt(status)) {
      case 1:
        return "处理中";
      case 2:
        return "待管理员处理";
      case 3:
        return "已完成";
    }
  })
  Vue.filter('trans-return-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "不用退货";
      case 2:
        return "需要退货";
    }
  })
  Vue.filter('trans-order-lock', function (status) {
    switch (parseInt(status)) {
      case 1:
        return "不用锁定";
      case 2:
        return "需要锁定";
    }
  })
  Vue.filter('trans-order-status', function (status) {
    switch (parseInt(status)) {
      case 10:
        return "待发货";
      case 20:
        return "待收货";
      case 30:
        return "未收到";
      case 40:
        return "已收货";
      case 50:
        return "已评价";
    }
  })
  Vue.filter('trans-comment-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "未评论";
      case 1:
        return "已评论";
      default:
        return "未知错误";
    }
  })
  // 产品管理
  Vue.filter('trans-product-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "未发布";
      case 1:
        return "已上架";
      case 2:
        return "已下架";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-product-verify-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "未审核";
      case 1:
        return "已审核";
      default:
        return "未知错误";
    }
  })
  // 推荐分类管理
  Vue.filter('trans-recommend-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不可用";
      case 1:
        return "可用";
      default:
        return "未知错误";
    }
  })
  // 公告管理
  Vue.filter('trans-report-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不可用";
      case 1:
        return "可用";
      default:
        return "未知错误";
    }
  })
  // 角色管理
  Vue.filter('trans-role-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "可用";
      case 1:
        return "不可用";
      default:
        return "未知错误";
    }
  })
  // 商户管理
  Vue.filter('trans-shop-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "不可用";
      case 1:
        return "可用";
      default:
        return "未知错误";
    }
  })
  // 提现管理
  Vue.filter('trans-cash-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "提交中";
      case 1:
        return "成功";
      case -1:
        return "失败";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-cash-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "支付宝";
      case 2:
        return "微信";
      case 4:
        return "apple";
      default:
        return "未知";
    }
  })
  Vue.filter('trans-convert-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "红豆币到红豆";
      case 2:
        return "余额买红豆币";
      case 3:
        return "红豆转为余额 ";
    }
  })
  // 用户管理
  Vue.filter('trans-register-type', function (type) {
    switch (parseInt(type)) {
      case 0:
        return "手机";
      case 1:
        return "qq";
      case 2:
        return "微信";
      case 3:
        return "微博";
      default:
        return "未知";
    }
  })
  Vue.filter('trans-user-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "正常";
      case 1:
        return "不可用";
      default:
        return "未知错误";
    }
  })
  // 微信管理
  Vue.filter('trans-wechat-status', function (status) {
    switch (parseInt(status)) {
      case 0:
        return "待审核";
      case 1:
        return "审核中";
      case 2:
        return "审核通过";
      case 3:
        return "拒绝";
      default:
        return "未知错误";
    }
  })
  // 代理商管理
  Vue.filter('trans-agent-status', function (status) {
    switch (parseInt(status)) {
      case 1:
        return "可用";
      case 0:
        return "不可用";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-agent-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "区域代理";
      case 2:
        return "行业代理";
      default:
        return "未知错误";
    }
  })
  Vue.filter('trans-level-type', function (type) {
    switch (parseInt(type)) {
      case 1:
        return "市级";
      case 2:
        return "区县级";
      case 3:
        return "全国";
      default:
        return "未知错误";
    }
  })

  // 全局变量
  Vue.prototype.$verifyStatus = [
    {
      value: 1,
      text: '实名认证'
    }, {
      value: 2,
      text: '实体店认证'
    }, {
      value: 3,
      text: '全景店认证'
    }, {
      value: 4,
      text: '网络红人'
    }, {
      value: 5,
      text: '海外买手'
    }, {
      value: 6,
      text: '实力工厂'
    }, {
      value: 7,
      text: '源头好货'
    }, {
      value: 8,
      text: '旗舰店'
    }
  ]
  Vue.prototype.$iconPic = function(picPath){
    if (picPath) {
      return picPath.replace("thum", "icon");
    } else {
      return "";
    }
  }
  Vue.prototype.$showBigPic = function(event){
    if ($(".pic_container").hasClass("hidden")) {
      var bigPic = $(event.currentTarget).attr("src").replace("icon", "thum");
      $(".pic_container img").attr("src", bigPic);
      $(".pic_container").removeClass("hidden");
    }
  }
}
module.exports = global