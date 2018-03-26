<template>
    <div class="noSaleGoods">
        <div class="mainContent">
            <h1 class="comm_title">商品管理 >> {{status | getTitle}}</h1>
            <div class="comm_search_box">
                <div class="comm_search_item">
                    <label>商品名称</label>
                    <input type="text" name="" id="" v-model="productName" class="input_width_1" autocomplete>
                </div>
                <div class="comm_search_item">
                    <label>上架时间</label>
                    <datepicker class="dateChoose" v-model="beginTime" language="zh" :format="'yyyy-MM-dd'"
                                :clear-button="true" @cleared="beginTime=''"></datepicker>
                    <label>至</label>
                    <datepicker class="dateChoose" v-model="endTime" language="zh" :format="'yyyy-MM-dd'"
                                :clear-button="true" @cleared="endTime=''"></datepicker>
                </div>
                <div class="comm_search_item">
                    <label>价格</label>
                    <mySelect :items="priceItems" v-model="price" class="comm_select"></mySelect>
                </div>
                <div class="cf"></div>
                <div class="comm_search_item">
                    <label>栏目</label>
                    <mySelect :items="items" v-model="columnId" class="comm_select"></mySelect>
                </div>
                <button class="table_button" @click="jumpPage(1)">搜索</button>
                <button class="table_button" @click="download" v-if="!$isFactory">二维码下载</button>
            </div>
            <div class="comm_table_content">
                <ul class="comm_table_title">
                    <li class="col_type_2"><input type="checkbox" @click="chooseAllHandle" v-model="isChooseAll">全选</li>
                    <li class="col_type_4" v-if="!$isFactory"><span>二维码</span></li>
                    <li class="col_type_4"><span>图片</span></li>
                    <li class="col_type_5"><span>名称</span></li>
                    <li class="col_type_3"><span>编辑时间</span></li>
                    <li class="col_type_4"><span>价格</span></li>
                    <li class="col_type_3"><span>库存</span></li>
                    <li class="col_type_2"><span>销量</span></li>
                    <li class="col_type_4" v-show="status"><span>操作</span></li>
                </ul>
                <ul class="comm_table_raw" v-for="(item,$index) in initObj" @click.stop="showDetail(item)">
                    <li class="col_type_2"><input type="checkbox" v-model="item.isChoosed" @click.stop=""></li>
                    <li class="col_type_4" v-if="!$isFactory"><img :src="item.qrcodePicPath  |iconPic"
                                                @click.stop="$store.commit('setPicContainer',item.qrcodePicPath  )">
                    </li>
                    <li class="col_type_4"><img :src="item.productInfoDomain.productImage|iconPic"
                                                @click.stop="$store.commit('setPicContainer',item.productInfoDomain.productImage)">
                    </li>
                    <li class="col_type_5"><span class="ellipsis">{{item.productInfoDomain.productName}}</span></li>
                    <li class="col_type_3"><span>{{item.productInfoDomain.productEdittime | transDate}}</span></li>
                    <li class="col_type_4"><span>{{item.productInfoDomain.productPrice}}</span></li>
                    <li class="col_type_3"><span>{{item.inventoryCounts}}</span></li>
                    <li class="col_type_2"><span>{{item.soldCounts}}</span></li>
                    <li class="col_type_4 operate" v-show="status">
                        <button class="table_button" v-show="status === '1'"
                                @click.stop="changeGoodsState($index,item.productInfoDomain.productId,2)">下架
                        </button>
                        <button class="table_button" v-show="status === '0' || status === '2'"
                                @click.stop="changeGoodsState($index,item.productInfoDomain.productId,1)">上架
                        </button>
                        <br>
                        <div v-show="status === '0' || status === '2'">
                            <button class="edit" @click.stop="editGoods(item)">编辑</button>
                            <button class="del" @click.stop="delGoods(item.productInfoDomain.productId,$index)">删除
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
            <pagination :countNum="countNum" pageSize="6" @jumpPage="jumpPage"></pagination>
        </div>
        <detail-dialog v-show="isShowDetail" :detailContent="detailContent" @detailEvent="detailHandle"></detail-dialog>
    </div>
</template>
<script>
  import detailDialog from "../components/goodsManager/detailDialog.vue";
  import mySelect from "../components/goodsManager/mySelect.vue";
  export default {
    data() {
      return {
        isChooseAll: false,
        initObj: [],
        currentPage: "1",
        countNum: 0,
        status: "",
        //查询参数start
        productName: "",
        beginTime: "",
        endTime: "",
        price: "",
        columnId: "",
        items: [],
        priceItems: [{
          value: 1,
          text: "0-100"
        }, {
          value: 2,
          text: "100-200"
        }, {
          value: 3,
          text: "200-500"
        }, {
          value: 4,
          text: "500以上"
        }],
        //查询参数end
        isShowPic: false,
        showUrl: "",
        detailContent: {
          productInfoDomain: {},
          pictures: [],
          inventoryDomainExs: []
        },
        isShowDetail: false,
      }
    },
    methods: {
      download: function(){
        var productIds = ''
        this.initObj.forEach(function(item){
          if(item.isChoosed){
            productIds += item.productInfoDomain.productId + ','
          }
        })
        productIds = productIds.substring(productIds.length-1,-1)
        if(!productIds){
          this.$store.commit('setToast', '请选择要导出的二维码')
        }else{
          window.open('http://115.239.231.163/tvshop/product/downloadQrcode?productIds='+productIds)
        }
      },
      chooseAllHandle: function(){
        var isChooseAll = this.isChooseAll = !this.isChooseAll
        this.initObj.forEach(function(item){
          item.isChoosed = isChooseAll
        })
      },
      delGoods: function (id, index) {
        let self = this;
        axios({
          method: "post",
          url: "/tvshop/product/delProduct",
          data: qs.stringify({
            productId: id
          })
        }).then(function (res) {
          self.$store.commit("setToast", res.data.msg);
          if (res.data.code == 20000) {
            self.jumpPage(self.currentPage);
          }
        });
      },
      changeGoodsState: function (index, id, status) {
        let self = this;
        axios({
          method: "post",
          url: "/tvshop/product/changeProStatus",
          data: qs.stringify({
            'productId': id,
            "status": status
          })
        }).then(function (res) {
          self.$store.commit("setToast", res.data.msg);
          if (res.data.code == 20000) {
            self.jumpPage(self.currentPage);
          }
        });
      },
      editGoods: function (item) {
        if (item.inventoryDomainExs[0] && !item.inventoryDomainExs[0].prskuInfos[0].skuId) {
            this.$store.commit('setToast','暂不支持手机端上传的商品');
            return;
        }
        sessionStorage.setItem("productItem", JSON.stringify(item));
        sessionStorage.setItem("categoryCode", item.productInfoDomain.productCategoryCode);
        this.$router.push({
          path: "/submitGoods/" + item.productInfoDomain.productCategoryCode
        });
      },
      jumpPage: function (count) {
        this.currentPage = count;
        let self = this;
        let para = {
          pageSize: 6,
          pageIndex: count,
          status: this.status || null,
        };
        para.productName = this.productName || undefined;
        para.beginTime = this.beginTime ? this.beginTime.getTime() : undefined;
        para.endTime = this.endTime ? this.endTime.getTime() : undefined;
        switch (this.price) {
          case 1: {
            para.startPrice = 0;
            para.endPrice = 100;
            break;
          }
          case 2: {
            para.startPrice = 100;
            para.endPrice = 200;
            break;
          }
          case 3: {
            para.startPrice = 200;
            para.endPrice = 500;
            break;
          }
          case 4: {
            para.startPrice = 500;
            break;
          }
          default:
            break;
        }
        para.columnId = this.columnId || undefined;
        axios({
          method: "get",
          url: '/tvshop/product/productList',
          params: para
        }).then(function (res) {
          if (res.data.code == 20000) {
            self.initObj = res.data.resp.productList.list;
            self.countNum = res.data.resp.productList.totalRows;
          } else {
            self.$dealRes(res.data.code, res.data.msg);
          }
        }).catch(function (error) {
          self.$store.commit("setToast", "连接服务器失败,请稍后重试");
        })
      },
      showDetail: function (item) {
        this.detailContent = item;
        this.isShowDetail = true;
      },
      detailHandle: function (bool) {
        this.isShowDetail = false;
      }
    },
    watch: {
      '$route' (to, from) {
        this.status = to.params.goodsStatus;
        this.jumpPage(1);
      }
    },
    components: {
      detailDialog,
      mySelect
    },
    beforeRouteEnter: function (to, from, next) {
      let status = to.params.goodsStatus;
      let para = {
        pageSize: 6,
        pageIndex: 1,
        status: status
      };
      next(vm => {
        vm.$store.commit('setIsLoading', true)
        axios({
          method: "get",
          url: '/tvshop/product/productList',
          params: para
        }).then(function (res) {
          vm.$store.commit('setIsLoading', false)
          if (res.data.code == 20000) {
            vm.status = status || "";
            vm.initObj = res.data.resp.productList.list;
            vm.countNum = res.data.resp.productList.totalRows;
          } else {
            vm.$dealRes(res.data.code, res.data.msg);
          }
        }).catch(function (error) {
          vm.$store.commit("setToast", "连接服务器失败,请稍后重试");
        })
        axios({
          method: "get",
          url: '/tvshop/shop/proColumnList'
        }).then(function (res) {
          if (res.data.code == 20000) {
            let items = res.data.resp.proColumn;
            for (var i = 0; i < items.length; i++) {
              items[i].value = items[i].columnId;
              items[i].text = items[i].columnName;
            }
            vm.items = items;
          } else {
            vm.$dealRes(res.data.code, res.data.msg);
          }
        }).catch(function (error) {
          vm.$store.commit("setToast", "连接服务器失败,请稍后重试");
        })
      });
    }
  }
</script>
<style lang="scss">
    .noSaleGoods {
        .scroll_me {
            overflow: hidden;
            min-height: 600px;
        }
        .comm_search_box {
            height: 120px;
            .table_button {
                margin-top: 20px;
                height: 26px;
                margin-left: 20px;
            }
        }
        .edit,
        .del {
            background: none;
            cursor: pointer;
            width: 45px;
            height: 30px;
            margin-top: 5px;
        }
    }
</style>