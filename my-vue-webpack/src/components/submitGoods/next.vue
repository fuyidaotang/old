<template>
    <div class="comm_dialog">
        <div class="nextDialog">
            <figure>
                <span class="iconfont icon-gou"></span>
                <h2>添加成功</h2>
            </figure>
            <div class="button_group">
                <span @click="addContinue" class="button_type_3">继续添加</span>
                <router-link class="button_type_3" :to="{path:'/chooseCate/0'}">选择分类</router-link>
                <router-link class="button_type_3" :to="{path:'/goodsManager/'+statusPara}">查看</router-link>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["status"],
        watch: {
            status: function () {
                this.statusPara = this.status;
            }
        },
        data(){
            return {
                statusPara: 0
            }
        },
        methods: {
            addContinue: function () {
                this.$emit("clear");
            }
        }
    }
</script>
<style lang="scss">
    @font-face {
        font-family: "iconfont";
        src: url('../../fonts/iconfont.eot'); /* IE9*/
        src: url('../../fonts/iconfont.eot') format('embedded-opentype'),
        url('../../fonts/iconfont.woff') format('woff'),
        url('../../fonts/iconfont.ttf') format('truetype'),
        url('../../fonts/iconfont.svg') format('svg');
    }
    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .icon-gou {
        color: green;
        font-size: 80px;
    }
    .icon-gou:before {
        content: "\e641";
    }
    .nextDialog {
        width: 500px;
        height: 250px;
        position: fixed;
        top: 200px;
        left: 500px;
        background: #fff;
        z-index: 999;
        border-radius: 5px;
        text-align: center;
        figure {
            margin-top: 50px;
            h2 {
                font-size: 20px;
                margin-top: 20px;
                margin-bottom: 20px;
            }
        }
        .button_group {
            width: 382px;
            margin: 0 auto;
        }
        .button_type_3 {
            text-align: center;
            line-height: 34px;
        }
    }
</style>