<template>
    <div class="inputContainer">
        <span @click="isShow = !isShow">{{text || "请选择"}}</span>
        <s @click="isShow = !isShow"></s>
        <ul v-if="isShow">
            <li class="model" @click="isShow = false"></li>
            <li v-for="item in items" @click="choose(item)" :value="item.areaId">{{item.areaName}}</li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: ["items", "value", "default"],
    data() {
      return {
        isShow: false,
        text: this.default
      }
    },
    watch: {
      value: function(){
        this.init()
      },
      items: function(){
        this.text = this.default
        this.$emit('input', false)
      }
    },
    methods: {
      init: function() {
        if(this.value){
          var self = this
          this.items.forEach(function(item){
            if(item.value == self.value){
              self.text = item.areaName
            }
          })
        }
      },
      choose: function (item) {
        this.isShow = false;
        if (item) {
          this.text = item.areaName;
          this.$emit("input", item);
        }
      }
    },
    created: function(){
      this.init()
    }
  }
</script>
<style type="text/css" scoped>
    .model,.model:hover{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:0;
        background:transparent;
    }
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
        width: 100%;
        max-height:180px;
        overflow-y:auto;
    }
    li {
        border-bottom: 1px solid #dbdbdb;
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        text-align: center;
        background: #fff;
        cursor: pointer;
        position:relative;
        z-index:2;
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