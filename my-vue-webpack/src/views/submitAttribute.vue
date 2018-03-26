<template>
    <div class="submitAttribute">
        <div class="mainContent">
            <h1 class="comm_title">属性管理 >> 添加属性 >> <a class="underline"
                                                      :href="BASE_URI+'/chooseCate/2'">{{menuTitle}}</a>
            </h1>
            <article class="comm_form" v-show="addShow">
                <h1 class="block_title">商品规格</h1>
                <!--显示已有属性-->
                <div class="add_class" v-for="hasAttr in hasAttribute">
                    <div class="size_name">
                        <h3 class="fl">属性名称：</h3>
                        <input type="text" v-model="hasAttr.skuName" readonly>
                    </div>
                    <div class="size_name">
                        <h3 class="fl">属性值：</h3>
                    </div>
                    <div class="main_add cf">
                        <div class="item" v-for="(val,index) in hasAttr.optionList">
                            <input type="text" v-model="val.optionalName" readonly>
                        </div>
                    </div>
                </div>
                <!--数据库已有属性-->
                <div class="main_box" v-for="(attributeitem,index) in attributeList" v-if="hasSize">
                    <div class="main_title cf">
                        <h3 class="fl">{{attributeitem.skuName}}</h3>
                        <button class="fl" @click="allSelect($event,attributeitem)">全选</button>
                        <button class="fl hidden" @click="allSelect($event,attributeitem)">全不选</button>
                        <button class="fl" @click="addSize($event,attributeitem,index)">+添加</button>
                    </div>
                    <div class="main cf">
                        <div class="item" v-for="option in attributeitem.optionalDomains">
                            <div class="choose" @click="select($event,attributeitem.skuName)">
                                <img src="../images/choosen.png">
                            </div>
                            <span>{{option.optionalName}}</span>
                        </div>
                    </div>
                    <div class="main_add cf">
                        <div class="item" v-for="group in attributeitem.addList">
                            <input type="text" v-model="group.skuOption">
                        </div>
                    </div>
                </div>
                <!--自定义属性-->
                <div class="add_class" v-for="Attribute in addAttribute">
                    <div class="size_name">
                        <h3 class="fl">属性名称：</h3>
                        <input type="text" v-model="Attribute.skuName">
                        <span>(如：颜色)</span>
                    </div>
                    <div class="size_name">
                        <h3 class="fl">属性值：</h3>
                        <button class="fl" @click="addSize($event, Attribute)">+添加</button>
                        <span>(为空则不添加 如：黄色，红色，蓝色)</span>
                    </div>
                    <div class="main_add cf">
                        <div class="item" v-for="(val,index) in Attribute.shopCategory">
                            <input type="text" v-model="Attribute.skuOption[index]">
                        </div>
                    </div>
                </div>
                <button class="button_type_4" @click="addClass()">+添加规格</button>
                <div class="button_box">
                    <button class="button_type_2" @click="submitClass">保存</button>
                    <button class="button_type_1" @click="giveUp">放弃</button>
                </div>
            </article>
            <article class="comm_form" v-show="!addShow">
                <h1 class="block_title">商品规格2</h1>
                <div class="add_class shop_size">
                    <div class="size_name">
                        <h3 class="fl">属性名称：</h3>
                        <input type="text" v-model="changeAttribute.skuName">
                        <span>(如：颜色)</span>
                    </div>
                    <div class="size_name">
                        <h3 class="fl">属性值：</h3>
                        <button class="fl" @click="addOption(changeAttribute.optionList)">+添加</button>
                        <span>(为空则不添加 如：黄色，红色，蓝色)</span>
                    </div>
                    <div class="main_add cf">
                        <div class="item" v-for="(val,index) in changeAttribute.optionList">
                            <input type="text" v-model="val.optionalName">
                            <input type="text" v-model="val.optionalId" v-show="false">
                        </div>
                    </div>
                </div>
                <div class="button_box">
                    <button class="button_type_2" @click="submitOption">保存</button>
                    <button class="button_type_1" @click="giveUp">放弃</button>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        menuTitle: '',
        categoryCode: '',
        hasAll: true,
        addShow: true,
        // 已有属性
        hasAttribute: [],
        // 自定义属性
        addAttribute: [],
        // 编辑属性
        changeAttribute: {},
        // 类别
        category: 1,
        choosenClass: {},
        skuOption: [],
        hasSize: false,
        attributeList: {},
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        // 设置类别ID和标题
        if (sessionStorage.getItem("menuTitle")) {
          vm.menuTitle = sessionStorage.getItem("menuTitle");
          vm.categoryCode = sessionStorage.getItem("categoryCode")
        }
        // 编辑
        if (sessionStorage.getItem("skuId")) {
          vm.categoryCode = sessionStorage.getItem('productCategoryCode')
          vm.addShow = false
          let data = {}
          data.skuId = sessionStorage.getItem("skuId");
          axios({
            method: "get",
            url: "/tvshop/product/getSkuOption",
            params: data
          }).then(function (res) {
            if (res.data.code === 20000) {
              vm.changeAttribute = res.data.resp.skuInfo
            } else {
              vm.$dealRes(res.data.code, res.data.msg);
            }
          })
        } else {
          let data = {}
          data.productCategoryCode = sessionStorage.getItem("categoryCode")
          // 获取系统属性列表
          axios({
            method: "get",
            url: "/tvshop/product/skuInfo",
            params: data
          }).then(function (res) {
            if (res.data.code === 20000) {
              if (res.data.resp.skuInfo.length === 0) {
                vm.hasSize = false
                vm.addAttribute.push({skuName: '', skuOption: [], shopCategory: 11})
              } else {
                vm.hasSize = true
                vm.attributeList = res.data.resp.skuInfo
                for (let i = 0, len = vm.attributeList.length; i < len; i++) {
                  vm.attributeList[i].addList = []
                }
              }
            } else {
              vm.$dealRes(res.data.code, res.data.msg);
            }
          })
          let para = {}
          para.categoryCode = sessionStorage.getItem("categoryCode")
          // 获取商品类型已有sku
          axios({
            method: "get",
            url: "/tvshop/product/categorySKU",
            params: para
          }).then(function (res) {
            if (res.data.code === 20000) {
              vm.hasAttribute = res.data.resp.categorySKU.prSKUInfos
            } else {
              vm.$dealRes(res.data.code, res.data.msg);
            }
          })
        }
      })
    },
    beforeRouteLeave(to, from, next){
      sessionStorage.removeItem("skuId")
      next()
    },
    methods: {
      addClass: function () {
        if (this.addAttribute)
          this.addAttribute.push({skuName: '', skuOption: [], shopCategory: 11})
      },
      addSize: function (event, item, index) {
        // 系统属性每次+5
        if (index) {
          for (let i = 0; i < 5; i++) {
            item.addList.push({})
          }
          this.$set(this.attributeList, index, item)
        } else {
          // 自定义属性每次+11
          item.shopCategory += 11
        }
      },
      select: function (event, key) {
        let target = {}
        if (event.target.tagName === 'IMG') {
          target = $(event.target).parent()
        } else {
          target = $(event.target)
        }
        if (target.hasClass('chosen')) {
          target.removeClass('chosen');
          let i = $.inArray(target.next().html(), this.choosenClass)
          this.choosenClass[key].splice(i, 1)
        } else {
          target.addClass('chosen');
          if (this.choosenClass[key] === undefined) {
            this.choosenClass[key] = []
          }
          this.choosenClass[key].push(target.next().html())
        }
        console.log(this.choosenClass)
      },
      allSelect: function (event, item) {
        let key = item.skuName
        $(event.target).addClass('hidden')
        if ($(event.target).html() === '全选') {
          $(event.target).next().removeClass('hidden')
          $(event.target).parent().parent().find('div.choose').addClass('chosen');
          if (this.choosenClass[key] === undefined) {
            this.choosenClass[key] = []
          }
          item.optionalDomains.forEach((val) => {
            this.choosenClass[key].push(val.optionalName)
          })
        } else {
          $(event.target).prev().removeClass('hidden')
          $(event.target).parent().parent().find('div.choose').removeClass('chosen')
          delete(this.choosenClass[key])
        }
//                console.log(this.choosenClass)
      },
      submitClass: function () {
        if (this.attributeList.length) {
          this.attributeList.forEach((val) => {
            val.addList.forEach((item) => {
              if (item.skuOption) {
                if (this.choosenClass[val.skuName] === undefined) {
                  this.choosenClass[val.skuName] = []
                }
                this.choosenClass[val.skuName].push(item.skuOption)
              }
            })
          })
          for (let key in this.choosenClass) {
            let self = this
            let para = []
            let val = self.choosenClass[key]
            para.categoryCode = self.categoryCode
            para.skuName = key
            para.skuOption = val.join(',')
//                        console.log(para)
            axios({
              method: "post",
              url: "/tvshop/product/addSkuOption",
              data: qs.stringify(para)
            }).then(function (res) {
              if (res.data.code === 20000) {
                self.$store.commit("setToast", "操作成功")
                setTimeout(function () {
                  location.href = '/hdjmanager/attributeManager'
                }, 1000)
              } else {
                self.$dealRes(res.data.code, res.data.msg);
              }
            })
          }
          console.log(this.choosenClass)
        }
        let self = this
        let para = []
        let flag= false
        this.addAttribute.forEach((val, index) => {
          let self = this
          para.push({categoryCode: '', skuName: '', skuOption: ''})
//                        para[index].categoryCode=self.categoryCode
          para[index].categoryCode = sessionStorage.getItem('categoryCode')
          para[index].skuName = val.skuName
          para[index].skuOption = val.skuOption.join(',')
          console.log(para)
          if (para[index].categoryCode !== '' && para[index].skuName !== '' && para[index].skuOption !== '') {
            axios({
              method: "post",
              url: "/tvshop/product/addSkuOption",
              data: qs.stringify(para[index])
            }).then(function (res) {
              if (res.data.code === 20000) {
                if (index === self.addAttribute.length - 1) {
                  self.$store.commit("setToast", "操作成功");
                  setTimeout(function () {
                    location.href = '/hdjmanager/attributeManager'
                  }, 1000);
                }
              } else {
                self.$dealRes(res.data.code, res.data.msg);
              }
            })
          } else {
            flag = true
          }
        })
        if (flag) {
          this.$store.commit("setToast", "请填写完整规格");
        }
      },
      addOption: function (arr) {
        let a = 11 - arr.length % 11
        for (let i = 0; i < a; i++) {
          arr.push({optionalName: '', optionalId: ''})
        }
      },
      submitOption: function () {
        let self = this
        let para = {}
        para.skuId = sessionStorage.getItem('skuId')
        para.skuName = self.changeAttribute.skuName
        para.categoryCode = self.categoryCode
        console.log(para)
        para.skuOption = ''
        self.changeAttribute.optionList.forEach((val) => {
          if (val.optionalName !== '') {
            para.skuOption += (val.optionalId + '&' + val.optionalName + ',')
          }
        })
        para.skuOption = para.skuOption.substr(0, para.skuOption.length - 1)
        axios({
          method: 'post',
          url: '/tvshop/product/updateSkuOption',
          data: qs.stringify(para)
        }).then(function (res) {
          if (res.data.code === 20000) {
            self.$store.commit("setToast", "操作成功");
            sessionStorage.removeItem("skuId")
//                        self.hasAll = true
//                        self.changeAttribute = {}
            setTimeout(function () {
              location.href = '/hdjmanager/attributeManager'
            }, 1000);
          } else {
            self.$dealRes(res.data.code, res.data.msg)
          }
        })
      },
      giveUp: function () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang='scss'>
    .submitAttribute {
        .mainContent {
            button, .choose {
                cursor: pointer;
            }
            .block_title {
                margin-bottom: 20px;
            }
            .main_box {
                width: 1000px;
                margin: 50px auto 50px;
                h3 {
                    line-height: 22px;
                }
                button {
                    width: 75px;
                    height: 22px;
                    background: #f3f3f3;
                    border: 1px dotted #dbdbdb;
                    margin-left: 36px;
                }
                .main, .main_add {
                    width: 931px;
                    /*margin-top: 30px;*/
                    padding: 0 20px;
                    .item {
                        width: 185px;
                        float: left;
                        margin-top: 20px;
                        input {
                            width: 60px;
                            height: 20px;
                            border: 1px solid #dbdbdb;
                        }
                        span {
                            font-size: 14px;
                        }
                        .choose {
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            border: 1px solid #dddddd;
                            &.chosen {
                                background: #a90f0f;
                            }
                            img {
                                margin-top: 2px;
                                margin-left: 1px;
                            }
                        }
                    }
                }
            }
            .add_class {
                width: 1000px;
                margin: 20px auto 0;
                .size_name {
                    margin-bottom: 20px;
                    h3 {
                        width: 80px;
                        line-height: 20px;
                    }
                    input {
                        width: 180px;
                        height: 20px;
                        border: 1px solid #dbdbdb;
                    }
                    span {
                        line-height: 20px;
                        color: #c4c4c4;
                        margin-left: 20px;
                    }
                    button {
                        width: 75px;
                        height: 22px;
                        background: #f3f3f3;
                        border: 1px dotted #dbdbdb;
                    }
                }
                .main_add {
                    padding-left: 80px;
                    .item {
                        float: left;
                        margin-bottom: 20px;
                        input {
                            margin-right: 20px;
                            width: 60px;
                            height: 20px;
                            border: 1px solid #dbdbdb;
                        }
                    }
                }
            }
            .button_type_4 {
                margin: 80px auto 80px;
            }
            .button_box {
                width: 588px;
                margin: 0 auto 100px;
                button {
                    width: 260px;
                    height: 50px;
                    &.button_type_1 {
                        margin-left: 60px;
                    }
                }
            }
            .shop_size {
                margin-bottom: 50px;
            }
        }
    }
</style>