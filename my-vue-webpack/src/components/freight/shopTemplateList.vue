<template>
    <div class="shopTemplateList">
        <div v-for="(freights,$index) in freightsList">
            <h1 class="templateName"><figure class="fl" :class="{'active': chosenIndex == $index}" @click="chooseTemplate($index,freights.templateId)"><img src="../../images/tick_2.png" alt=""></figure>{{freights.templateName}} <span class="fr no_margin" @click="del(freights.templateId)">删除</span><span class="fr" @click="edit(freights)">编辑</span></h1>
            <table>
                <tr>
                    <th class="col_1">运送到</th>
                    <th class="col_2">配送方式</th>
                    <th class="col_3">包邮条件</th>
                </tr>
                <tbody>
                <tr v-for="item in freights.spaceFreightAreaList">
                    <td><span v-for="area in item.areaInfo">{{area.value}} </span></td>
                    <td>快递</td>
                    <td>
                        <span v-if="item.pinkageType == 3">满{{item.goodsNumber}}件且需{{item.orderAmount}}元以上包邮</span>
                        <span v-if="item.pinkageType == 1">满{{item.goodsNumber}}件包邮</span>
                        <span v-if="item.pinkageType == 2">满{{item.orderAmount}}元包邮</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
    export default {
      data () {
        return {
          chosenIndex: -1,
          freightsList: []
        }
      },
      methods: {
        del: function (id) {
          var self = this
          axios({
            method: 'post',
            url: '/tvshop/template/delSpaceFreight',
            data: qs.stringify({
              templateId: id
            })
          }).then(function(res){
            if(res.data.code === 20000) {
              self.$store.commit('setToast', res.data.msg)
              location.reload()
            }
          })
        },
        edit: function (item) {
          this.$emit('edit', item)
        },
        chooseTemplate: function(index, id){
          var self = this
          axios({
            method: 'post',
            url: '/tvshop/template/chooseSpaceFreight',
            data: qs.stringify({
              templateId: id
            })
          }).then(function(res){
            if(res.data.code == 20000){
              self.chosenIndex = index
            }else{
              self.$store.commit('setToast', '选择失败')
            }
          })
        }
      },
      created: function() {
        var _this = this
        axios({
          method: 'get',
          url: '/tvshop/template/getSpaceFreightList'
        }).then(function(res){
          if (res.data.code === 20000) {
            _this.freightsList = res.data.resp.spaceFreight
            _this.freightsList.forEach(function(item,index){
              if(item.templateStatus === 1){
                _this.chosenIndex = index
              }
            })
          } else {
            _this.$dealRes(res.data.code, res.data.msg);
          }
        })
      }
    }
</script>
<style lang="scss">
    .shopTemplateList{
        padding:20px 20px;
        .templateName{
            font-size:20px;
            line-height:22px;
            figure{
                border:1px solid #e8e8e8;
                width:20px;
                height:20px;
                border-radius:50%;
                margin-right:10px;
                cursor:pointer;
                img{
                    display:none;
                    width:14px;
                    height:10px;
                }
            }
            figure.active{
                background:#a90e0e;
                border-color:#a90e0e;
                img{
                    display:block;
                    margin-top:4px;
                    margin-left:3px;
                }
            }
            .fr{
                margin-right:20px;
                line-height:22px;
                color:#2713ee;
                font-size:16px;
                cursor:pointer;
            }
            .fr:hover{
                text-decoration: underline;
            }
        }
        table{
            width:100%;
            margin-top:20px;
            margin-bottom:20px;
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
                min-width:500px;
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