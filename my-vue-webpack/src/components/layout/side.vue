<template>
    <div class="side">
        <ul>
            <li v-for="(menu,index) in menuList" :class="'nav_'+index" @mouseenter.stop="showMenu(menu)"
                @mouseleave.stop="isShow = false">
                <s></s>
                <span>{{menu.info}}</span>
                <child-menu class="show" :menu-option="menu"></child-menu>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    import childMenu from './childMenu.vue';
    export default{
        data (){
            return {
                isShow: false,
                menuList: [
                    {
                        info: "商品",
                        title: "商品管理",
                        childMenu: [{
                            title: "发布商品",
                            url: "/chooseCate/1"
                        }, {
                            title: "出售中商品",
                            url: "/goodsManager/1"
                        }, {
                            title: "未发布商品",
                            url: "/goodsManager/0"
                        }, {
                            title: "已下架商品",
                            url: "/goodsManager/2"
                        }, {
                            title: "全部商品",
                            url: "/goodsManager"
                        }]
                    },
                    {
                        info: "订单",
                        title: "订单管理",
                        childMenu: [{
                            title: "待付款订单",
                            url: "/orderManager/10"
                        }, {
                            title: "待发货订单",
                            url: "/orderManager/20"
                        }, {
                            title: "已发货订单",
                            url: "/orderManager/30"
                        }, {
                            title: "待评价订单",
                            url: "/orderManager/40"
                        }, {
                            title: "已完成订单",
                            url: "/orderManager/50"
                        }, {
                            title: "退款申请",
                            url: "/orderManager/100"
                        }, {
                            title: "已关闭订单",
                            url: "/orderManager/0"
                        }, {
                            title: "评价管理",
                            url: "/commentManager"
                        }]
                    },
                    {
                        info: "统计",
                        title: "数据统计",
                        childMenu: [{
                            title: "销售额统计",
                            url: "/chartsShare#sale"
                        }, {
                            title: "销量统计",
                            url: "/chartsShare#salesVolumeSta"
                        }, {
                            title: "购物车统计",
                            url: "/chartsShare#shopping"
                        }]
                    },
                     {
                     	title:"运费模块管理",
                     	info: "运费",
                     	childMenu:[{
                     		title:"店铺运费模板",
                     		url:"/shopTemplate"
                     	},{
                     		title:"配送方式设置",
                     		url:"/goodsTemplate"
                     	},{
                          title:"快递单模板",
                          url:"/expressOrder"
                        },{
                          title:"我的发货地址",
                          url:"/myAddress"
                        }]
                     },
                    {
                        info: "店铺",
                        title: "店铺管理",
                        childMenu: [{
                            title: "栏目管理",
                            url: "/columnManager"
                        }, {
                            title: "店铺信息",
                            url: "/realShop"
                        }, {
                          title: "直播管理",
                          url: "/liveManager",
                          isShow: this.$isFactory
                        }]
                    },
                    {
                        info: "属性",
                        title: "属性管理",
                        childMenu: [{
                            title: "添加属性",
                            url: "/chooseCate/2"
                        }, {
                            title: "属性列表",
                            url: "/attributeManager"
                        }]
                    },
                    // {
                    // 	title:"店铺管理",
                    // 	childMenu:[{
                    // 		title:"栏目管理",
                    // 		url:"/submitGoods"
                    // 	},{
                    // 		title:"子账号管理",
                    // 		url:"/noSaleGoods"
                    // 	},{
                    // 		title:"升级实体店",
                    // 		url:"/noSaleGoods"
                    // 	},{
                    // 		title:"栏目管理",
                    // 		url:"/submitGoods"
                    // 	},{
                    // 		title:"子账号管理",
                    // 		url:"/noSaleGoods"
                    // 	},{
                    // 		title:"升级实体店",
                    // 		url:"/noSaleGoods"
                    // 	}]
                    // },
                    // {
                    // 	title:"资金管理",
                    // 	childMenu:[{
                    // 		title:"提现",
                    // 		url:"/noSaleGoods"
                    // 	},{
                    // 		title:"资金一览表",
                    // 		url:"/noSaleGoods"
                    // 	}]
                    // }
                ]
            }
        },
        methods: {
            showMenu: function (item) {
                this.isShow = true;
            },
            goAnchor: function (selector) {
                let target = document.querySelector(selector);
                document.querySelector(".comm_view").scrollTop = target.offsetTop;
            }
        },
        components: {
            childMenu
        }
    }
</script>
<style lang="scss" scoped>
    .side {
        position: absolute;
        width: 49px;
        top: 90px;
        bottom: 0;
        border-right: 1px solid #eeeeee;
        li {
            position: relative;
            z-index: 2;
            width: 48px;
            height: 58px;
            border: 1px solid transparent;
            cursor: pointer;
            -webkit-transition: all 0.1s;
            transition: all 0.1s;
            text-align: center;
            &:hover {
                background: #a90e0e;
                .show {
                    display: block;
                }
                span {
                    color: #fff;
                }
            }
            span {
                font-size: 12px;
                color: #c5c5c5;
            }
            s {
                display: block;
                width: 24px;
                height: 22px;
                margin-top: 12px;
                margin-left: 13px;
                background: url(../../images/icon_list.png) no-repeat center center;
            }
        }
        .nav_0 s {
            background-position: -35px 0;
        }
        .nav_1 s {
            background-position: -1px -48px;
        }
        .nav_2 s {
            background-position: -1px -99px;
        }
        .nav_3 s {
            background-position: 0 -151px;
        }
        .nav_4 s {
            background: url(../../images/attribute.png) no-repeat center center;
        }
        .nav_5 s {
            background-position: -1px -249px;
        }
        .nav_6 s {
            background-position: -1px -298px;
        }
        .nav_7 s {
            background-position: -1px -201px;
        }
        .nav_0:hover s {
            background-position: -1px 0;
        }
        .nav_1:hover s {
            background-position: -35px -48px;
        }
        .nav_2:hover s {
            background-position: -35px -99px;
        }
        .nav_3:hover s {
            background-position: -35px -151px;
        }
        .nav_4:hover s {
            background: url(../../images/attribute1.png) no-repeat center center;
        }
        .nav_5:hover s {
            background-position: -35px -249px;
        }
        .nav_6:hover s {
            background-position: -35px -298px;
        }
        .nav_7:hover s {
            background-position: -35px -201px;
        }
    }
</style>