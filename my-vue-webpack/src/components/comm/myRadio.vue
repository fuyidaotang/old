<template>
  <div class="cateChoose">
    <div class="radioOne" @click="clickEvent($index,item)" v-for="(item,$index) in proColumnList">
      <div class="myradio"><img v-if="selected==$index" src="../../images/pointer.png" height="4" width="5"></div>
      {{item.columnName}}
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: ["proColumnList"],
    data: function () {
      return {
        selected: "-1"
      }
    },
    watch: {
      proColumnList: function () {
        var flag = false;
        for (var i = 0; i < this.proColumnList.length; i++) {
          if (this.proColumnList[i].isChoosed) {
            flag = true;
            this.selected = i;
          }
        }
        if (!flag) {
          this.selected = -1;
        }
      }
    },
    methods: {
      clickEvent: function (index, item) {
        this.selected = index;
        this.$emit("setColumnId", item.columnId);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .radioOne {
    cursor: pointer;
    float: left;
    width: 120px;
    margin-left: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .myradio {
    float: left;
    margin-right: 10px;
    width: 14px;
    height: 14px;
    border: 1px solid #8b8b8b;
    border-radius: 50%;
    text-align: center;
    line-height: 14px;
    img {
      margin-top: 5px;
      margin-left: 4px;
    }
  }
</style>