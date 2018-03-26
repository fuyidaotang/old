<template>
    <div class="addTemplate">
        <section class="block">
            <label><mark>*</mark>模板名称</label>
            <input type="text" class="comm_input" name="templateName" v-model="templateName" placeholder="请输入模板名称必填"
                   maxlength="30">
        </section>
        <table>
            <tr>
                <th class="col_1">运送到</th>
                <th class="col_2">配送方式</th>
                <th class="col_3">包邮条件</th>
                <th class="col_4">操作</th>
            </tr>
            <tbody>
            <tr v-for="(item, index) in spaceFreights">
                <td>
                    <span v-for="area in item.areaInfo">{{area.value}} </span>
                    <span class="btn" @click="showAreas(index)">编辑</span>
                    <areasBox class="area" @close="item.isShowArea = false" @getValue="setValue" v-show="item.isShowArea" :index="index"></areasBox>
                </td>
                <td>快递</td>
                <td>
                    <mySelect :items="items" v-model.number="item.pinkageType" class="fl comm_select" :noAll="false" :default="'件数'"></mySelect>
                    <div class="fl" v-show="item.pinkageType !== 2">
                        <span>满</span>
                        <input type="number" v-model.number="item.goodsNumber">
                        <span v-show="item.pinkageType === 3">件,</span>
                        <span v-show="item.pinkageType === 1">件包邮</span>
                    </div>
                    <div class="fl" v-show="item.pinkageType !== 1">
                        <input type="number" v-model.number="item.orderAmount">
                        <span>元以上包邮</span>
                    </div>
                </td>
                <td class="operate" v-show="index === spaceFreights.length-1" @click="addRow">+</td>
                <td class="operate" v-show="index !== spaceFreights.length-1" @click="delRow(index)">-</td>
            </tr>
            </tbody>
        </table>
        <article class="comm_form">
            <section class="centerBlock">
                <button class="button_type_2 fl" @click="save()">保存</button>
                <button class="button_type_1 fr" @click="cancel()">取消</button>
            </section>
        </article>
    </div>
</template>
<script>
  import mySelect from '../goodsManager/mySelect.vue'
  import areasBox from '../comm/areasBox.vue'
  export default {
    props: ['editObj'],
    data () {
      return {
        templateName: '',
        spaceFreights: [{
          areaInfo:[],
          pinkageType: 1,
          orderAmount: 0,
          goodsNumber: 0
        }],
        isShowArea: false,
        items:[
          {
          value: 1,
          text: '件数'
        },{
          value: 2,
          text: '金额'
        },{
          value: 3,
          text: '件数+金额'
        }]
      }
    },
    watch: {
      editObj: function () {
        if(this.editObj){
          this.templateName = this.editObj.templateName
          this.spaceFreights = this.editObj.spaceFreightAreaList
        }else{
          this.templateName = ''
          this.spaceFreights = [{
            areaInfo:[],
            pinkageType: 1,
            orderAmount: 0,
            goodsNumber: 0
          }]
        }
      }
    },
    methods: {
      showAreas: function(index){
        this.$set(this.spaceFreights[index],'isShowArea',true)
        this.$nextTick(function(){
          $('.mainContent').scrollTop($('.mainContent').height())
        })
      },
      setValue: function(areaInfo, index){
        this.spaceFreights[index].areaInfo = areaInfo
      },
      addRow: function(){
        this.spaceFreights.push({
          areaInfo: [],
          pinkageType: 1,
          orderAmount: 0,
          goodsNumber: 0
        })
      },
      clear: function(){
        this.templateName = ''
        this.spaceFreights = [{
          areaInfo:[],
          pinkageType: 1,
          orderAmount: 0,
          goodsNumber: 0
        }]
      },
      delRow: function(index){
        this.spaceFreights.splice(index, 1)
      },
      cancel: function () {
        this.$emit('changeState')
      },
      save: function() {
        var self = this
        this.$store.commit('setIsLoading', true)
        var spaceFreights = JSON.parse(JSON.stringify(this.spaceFreights))
        var allAreas = []
        var isReturn = false
        spaceFreights.forEach(function(item){
          var ids = ''
          item.areaInfo.forEach(function(area){
            ids += area.id + ','
            allAreas.push(area.id)
          })
          item.areaIds = ids.substring(ids.length - 1, -1)
          if(item.areaIds === ''){
            isReturn = true
          }
          delete item.areaInfo
          delete item.isShowArea
          delete item.faId
          delete item.templateId
        })
        if(!this.templateName){
          this.$store.commit('setToast', '未填写模板名')
          this.$store.commit('setIsLoading', false)
          return
        }
        if(isReturn){
          this.$store.commit('setToast', '未填写地址')
          this.$store.commit('setIsLoading', false)
          return
        }
        if(this.isSame(allAreas)){
          this.$store.commit('setToast', '所选区域有重复,请检查')
          this.$store.commit('setIsLoading', false)
          return
        }
        if(this.editObj){
            axios({
              method: 'post',
              url: '/tvshop/template/updateSpaceFreight',
              data: qs.stringify({
                templateId: this.editObj.templateId,
                templateName: this.templateName,
                spaceFreights: JSON.stringify(spaceFreights)
              })
            }).then(function(res){
              self.$store.commit('setIsLoading', false)
              if(res.data.code === 20000){
                self.$store.commit('setToast', res.data.msg)
                setTimeout(function(){
                  location.reload()
                },700)
              }else{
                self.$store.commit('setToast', res.data.msg)
              }
            })
        }else{
          axios({
            method: 'post',
            url: '/tvshop/template/addSpaceFreightTemplate',
            data: qs.stringify({
              templateName: this.templateName,
              spaceFreights: JSON.stringify(spaceFreights)
            })
          }).then(function(res){
            self.$store.commit('setIsLoading', false)
            if(res.data.code === 20000){
              self.$store.commit('setToast', res.data.msg)
              setTimeout(function(){
                location.reload()
              },700)
            }else{
              self.$store.commit('setToast', res.data.msg)
            }
          })
        }
      },
      isSame: function(array){
        var hash = {}
        for(var i in array){
          if(hash['a'+array[i]]){
            return true
          }
          hash['a'+array[i]] = true
        }
        return false
      }
    },
    components: {
      mySelect,
      areasBox
    }
  }
</script>
<style lang="scss">
    .block {
        margin-top:20px;
        label {
            display: inline-block;
            width: 80px;
            height: 25px;
            line-height: 25px;
            margin-right: 10px;
            mark {
                color: #a90e0e;
                background: none;
            }
        }
        .comm_input{
            height: 23px;
            width: 910px;
            border: 1px solid #dbdbdb;
            vertical-align: middle;
            padding: 0 20px;
        }
    }
    .centerBlock{
        width:300px;
        margin:0 auto;
    }
    .addTemplate{
        table{
            width:100%;
            margin-top:20px;
            td,th{
                border: 1px solid #dbdbdb;
                height: 20px;
                text-align: center;
                line-height:1.5;
                padding:10px 0;
                position:relative;
                .area{
                    top:34px;
                    left:50%;
                }
                span.btn{
                    color:#2713ee;
                    cursor:pointer;
                }
                span.btn:hover{
                    text-decoration: underline;
                }
                .comm_select{
                    width:130px;
                    margin-right:20px;
                    margin-left:20px;
                }
                .fl{
                    input{
                        height:24px;
                        border:1px solid #dbdbdb;
                        width:50px;
                        vertical-align: middle;
                        text-align:center;
                    }
                    span{
                        vertical-align: middle;
                    }
                }
            }
            td.operate{
                font-size:30px;
                cursor:pointer;
            }
            th{
                background: #fbfbfb;
            }
            .col_1{
                width: 500px;
            }
            .col_2{
                width: 120px;
            }
            .col_3{
                width: 470px;
            }
            .col_4{
                width: 75px;
            }
        }
    }
</style>