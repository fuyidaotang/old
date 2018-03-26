<template>
    <div class="detail_container comm_dialog">
        <div class="detail_content">
            <h1 class="detail_title">
                <span class="fl">商品详情</span>
                <img class="fr" src="../../images/cha.png" @click="close" height="16" width="17">
            </h1>
            <div class="scroll_me" data-scroll="contentScroll">
                <div class="relative">
                    <div class="scroll_list_wrap" id="scroll_wrap">
                        <article class="scroll_list" id="scroll_list">
                            <section class="content_item">
                                <span class="fl">产品名称</span>
                                <span class="fr">{{detailContent.productInfoDomain.productName}}</span>
                            </section>
                            <section class="content_item">
                                <span class="fl">栏目名</span>
                                <span class="fr">{{detailContent.productInfoDomain.columnName}}</span>
                            </section>
                            <section class="content_item">
                                <span class="fl">价格</span>
                                <span class="fr">{{detailContent.productInfoDomain.productPrice}}</span>
                            </section>
                            <section class="content_item">
                                <span class="fl">类别</span>
                                <span class="fr">{{detailContent.productInfoDomain.productCategoryDesc === "null" ? "" : detailContent.productInfoDomain.productCategoryDesc}}</span>
                            </section>
                            <section class="content_item">
                                <span class="fl">状态</span>
                                <span class="fr">{{detailContent.productInfoDomain.productStatue | transGoodsStatus}}</span>
                            </section>
                            <section class="content_item">
                                <span class="fl">添加时间</span>
                                <span class="fr">{{detailContent.productInfoDomain.productAddtime | transDate}}</span>
                            </section>
                            <section class="content_item">
                                <span class="fl">上次编辑</span>
                                <span class="fr">{{detailContent.productInfoDomain.productEdittime | transDate}}</span>
                            </section>
                            <section class="content_item item_type_2">
                                <span class="fl">产品主图</span>
                                <div class="fr">
                                    <img class="picSmall" :src="detailContent.productInfoDomain.productImage"
                                         @click.stop="$store.commit('setPicContainer',detailContent.productInfoDomain.productImage)">
                                    <span></span>
                                </div>
                            </section>
                            <section class="content_item item_type_2">
                                <span class="fl">产品图片</span>
                                <div class="fr">
                                    <img v-if="detailContent.pictures" class="picSmall"
                                         v-for="item in detailContent.pictures" :src="item.picturePath"
                                         @click.stop="$store.commit('setPicContainer',item.picturePath)">
                                    <span v-if="!detailContent.pictures">暂无</span>
                                </div>
                            </section>
                            <section class="content_item">
                                <span class="fl">总库存</span>
                                <span class="fr">{{detailContent.inventoryCounts}}</span>
                            </section>
                            <section class="content_item">
                                <span class="fl">销量</span>
                                <span class="fr">{{detailContent.soldCounts}}</span>
                            </section>
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
        props: ["detailContent"],
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