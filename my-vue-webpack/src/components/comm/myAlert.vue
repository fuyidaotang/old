<template>
    <div class="comm_dialog alertDialog" v-if="isShow">
        <div class="edit_content">
            <h1 class="edit_title">
                <img class="fr" src="../../images/cha.png" @click="resultEvent(false)" height="16" width="16">
            </h1>
            <h2 class="alertText">{{para.textValue}}</h2>
            <div class="button_group">
                <button class="button_type_1" @click="resultEvent(false)">取消</button>
                <button class="button_type_2" @click="resultEvent(true)">确定</button>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        props: ["para"],
        computed: {
            isShow: function () {
                return this.$store.state.isShowAlert;
            }
        },
        methods: {
            resultEvent: function (boolValue) {
                this.$emit("alertEvent", boolValue);
            }
        }
    }
</script>
<style type="text/css">
    .alertText {
        font-size: 20px;
        padding: 0 30px;
        text-align: center;
    }
</style>
