<template>
    <div class="searchBox">
        <input type="text" :value="value" @input="search($event.target.value)" placeholder="请输入您要搜索的类目名称">
        <s></s>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: ['value'],
        methods: {
            search: function (value) {
                this.$emit('input', value);
            }
        }
    }
</script>
<style type="text/css" lang="scss">
    .searchBox {
        position: relative;
        border: 1px solid #dbdbdb;
        height: 32px;
        input {
            font-size: 18px;
            height: 30px;
            line-height: 30px;
            width: 370px;
            margin-left: 38px;
            margin-top: 2px;
        }
        s {
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            background: url(../../images/icon_list.png) no-repeat center center;
            background-position: -68px -300px;
            top: 9px;
            left: 12px;
        }
    }
</style>
