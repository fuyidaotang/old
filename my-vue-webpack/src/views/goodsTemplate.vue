<template>
    <div class="goodsTemplate">
        <div class="mainContent">
            <h1 class="comm_title">配送方式 >> 配送方式设置 <span class="fr" v-show="!isAddTemplate" @click="isAddTemplate = !isAddTemplate">+添加运费模板</span></h1>
            <addGoodsTemplate v-show="isAddTemplate" @changeState="changeState" :editObj="editObj"></addGoodsTemplate>
            <goodsTemplateList v-show="!isAddTemplate" @changeState="changeState" @edit="edit"></goodsTemplateList>
        </div>
    </div>
</template>
<script>
    import addGoodsTemplate from '../components/freight/addGoodsTemplate.vue'
    import goodsTemplateList from '../components/freight/goodsTemplateList.vue'
    export default {
      data() {
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
          var self = this
          axios({
            method: 'get',
            url: '/tvshop/template/getProductFreight?templateId='+item.templateId
          }).then(function(res){
            if(res.data.code === 20000){
              console.log(res.data)
              self.editObj = res.data.resp.productFreight
              self.isAddTemplate = !self.isAddTemplate
            }
          })
        }
      },
      components:{
        addGoodsTemplate,
        goodsTemplateList
      }
    }
</script>