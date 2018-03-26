<template>
    <div class="loading" v-if="$store.state.isLoading">
        <img src="../../images/loading.gif" height="32" width="32">
    </div>
</template>
<script type="text/ecmascript-6">
    export default {}
</script>
<style lang="scss" scoped>
    .loading {
        position:fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:rgba(255,255,255,0.6);
        img{
            position:absolute;
            top:50%;
            left:50%;
            margin-top:-16px;
            margin-left:-16px;
        }
    }
</style>
