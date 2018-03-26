<template>
    <div class="my_check">
        <figure :class="{'active': value}" @click="submitState">
            <img src="../../images/tick_2.png" alt="">
        </figure>
        <span>
            <slot></slot>
        </span>
    </div>
</template>
<script>
    export default {
      props:['value'],
      methods:{
        submitState: function () {
          this.$emit('input', !this.value)
        }
      }
    }
</script>
<style lang="scss">
    .my_check{
        display:inline-block;
        vertical-align: middle;
        figure{
            width:16px;
            height:16px;
            border:1px solid #dbdbdb;
            margin-right:10px;
            float:left;
            cursor:pointer;
            img{
                display:none;
            }
        }
        figure.active{
            border-color:#a90e0e;
            background:#a90e0e;
            img{
                display:block;
                margin:3px 1px;
            }
        }
        span{
            line-height:18px;
        }
    }
</style>