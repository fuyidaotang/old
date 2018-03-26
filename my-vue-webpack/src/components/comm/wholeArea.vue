<template>
    <div class="casc">
        <span v-show="isShowDefault">{{defaultAddress}}</span>
        <mySelect :items="p" default="请选择省份" v-model="chosenP" v-show="p.length > 0"></mySelect>
        <mySelect :items="ci" default="请选择城市" v-model="chosenCi" v-show="ci.length > 0"></mySelect>
        <mySelect :items="co" default="请选择区县" v-model="chosenCo" v-show="co.length > 0"></mySelect>
    </div>
</template>
<script>
    import mySelect from '../comm/mySelect.vue'
    export default {
      props:['initArea'],
      data () {
        return {
          isShowDefault: true,
          p:[],
          ci:[],
          co:[],
          chosenP:false,
          chosenCi:false,
          chosenCo:false,
          addressIds:[]
        }
      },
      watch:{
        chosenP:function(){
            this.isShowDefault = false
            if(this.chosenP && this.chosenP.childAreaList){
                this.ci = this.chosenP.childAreaList
                this.addressIds = [this.chosenP.areaId]
                this.$emit('input', false)
            }
        },
        chosenCi:function(){
          if(this.chosenCi){
            if(!this.chosenCi.childAreaList){
                this.addressIds.splice(1,2,this.chosenCi.areaId)
                this.$emit('input', this.addressIds)
            }else{
              this.co = this.chosenCi.childAreaList
              this.addressIds.splice(1,2,this.chosenCi.areaId)
              this.$emit('input', false)
            }
          }else{
            this.addressIds.splice(1,2)
            this.$emit('input', false)
            this.co = []
          }
        },
        chosenCo: function() {
          if(this.chosenCo){
            this.addressIds.splice(2,1,this.chosenCo.areaId)
            this.$emit('input', this.addressIds)
          }
        }
      },
      computed:{
        defaultAddress: function(){
          var address = '',p,ci,co
          p = this.initArea
          if(p){
            ci = p.child
            address += p.value
          }
          if(ci){
            co=ci.child
            address += ci.value
          }
          if(co){
            address += co.value
          }
          return address
        }
      },
      created: function() {
        var self = this
        axios({
          method: 'get',
          url: '/tvshop/template/getWholeCountry'
        }).then(function(res){
          if(res.data.code === 20000){
            self.p = res.data.resp.areaInfo
          }else{
            self.$store.commit('setToast','获取地址失败')
          }
        })
      },
      components:{
        mySelect
      }
    }
</script>
<style lang="scss">
    .casc{
        display:inline-block;
        height:25px;
        vertical-align: middle;
        .inputContainer{
            width:150px;
        }
    }
</style>