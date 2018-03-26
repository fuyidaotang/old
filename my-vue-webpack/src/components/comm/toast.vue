<template>
    <transition name="fade">
        <div class="mask" v-if="isShowToast">
            <div class="touse">
                {{toastText}}
            </div>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
    export default {
        computed: {
            isShowToast: function () {
                let self = this;
                setTimeout(function () {
                    self.$store.commit("setToast");
                }, 1000);
                return this.$store.state.isShowToast;
            },
            toastText: function () {
                return this.$store.state.toastText;
            }
        }
    }
</script>
<style type="text/css">
    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        bottom: 0;
        z-index: 999999999;
    }

    .touse {
        height: 50px;
        padding: 0 15px;
        background: #333;
        color: #fff;
        border-radius: 25px;
        line-height: 50px;
        position: fixed;
        top: 50%;
        margin-top: -25px;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%);
        z-index: 9999;
    }
</style>