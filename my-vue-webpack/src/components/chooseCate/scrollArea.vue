<template>
  <div class="scroll-me" :data-scroll="scrollRoot">
    <div class="relative">
      <div class="my-list scroll-list-wrap" :id="wrap">
        <ul class="my-data scroll-list moved" :id="contain">
          <li v-for="(item,$index) in treeData" :class="{'active':$index==selected}"
              @click="getOtherData(item,$index)">{{item.productCategoryName}}
          </li>
        </ul>
      </div>
      <div class="scroll-bg" :id="scrollBg">
        <div class="scroll-block" :id="scrollBlock"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Scroll from "../../js/scroll.js";
  export default {
    data() {
      return {
        selected: null
      }
    },
    props: ["ident", "treeData"],
    computed: {
      scrollRoot: function () {
        return 'dataScroll' + this.ident;
      },
      contain: function () {
        return "list" + this.ident
      },
      wrap: function () {
        return "wrap" + this.ident
      },
      scrollBg: function () {
        return "bg" + this.ident
      },
      scrollBlock: function () {
        return "block" + this.ident
      }
    },
    methods: {
      getOtherData: function (item, index) {
        this.selected = index;
        item.treeCode = this.ident;
        this.$emit('getChildData', item);
      }
    },
    mounted: function () {
      var doc = document.documentElement;
      window[this.scrollRoot] = Scroll({
        contain: this.contain, // 容器id
        wrap: this.wrap, // 包裹id
        scrollBg: this.scrollBg, // 滚动条背景id
        scrollBlock: this.scrollBlock, // 滚动块id
        heightFix: 430 // 滚动区域固定高度
      });
      window[this.scrollRoot].init(doc.clientWidth, doc.clientHeight);
    },
    updated: function () {
      var doc = document.documentElement;
      window[this.scrollRoot].init(doc.clientWidth, doc.clientHeight);
    }
  }
</script>
<style type="text/css" scoped>
  .scroll-me {
    width: 346px;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    min-height: 430px;
    background: #fafafa;
  }

  li {
    height: 27px;
    padding-left: 15px;
    line-height: 27px;
    background: #fafafa;
    cursor: pointer;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }

  li:hover,
  li.active {
    background: #f2f2f2;
    border-top: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    color: #a90f0f;
  }

  /* 这是必要的css */
  .scroll-me {
    overflow: hidden;
  }

  .scroll-list {
    width: 100%;
  }

  .scroll-list-wrap {
    overflow: hidden;
  }

  .relative {
    position: relative;
  }

  /* 这是滚动条背景样式 */
  .scroll-bg {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 2px;
    width: 22px;
    background: #e4e4e4;
  }

  /* 这是滚动块样式 */
  .scroll-block {
    width: 16px;
    position: absolute;
    left: 3px;
    top: 0;
    background: #fff;
  }

  .moved {
    transition: transform .3s ease;
  }

  /* 这是移动过程中给滚动条加的class */
  .scroll-scrolling {
    background: #ccc;
  }

  /* 这里可以设置移动过程中滚动块的样式 */
  .scroll-scrolling .scroll-block {
    opacity: .9;
  }
</style>
