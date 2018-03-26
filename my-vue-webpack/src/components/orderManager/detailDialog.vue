<template>
    <div class="detail_container comm_dialog">
        <div class="detail_content">
            <h1 class="detail_title">
                <span class="fl">订单详情</span>
                <img class="fr" src="../../images/cha.png" @click="close" height="16" width="17">
            </h1>
            <div class="scroll_me" data-scroll="contentScroll">
                <div class="relative">
                    <div class="scroll_list_wrap" id="scroll_wrap">
                        <article class="scroll_list" id="scroll_list">
                            <div v-show="isDetail">
                                <section class="content_item">
                                    <span class="fl">收货地址</span>
                                    <span class="fr">{{!para || para.orderInfodomain.receiveAddress}}</span>
                                </section>
                                <section class="content_item">
                                    <span class="fl">卖家店铺</span>
                                    <span class="fr">{{!para || para.orderInfodomain.spaceName}}</span>
                                </section>
                                <div v-if="para">
                                    <section class="content_item" v-for="item in para.orderProductdomains">
                                        <img :src="item.productImage" class="fl orderPic"></img>
                                        <div class="fr">
                                            <h1>{{item.productName}}</h1>
                                            <h4>¥{{item.productPrice}}</h4>
                                            <h5><span
                                                    class="fl">规格: {{item.prskuOptionalDomain && item.prskuOptionalDomain.optionalName}}</span><span
                                                    class="fr">X{{item.productNum}}</span></h5>
                                        </div>
                                    </section>
                                </div>
                                <section class="content_item">
                                    <span class="fl">快递运费</span>
                                    <span class="fr">{{!para || para.orderInfodomain.orderPostage}}</span>
                                </section>
                                <section class="content_item">
                                    <span class="fl">价格合计</span>
                                    <span class="fr">{{!para || para.orderInfodomain.orderAmount}}</span>
                                </section>
                                <section class="content_item">
                                    <span class="fl">备注</span>
                                    <span class="fr">{{!para || para.orderInfodomain.orderNote}}</span>
                                </section>
                                <section class="content_item">
                                    <span class="fl">订单状态</span>
                                    <span class="fr">{{!para || para.orderInfodomain.orderStatus + "" | getOrderTitle}}</span>
                                </section>
                                <p class="dialogFooter">
                                    <span class="fl">订单编号:{{!para || para.orderInfodomain.orderNumber}}</span>
                                    <span class="fr">创建时间:{{!para || para.orderInfodomain.orderTime | transDate}}</span>
                                </p>
                            </div>
                            <div v-show="!isDetail">
                                <div v-if="transContent">
                                    <p v-if="transContent.msg" class="centerblock transNoInfo">
                                        {{transContent.msg}}
                                    </p>
                                    <dl class="transInfo" v-if="transContent.LogisticCode">
                                        <dt>
                                            <img class="fl" src="../../images/flight.png" height="61" width="61">
                                        <p class="fl">
                                            <span>快递公司 : </span><span class="fgray">{{transContent.companyName}}</span>
                                            <br>
                                            <span>快递单号 : </span><span class="fgray">{{transContent.LogisticCode}}</span>
                                        </p>
                                        </dt>
                                        <dd v-for="(value,$index) in transContent.Traces">
                                            <p>{{value.AcceptStation}}</p>
                                            <span class="time">{{value.AcceptTime}}</span>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="trans_loading" v-show="!transContent">
                                    <img src="../../images/loading.gif" height="32" width="32">
                                    <h2>物流信息查询中...</h2>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div class="scroll-bg" id="scroll_bg">
                        <div class="scroll-block" id="scroll_block"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import Scroll from "../../js/scroll.js";
    export default {
        props: ["para", "isDetail", "transContent"],
        methods: {
            close: function () {
                this.$emit("detailEvent");
            }
        },
        mounted: function () {
            var doc = document.documentElement;
            window["contentScroll"] = Scroll({
                contain: "scroll_list", // 容器id
                wrap: "scroll_wrap", // 包裹id
                scrollBg: "scroll_bg", // 滚动条背景id
                scrollBlock: "scroll_block", // 滚动块id
                heightFix: $('.detail_content').height() - 50 // 滚动区域固定高度
            });
            window["contentScroll"].init(doc.clientWidth, doc.clientHeight);
        },
        updated: function () {
            var doc = document.documentElement;
            window["contentScroll"].init(doc.clientWidth, doc.clientHeight);
        }
    }
</script>
<style type="text/css" lang="scss">
    .trans_loading {
        text-align: center;
        img {
            margin: 20px auto;
            margin-top: 200px;
        }
    }
    .dialogFooter {
        padding: 20px 40px;
    }
    .transNoInfo {
        margin-top: 50px;
    }
    .transInfo {
        padding: 20px;
        dt {
            height: 60px;
            p {
                line-height: 30px;
                margin-left: 10px;
            }
        }
        dd {
            margin-top: 30px;
            p {
                line-height: 1.3;
            }
            .time {
                color: #888;
                font-size: 10px;
                line-height: 30px;
            }
        }
        dd:nth-of-type(1) p {
            color: #a90f0f;
        }
    }
</style>
