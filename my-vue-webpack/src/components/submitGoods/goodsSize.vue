<template>
    <div class="goodsSizeGroup">
        <div class="goodsSize" v-for="(item,$index) in sizeValue">
            <span class="del" @click="delSize($index)" v-if="sizeValue.length>1">-</span>
            <div class="tr">
                <div class="th td">规格</div>
                <div class="td">
                    <input type="text" maxlength="10" v-model="item.skuOptionName" @change="getValue(item,$index)"
                           placeholder="请填写商品属性，例如'红色'">
                </div>
            </div>
            <div class="tr">
                <div class="th td">价格</div>
                <div class="td">
                    <input type="text" v-model="item.productPrice" @change="getValue(item,$index)"
                           placeholder="请填写商品价格">
                </div>
            </div>
            <div class="tr">
                <div class="th td">库存</div>
                <div class="td">
                    <input type="text" v-model="item.productInventory" @change="getValue(item,$index)"
                           placeholder="请填写库存数量">
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: ["value"],
    data() {
      return {
        sizeValue: this.value
      }
    },
    watch: {
      value: function () {
        this.sizeValue = this.value;
      }
    },
    methods: {
      getValue: function (item, index) {
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9]{0,10}$/.test(item.skuOptionName)) {
          item.skuOptionName = "";
          this.$store.commit("setToast", "规格名不能含特殊符号");
        }
        if (!/^(0(\.[0-9]+)?)?$|^[1-9][0-9]*(\.[0-9]+)?$/.test(item.productPrice)) {
          item.productPrice = "";
          this.$store.commit("setToast", "请填写正确的价格");
        }
        if (!/^0?$|^[1-9][0-9]*$/.test(item.productInventory)) {
          item.productInventory = "";
          this.$store.commit("setToast", "请填写正确的库存");
        }
        if (item.skuOptionName && item.productPrice && item.productInventory) {
          this.$emit("input", this.sizeValue);
        }
      },
      delSize: function (index) {
        this.sizeValue.splice(index, 1);
        this.$emit("input", this.sizeValue);
      }
    }
  }
</script>
<style type="text/css" lang="scss" scoped>
    .del {
        position: absolute;
        right: -10px;
        top: -10px;
        display: block;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: #a90e0e;
        color: #fff;
        text-align: center;
        line-height: 25px;
        font-size: 32px;
        cursor: pointer;
    }
    .goodsSizeGroup {
        width: 1004px;
        display: inline-block;
        vertical-align: top;
    }
    .goodsSize {
        position: relative;
        border-top: 1px solid #dbdbdb;
        border-left: 1px solid #dbdbdb;
        margin-bottom: 20px;
    }
    .td {
        float: left;
        border-right: 1px solid #dbdbdb;
        border-bottom: 1px solid #dbdbdb;
        width: 870px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        input {
            width: 96%;
            height: 30px;
            text-align: center;
        }
    }
    .th {
        width: 130px;
        background: #f3f3f3;
        height: 35px;
    }
    .tr {
        height: 35px;
    }
</style>