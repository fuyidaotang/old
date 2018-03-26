<template>
    <div class="comm_dialog previewDialog">
        <img class="phone_box" src="../../images/6s.png">
        <div class="mobilePreviewContainer">
            <h1 class="edit_title">
                <span>红豆角</span>
                <img class="fr" src="../../images/close.png" @click="close" height="16" width="16">
            </h1>
            <div class="scroll_me" data-scroll="mobileScroll">
                <div class="relative">
                    <div class="scroll_list_wrap" id="scroll_wrap">
                        <article class="scroll_list" id="scroll_list">
                            <div class="show_box" v-html="content"></div>
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
<script>
    import Scroll from "../../js/scroll.js";
    export default {
        props: ["showPrev"],
        data: function () {
            return {content: this.showPrev}
        },
        watch: {
            showPrev: function () {
                this.content = this.showPrev;
            }
        },
        methods: {
            close: function () {
                this.$emit("close");
            }
        },
        mounted: function () {
            var doc = document.documentElement;
            window["mobileScroll"] = Scroll({
                contain: "scroll_list", // 容器id
                wrap: "scroll_wrap", // 包裹id
                scrollBg: "scroll_bg", // 滚动条背景id
                scrollBlock: "scroll_block", // 滚动块id
                heightFix: 515 // 滚动区域固定高度
            });
            window["mobileScroll"].init(doc.clientWidth, doc.clientHeight);
        },
        updated: function () {
            var doc = document.documentElement;
            window["mobileScroll"].init(doc.clientWidth, doc.clientHeight);
        },
    }
</script>
<style lang="scss">
    .previewDialog {
        .phone_box {
            width: 369px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
        .mobilePreviewContainer {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            height: 569px;
            background: #fff;
        }
        .mobilePreviewContainer .edit_title {
            padding: 15px 20px;
            background: #000000;
            text-align: center;
        }
        .mobilePreviewContainer .edit_title > span {
            font-size: 20px;
            color: #fff;
        }
        .scroll_me {
            min-height: 515px;
        }
        .scroll-bg {
            right: 0px;
            background: transparent;
        }
        .scroll-block {
            width: 3px;
            left: 2px;
            background: transparent;
        }
        .show_box img {
            max-width: 100%;
            display: inline-block;
        }
    }
</style>