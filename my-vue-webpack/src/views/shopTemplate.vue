<template>
    <div class="shopTemplate">
        <div class="mainContent">
            <h1 class="comm_title">配送方式 >> 店铺运费模板  <span class="fr" v-show="!isAddTemplate" @click="isAddTemplate = !isAddTemplate">+添加运费模板</span></h1>
            <add-template v-show="isAddTemplate" @changeState="changeState" :editObj="editObj"></add-template>
            <shopTemplateList v-show="!isAddTemplate" @changeState="changeState" @edit="edit"></shopTemplateList>
        </div>
    </div>
</template>
<script>
    import addTemplate from '../components/freight/addShopTemplate.vue'
    import shopTemplateList from '../components/freight/shopTemplateList.vue'
    export default {
      data () {
        return {
          isAddTemplate: false,
          editObj: false
        }
      },
      methods: {
        changeState: function () {
          this.isAddTemplate = !this.isAddTemplate
          this.editObj = false
        },
        edit: function (item) {
            this.editObj = item
            this.isAddTemplate = !this.isAddTemplate
        }
      },
      components: {
        addTemplate,
        shopTemplateList
      }
    }
</script>
<style lang="scss">
    .shopTemplate{
        .addTemplate{
            position:absolute;
            left:20px;
            right:20px;
        }
    }
</style>