<template>
  <div class="submitGoods">
    <div class="mainContent">
      <h1 class="comm_title" v-show="status === '1'">商品管理 >> 发布商品 >> <a :href="BASE_URI+'/chooseCate/1'">选择商品分类</a></h1>
      <h1 class="comm_title" v-show="status === '2'">属性管理 >> 发布属性 >> <a :href="BASE_URI+'/chooseCate/2'">选择商品分类</a></h1>
      <h2 class="title">您当前所选类目:<span>{{menuTitle}}</span></h2>
      <div class="pack">
        <search-box class="searchBox" v-model="nameLike"></search-box>
        <button class="button_type_3" @click="search">搜索</button>
      </div>
      <div class="cateChoose">
        <scroll-area ident="one" :treeData="treeDataOne" class="scrollBox"
                     @getChildData="setChildData"></scroll-area>
        <s></s>
        <scroll-area ident="two" :treeData="treeDataTwo" class="scrollBox"
                     @getChildData="setChildData"></scroll-area>
        <s></s>
        <scroll-area ident="three" :treeData="treeDataThree" class="scrollBox no-margin"
                     @getChildData="setChildData"></scroll-area>
      </div>
      <button @click="jump(0)" class="button_type_2" v-show="status === '1'">发布商品</button>
      <button @click="jump(1)" class="button_type_2" v-show="status === '2'">发布属性</button>
    </div>
  </div>
</template>
<script type="text/javascript">
  import searchBox from '../components/chooseCate/searchBox.vue';
  import scrollArea from '../components/chooseCate/scrollArea.vue';
//  import {cates} from  '../js/choosCate'
  export default {
    data() {
      return {
        //搜索词
        nameLike: "",
        //状态码
        status: '',
        //选中类Id
        categoryCode: "",
        //三栏数据
        treeDataOne: {},
        treeDataTwo: {},
        treeDataThree: {},
        //面包屑
        menuTitle: ""
      }
    },
    watch: {
      '$route' (to, from) {
        this.status = to.params.state
      }
    },
    methods: {
      setChildData: function (item) {
        this.categoryCode = item.productCategoryCode;
        if (item.treeCode == "one") {
          this.menuTitle = item.productCategoryName;
          this.treeDataTwo = item.sonCategories;
        } else if (item.treeCode == "two") {
          this.menuTitle = this.menuTitle.split(" >> ")[0] + " >> " + item.productCategoryName;
          this.treeDataThree = item.sonCategories;
        } else {
          this.menuTitle = this.menuTitle.split(" >> ")[0] + " >> " + this.menuTitle.split(" >> ")[1] + " >> " + item.productCategoryName;
        }
      },
      search: function () {
        let self = this;
        if(self.nameLike!==''){
            axios({
                method: "get",
                url: "/tvshop/product/searchCategory",
                params: {
                    nameLike: this.nameLike
                }
            }).then(function (res) {
                self.treeDataThree = null;
                self.treeDataTwo = null;
                if(res.data.resp.categoryList.length>0){
                    self.treeDataOne = res.data.resp.categoryList;
                }else{
                    self.$store.commit("setToast", "找不到该目录，请重新查找");
                }
            });
        }else{
            this.$store.commit("setToast", "请输入类目名称");
        }
      },
      jump: function (index) {
        if (this.categoryCode == "") {
          this.$store.commit("setToast", "请选择类别");
          return;
        } else {
          sessionStorage.setItem("menuTitle", this.menuTitle);
          sessionStorage.setItem("categoryCode", this.categoryCode);
          if (index === 0) {
            this.$router.push('/submitGoods/' + this.categoryCode);
          } else if (index === 1) {
            this.$router.push('/submitAttribute/' + this.categoryCode);
          }
        }
      }
    },
    components: {
      searchBox,
      scrollArea
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.status = vm.$route.params.state
        vm.$store.commit('setIsLoading', true)
        axios({
          method: "get",
          url: "/tvshop/product/categoryList"
        }).then(function (res) {
          vm.$store.commit('setIsLoading', false)
          if (res.data.code == 20000) {
            vm.treeDataOne = res.data.resp.categoryList;
            console.log(res.data)
          } else {
            vm.$dealRes(res.data.code, res.data.msg);
          }
        })
//          vm.treeDataOne=cates;
      })
    }
  }
</script>
<style lang="scss" scoped>
  .submitGoods {

    .pack {
      height: 33px;
      margin-top: 30px;
    }

    .title {
      padding-left: 20px;
      margin-top: 20px;

      span {
        color: #a90f0f;
        font-size: 18px;
      }

    }
    .searchBox {
      float: left;
      border-radius: 2px;
      margin-left: 320px;
    }

    .button_type_3 {
      float: left;
      margin-left: 30px;
    }

    .cateChoose {
      clear: left;
      margin-top: 40px;
      margin-left: 40px;
      height: 430px;
    }

    .scrollBox {
      float: left;
    }

    s {
      background: url(../images/icon_list.png) no-repeat center center;
      background-position: -70px -33px;
      width: 14px;
      height: 28px;
      float: left;
      margin-top: 200px;
      margin-left: 15px;
      margin-right: 15px;
    }

    .button_type_2 {
      margin-left: 430px;
      display: block;
      width: 350px;
      height: 55px;
      margin-top: 60px;
      text-align: center;
      color: #fff;
      line-height: 55px;
      margin-bottom:68px;
    }

    @media screen and (min-width: 1400px) {
      .pack {
        margin-left: 40px;
      }

      .cateChoose {
        margin-left: 80px;
      }

      .button_type_2 {
        margin-left: 470px;
      }
    }

  }
</style>
