<template>
    <div class="addGoodsTemplate">
        <section class="block">
            <label><mark>*</mark>模板名称</label>
            <input type="text" class="comm_input" name="templateName" v-model="templateName">
        </section>
        <section class="block">
            <label><mark>*</mark>发货地址</label>
            <wholeArea v-model="goodsAddress" :initArea="initArea"></wholeArea>
        </section>
        <section class="block">
            <label><mark>*</mark>是否包邮</label>
            <input type="radio" name="isNoFreight" v-model="pinkageStatus" value="1"><span class="radioName">卖家承担运费</span>
            <input type="radio" name="isNoFreight" v-model="pinkageStatus"  value="0"><span class="radioName">自定义运费模板</span>
            <span class="no_edit fgray">(除运费地区外，其他未设置运费的地区均采用“默认运费”）</span>
        </section>
        <section class="block">
            <label><mark>*</mark>配送方式</label>
            <span class="no_edit">快递</span>
        </section>
        <section class="block">
            <label>发货时间</label>
            <mySelect class="deliveryTime" v-model="deliveryTime" :items="[{value:'1',text:'1天'},
              {value:'2',text:'2天'},{value:'3',text:'3天'},
              {value:'4',text:'4天'},{value:'5',text:'5天'},
              {value:'6',text:'6天'},{value:'7',text:'7天'},
              {value:'8',text:'8天'},{value:'9',text:'9天'},
              {value:'10',text:'10天'},{value:'11',text:'11天'},
              {value:'12',text:'12天'},{value:'13',text:'13天'},
              {value:'14',text:'14天'},{value:'15',text:'15天'},
            ]">
            </mySelect>
        </section>
        <section class="block">
            <label>计价方式</label>
            <input type="radio" name="cal_price" v-model="pricingType" value="0"><span class="radioName">按件数</span>
            <input type="radio" name="cal_price" v-model="pricingType" value="1"><span class="radioName">按重量</span>
            <input type="radio" name="cal_price" v-model="pricingType" value="2"><span class="radioName">按体积</span>
        </section>
        <div class="templateModel" v-if="pinkageStatus == 0 && pricingType != -1">
            <div class="base">
                <span>默认运费:</span>
                <input type="number" v-model.number="defaultProductFreights.firstUnit">
                <span v-show="pricingType == 1">kg内,</span>
                <span v-show="pricingType == 0">件内,</span>
                <span v-show="pricingType == 2">m<sup>3</sup>内,</span>
                <input type="number" v-model.number="defaultProductFreights.firstPrice">
                <span>元,每增加</span>
                <input type="number" v-model.number="defaultProductFreights.addUnit">
                <span v-show="pricingType == 1">kg,增加运费</span>
                <span v-show="pricingType == 0">件,增加运费</span>
                <span v-show="pricingType == 2">m<sup>3</sup>,增加运费</span>
                <input type="number" v-model.number="defaultProductFreights.addPrice">
                <span>元</span>
            </div>
            <table>
                <tr>
                    <th class="col_1">运送到</th>
                    <th class="col_2" v-show="pricingType == 1">首重(kg)</th>
                    <th class="col_2" v-show="pricingType == 0">首件(件)</th>
                    <th class="col_2" v-show="pricingType == 2">首体积(m<sup>3</sup>)</th>
                    <th class="col_2">首费(元)</th>
                    <th class="col_2" v-show="pricingType == 1">续重(kg)</th>
                    <th class="col_2" v-show="pricingType == 0">续件(件)</th>
                    <th class="col_2" v-show="pricingType == 2">续体积(m<sup>3</sup>)</th>
                    <th class="col_2">续费(元)</th>
                    <th class="col_2">操作</th>
                </tr>
                <tbody>
                <tr v-for="(item, index) in productFreights">
                    <td>
                        <span v-for="area in item.areaInfo">{{area.value}} </span>
                        <span class="btn" @click="showAreas(index)">编辑</span>
                        <areasBox class="area" @close="item.isShowArea = false" @getValue="setValue" v-show="item.isShowArea" :index="index"></areasBox>
                    </td>
                    <td><input type="number" v-model.number="item.firstUnit"></td>
                    <td><input type="number" v-model.number="item.firstPrice"></td>
                    <td><input type="number" v-model.number="item.addUnit"></td>
                    <td><input type="number" v-model.number="item.addPrice"></td>
                    <td class="operate" v-show="index === productFreights.length-1" @click="addRow">+</td>
                    <td class="operate" v-show="index !== productFreights.length-1" @click="delRow(index)">-</td>
                </tr>
                </tbody>
            </table>
        </div>
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
    import wholeArea from '../comm/wholeArea.vue'
    export default {
      props:['editObj'],
      data () {
        return {
          productFreights: [{
            areaInfo: [],
            firstUnit: 0,
            firstPrice: 0,
            addUnit: 0,
            addPrice: 0,
          }],
          defaultProductFreights: {},
          templateName: '',
          goodsAddress: [],
          deliveryTime: '',
          pinkageStatus: 0,
          pricingType: 0,
          initArea: false
        }
      },
      watch: {
        editObj: function () {
          if(this.editObj){
            this.templateName = this.editObj.templateName
            this.productFreights = this.editObj.spaceProductFreightAreaList
            this.defaultProductFreights = this.editObj.defaultProductFreights
            this.goodsAddress = [this.editObj.goodsAddress]
            this.pinkageStatus = this.editObj.pinkageStatus
            this.pricingType = this.editObj.pricingType
            this.deliveryTime = this.editObj.deliveryTime / 24
            this.initArea = this.editObj.goodAreaInfo
          }else{
            this.templateName = ''
            this.spaceFreights = [{
              areaInfo:[],
              pinkageType: 1,
              orderAmount: 0,
              goodsNumber: 0
            }]
            this.defaultProductFreights = {}
            this.goodsAddress = []
            this.pinkageStatus = -1
            this.pricingType = -1
            this.deliveryTime = ''
          }
        }
      },
      methods: {
        clear: function() {
          this.productFreights = [{
            areaInfo: [],
            firstUnit: 0,
            firstPrice: 0,
            addUnit: 0,
            addPrice: 0,
          }]
          this.defaultProductFreights = {}
          this.templateName = ''
          this.goodsAddress = []
          this.initArea = false
          this.pricingType = -1
          this.pinkageStatus = -1
          this.deliveryTime = ''
        },
        showAreas: function(index){
          this.$set(this.productFreights[index],'isShowArea',true)
          this.$nextTick(function(){
            $('.mainContent').scrollTop($('.mainContent').height())
          })
        },
        setValue: function(areaInfo, index){
          this.productFreights[index].areaInfo = areaInfo
        },
        addRow: function(){
          this.productFreights.push({
            areaInfo: [],
            firstUnit: 0,
            firstPrice: 0,
            addUnit: 0,
            addPrice: 0
          })
        },
        delRow: function(index){
          this.productFreights.splice(index, 1)
        },
        save: function(){
          var self = this
          this.$store.commit('setIsLoading', true)
          var productFreights = JSON.parse(JSON.stringify(this.productFreights))
          var allAreas = []
          productFreights.forEach(function(item){
            var ids = ''
            item.areaInfo.forEach(function(area){
              ids += area.id + ','
              allAreas.push(area.id)
            })
            item.areaIds = ids.substring(ids.length - 1, -1)
            delete item.areaInfo
            delete item.isShowArea
          })
          if(this.isSame(allAreas)){
            this.$store.commit('setToast', '所选区域有重复,请检查')
            this.$store.commit('setIsLoading', false)
            return
          }
          if(!this.templateName){
            this.$store.commit('setToast', '请填写模板名')
            this.$store.commit('setIsLoading', false)
            return
          }
          if(this.goodsAddress.length === 0){
            this.$store.commit('setToast', '请选择地址')
            this.$store.commit('setIsLoading', false)
            return
          }
          if(!this.deliveryTime){
            this.$store.commit('setToast', '请选择发货时间')
            this.$store.commit('setIsLoading', false)
            return
          }
          var data = {
            templateName: this.templateName,
            goodsAddress: this.goodsAddress[this.goodsAddress.length-1],
            deliveryTime: this.deliveryTime * 24,
            pinkageStatus: this.pinkageStatus,
            pricingType:this.pricingType,
            defaultProductFreights: '['+JSON.stringify(this.defaultProductFreights)+']',
            productFreights: JSON.stringify(productFreights)
          }
          if(this.editObj){
            data.templateId = this.editObj.templateId
            axios({
              method: 'post',
              url: '/tvshop/template/updateProductFreight',
              data:qs.stringify(data)
            }).then(function(res){
              self.$store.commit('setIsLoading', false)
              if(res.data.code === 20000){
                self.$store.commit('setToast', res.data.msg)
                location.reload()
              }else{
                self.$store.commit('setToast', res.data.msg)
              }
            })
          }else{
            axios({
              method: 'post',
              url: '/tvshop/template/addProductFreightTemplate',
              data:qs.stringify(data)
            }).then(function(res){
              self.$store.commit('setIsLoading', false)
              if(res.data.code === 20000){
                self.$store.commit('setToast', res.data.msg)
                setTimeout(function(){
                  location.reload()
                },600)
              }else{
                self.$store.commit('setToast', res.data.msg)
              }
            })
          }
        },
        cancel:function(){
          this.clear()
          this.$emit('changeState')
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
      components:{
        mySelect,
        areasBox,
        wholeArea
      }
    }
</script>
<style lang="scss">
    .addGoodsTemplate{
        .block label{
            text-align:right;
            vertical-align: middle;
        }
        input[name='templateName']{
            width:532px;
        }
        .no_edit{
            line-height:25px;
            vertical-align: middle;
        }
        .deliveryTime{
            width:200px;
        }
        .radioName{
            vertical-align: middle;
            font-size:16px;
            margin-left:10px;
            margin-right:30px;
        }
        .check_1{
            margin-right:50px;
        }
        .templateModel{
            padding-left:94px;
            margin-top:20px;
            padding-right:20px;
            input{
                border:1px solid #dbdbdb;
                height:20px;
                width:100px;
            }
        }
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