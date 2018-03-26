<template>
    <div class="areasBox">
        <div class="model" @click="$emit('close')"></div>
        <div class="relative">
            <div class="title">
                <span class="fl">请选择地区</span>
                <span class="fr" @click="$emit('close')">×</span>
            </div>
            <div class="row" v-for="(area, i) in areaInfo">
                <div class="fl">
                    <figure @click="choose(i)" :class="{'active': area.isChecked}"><img src="../../images/tick.png" alt=""></figure>
                    <span>{{area.region}}</span>
                </div>
                <div class="fr">
                    <div class="level_2" v-for="(item, j) in area.areas">
                        <figure @click="choose(i,j)" :class="{'active': item.isChecked}"><img src="../../images/tick.png" alt=""></figure>
                        <span>{{item.value}}</span>
                    </div>
                </div>
            </div>
            <div class="row"></div>
        </div>
    </div>
</template>
<script>
    export default {
      props:['index'],
      data () {
        return {
          areaInfo: []
        }
      },
      methods: {
        choose: function (i, j) {
          if(typeof j !== 'undefined'){
            var bool = this.areaInfo[i].areas[j].isChecked
            this.$set(this.areaInfo[i].areas[j], 'isChecked', !bool)
          }else{
            var _this = this
            var bool = this.areaInfo[i].isChecked
            this.$set(this.areaInfo[i], 'isChecked', !bool)
            this.areaInfo[i].areas.forEach(function(item){
              _this.$set(item, 'isChecked', !bool)
            })
          }
          this.getChoosedArea()
        },
        getChoosedArea: function(){
          var chosenArea = []
          this.areaInfo.forEach(function(area){
            area.areas.forEach(function(item){
              if(item.isChecked){
                chosenArea.push({
                  id: item.id,
                  value: item.value
                })
              }
            })
          })
          this.$emit('getValue', chosenArea, this.index)
        }
      },
      created: function () {
        var self = this
        axios({
          method: 'get',
          url: '/tvshop/template/getAreaInfo'
        }).then(function(res){
          if(res.data.code === 20000){
            self.areaInfo = res.data.resp.areaInfo
          }
        })
      }
    }
</script>
<style lang="scss">
    .areasBox{
        position:absolute;
        width:674px;
        border:1px solid #dbdbdb;
        z-index:10;
        background:#fff;
        margin-bottom:20px;
        .model{
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
        }
        .title{
            background:#fafafa;
            height:40px;
            border-bottom:1px solid #dbdbdb;
            .fl{
                line-height:40px;
                font-size:16px;
                margin-left:20px;
            }
            .fr{
                height:40px;
                line-height:40px;
                font-size:20px;
                margin-right:20px;
                cursor:pointer;
            }
        }
        .row{
            padding:0px 20px 10px;
            overflow:hidden;
            .fl{
                margin-right:60px;
                margin-top:20px;
                span{
                    font-size:16px;
                    font-weight:bold;
                    line-height:18px;
                }
            }
            .fr{
                width:496px;
                .level_2{
                    width:110px;
                    margin-top:20px;
                    span{
                        font-size:16px;
                        line-height:18px;
                    }
                }
            }
            .fl,.level_2{
                float:left;
                text-align: left;
                figure{
                    float:left;
                    border:1px solid #dbdbdb;
                    width:16px;
                    height:16px;
                    margin-right:10px;
                    img{
                        display:none;
                    }
                }
                figure.active{
                    background:#a90f0f;
                    border-color:#a90f0f;
                    img{
                        display:block;
                        margin:4px auto;
                    }
                }
            }
        }
    }
</style>