<template>
    <div class="inputContainer">
        <span @click="isShow = !isShow">{{value | transStatus}}</span>
        <s @click="isShow = !isShow"></s>
        <ul v-if="isShow">
            <li v-for="item in items" @click="choose(item)" :value="item.value">{{item.text}}</li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: ["items", "value"],
        data() {
            return {
                isShow: false
            }
        },
        methods: {
            choose: function (item) {
                this.isShow = false;
                this.text = item.text;
                this.$emit("input", item.value);
            }
        }
    }
</script>
<style type="text/css" scoped>
    .inputContainer {
        position: relative;
        display: inline-block;
    }
    s {
        position: absolute;
        display: block;
        border: 6px solid transparent;
        border-top: 8px solid #888888;
        top: 8px;
        right: 10px;
        cursor: pointer;
    }
    ul {
        position: absolute;
        border: 1px solid #dbdbdb;
        border-top: none;
        border-bottom: none;
        width: 100%;
    }
    li {
        border-bottom: 1px solid #dbdbdb;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        text-align: center;
        background: #fff;
        cursor: pointer;
    }
    li:hover {
        background: #fbfbfb;
    }
    span {
        display: inline-block;
        height: 24px;
        line-height: 24px;
        border: 1px solid #dbdbdb;
        font-size: 18px;
        text-align: center;
        cursor: pointer;
        width: 100%;
    }
</style>
