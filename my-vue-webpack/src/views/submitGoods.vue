<template>
    <div class="submitGoods">
        <div class="mainContent">
            <h1 class="comm_title">商品管理 >> 发布商品 >> <a class="underline"
                                                      :href="BASE_URI+'/chooseCate/1'">{{menuTitle}}</a>
            </h1>
            <article class="comm_form">
                <h1 class="block_title">1.商品基本信息</h1>
                <section class="block">
                    <label>
                        栏目分类</label>
                    <a class="gogogo" href="/hdjmanager/columnManager" v-show="!hasColumnList">点击此处添加栏目</a>
                    <my-radio v-show="hasColumnList" :proColumnList="proColumnList"
                              @setColumnId="setColumnId"></my-radio>
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        商品名称</label>
                    <input type="text" name="goodsName" v-model="proName" placeholder="请输入商品名称,不能多于30字,必填"
                           maxlength="30"><span class="mark">{{proName.length}}/30</span>
                </section>
                <section class="block">
                    <label>重量(kg)</label>
                    <input type="number" name="weight" v-model="weight" placeholder="运费模板类型为重量时必选">
                </section>
                <section class="block">
                    <label>体积(m<sup>3</sup>)</label>
                    <input type="number" name="volumn" v-model="volumn" placeholder="运费模板类型为体积时必选">
                </section>
                <section class="block" v-if="permission === '1'">
                    <label>
                        <mark>*</mark>
                        商品货号</label>
                    <input type="text" name="productNumber" v-model="productNumber" placeholder="请输入商品货号,不能多于30字,必填"
                           maxlength="30"><span class="mark">{{productNumber.length}}/30</span>
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        商品原价</label>
                    <input type="number" name="productPrice" v-model="productPrice" placeholder="请输入商品原价,不能多于30字,必填"
                           maxlength="15">
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        商品主图</label><span class="mark2">商品主图必须上传一张,单张图片大小不能超过2M</span>
                    <div class="collection">
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" :initImage="getImageSrc(0)" index="one"
                                    :clearImage="clearImage" :isEdit="isEdit"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" :initImage="getImageSrc(1)" index="two"
                                    :clearImage="clearImage" :isEdit="isEdit"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" :initImage="getImageSrc(2)" index="three"
                                    :clearImage="clearImage" :isEdit="isEdit"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" :initImage="getImageSrc(3)" index="four"
                                    :clearImage="clearImage" :isEdit="isEdit"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" :initImage="getImageSrc(4)" index="five"
                                    :clearImage="clearImage" :isEdit="isEdit"></pic-upload>
                        <video-upload class="no_margin" v-model="videoId"></video-upload>
                    </div>
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        商品规格</label>
                    <new-goods-size :chooseSize="sizeGroup" @setNewSize="setNewSize" :pAlarm="alarm"
                                    :permission="permission"></new-goods-size>
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        商品详情</label>
                    <div class="customEditorContainer">
                        <div id="customEditor" style="height:446px;max-height:446px;"></div>
                        <div class="buttons">
                            <button class="editorButton" @click="saveText">立即保存</button>
                            <button class="editorButton" @click="clearEditor">清空内容</button>
                            <button class="editorButton" @click="preview">预览</button>
                        </div>
                    </div>
                </section>
            </article>
            <article class="comm_form" v-if="permission === '1'">
                <h1 class="block_title">2.权限设置</h1>
                <section class="block">
                    <label>权限设置</label>
                    <div class="saleProtection">
                        <div class="row">
                            <input name="resaleTag" type="checkbox" v-model="resaleTag.checked"> 允许其他商家代销该商品
                        </div>
                        <div class="row" v-show="resaleTag.checked">
                            <input name="priceTag" type="checkbox" v-model="priceTag.checked"> 允许其他商家修改该商品的代销零售价
                        </div>
                    </div>
                </section>
            </article>
            <article class="comm_form">
                <h1 class="block_title" v-if="permission === '1'">3.运费模板</h1>
                <h1 class="block_title" v-if="permission !== '1'">2.运费模板</h1>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        模板选择</label>
                    <div class="saleProtection">
                        <div class="row" v-for="(template, $index) in templateList">
                            <input name="resaleTag" type="radio" v-model="goodsTemplate" :value="template">
                            {{template.templateName}}
                        </div>
                    </div>
                </section>
            </article>
            <article class="comm_form">
                <section class="centerBlock">
                    <button class="button_type_2" @click="submitGoods(1)">发布</button>
                    <button class="button_type_1" @click="submitGoods(0)">保存</button>
                </section>
            </article>
        </div>
        <next-dialog @clear="clearContent" v-show="isShowNext" :status="status"></next-dialog>
        <preview @clear="clearContent" v-show="isShowPreview" v-on:close="closePrev" :showPrev="showPrev"></preview>
    </div>
</template>
<script>
  import picUpload from '../components/comm/picUpload.vue';
  import videoUpload from '../components/comm/videoUpload.vue';
  import myRadio from '../components/comm/myRadio.vue';
  import goodsSize from '../components/submitGoods/goodsSize.vue';
  import newGoodsSize from '../components/submitGoods/newGoodsSize.vue';
  import nextDialog from "../components/submitGoods/next.vue";
  import preview from "../components/submitGoods/preview.vue";
  import wangEditor from 'wangeditor/dist/js/wangEditor.js';
  var editor = {};
  export default {
    data() {
      return {
        //商品基本信息
        proName: "",
        weight: '',
        volumn: '',
        productPrice: '',
        productFreight: '',
        productNumber: '',
        productStorageAlam: 0,
        columnId: "",
        proPic: {},
        pictures: [],
        clearImage: false, //图片上传组件用到
        videoId: "",
        detailContent: "",
        status: 0,
        // 旧的产品规格
        sizeGroup: [],
        //规格字符串
        sizeStr: '',
        isSizeOk: false,
        doclear: false,
        permission: '',
        resaleTag: {
          checked: ''
        },
        priceTag: {
          checked: ''
        },
        // 初始化页面显示
        //栏目显示
        proColumnList: [],
        hasColumnList: true,
        //选择分类
        categoryCode: this.$route.params.categoryCode,
        //编辑标识,编辑产品的ID
        isEdit: false,
        productId: "",
        //面包屑标题
        menuTitle: "",
        // next弹出框
        isShowNext: false,
        // 显示详情页预览
        showPrev: "",
        isShowPreview: false,
        //库存报警数量
        alarm: 0,
        //运费模板
        templateList: [],
        goodsTemplate: false
      }
    },
    watch: {
      isEdit: function () {
        if (this.isEdit) {
          editor.$txt.html(this.detailContent);
        }
      }
    },
    components: {
      picUpload,
      videoUpload,
      goodsSize,
      myRadio,
      nextDialog,
      preview,
      newGoodsSize
    },
    methods: {
      setNewSize: function (str, productStorageAlam, bool) {
        this.sizeStr = str
        this.productStorageAlam = productStorageAlam
        this.isSizeOk = bool
      },
      saveText: function () {
        this.$store.commit("setToast", "保存成功");
        localStorage.setItem("editText", editor.$txt.html());
      },
      pushPicId: function (id, index) {
        this.clearImage = false;
        this.proPic[index] = id;
      },
      setColumnId: function (id) {
        if (id) {
          this.columnId = id;
        } else {
          this.columnId = null;
        }
      },
      getImageSrc: function (index) {
//                console.log(this.pictures)
        if (!this.pictures) {
          return
        }
        if (this.pictures.length - 1 < index) {
          return "";
        } else {
          return this.pictures[index];
        }
      },
      submitGoods: function (status) {
        this.$store.commit('setIsLoading', true)
        this.status = status;
        let sizeValue = "";
        let data = {};
        sizeValue = this.sizeStr
        //将图片对象转为数组
        let pics = "";
        for (var i in this.proPic) {
          pics += this.proPic[i] + ",";
        }
        pics = pics.slice(0, -1);
        //判断选中规格数量
        var result = /optionalIds=(\d*,?)*&?\|?/.exec(this.sizeStr)
        if(this.permission === '1' && result && result[0].split(',').length != 2){
          this.$store.commit("setToast", "规格必须选中两条");
          this.$store.commit('setIsLoading', false)
          return;
        }
        //判断产品名是否填写
        if ($.trim(this.proName) == "") {
          this.$store.commit("setToast", "请填写产品名");
          this.$store.commit('setIsLoading', false)
          return;
        }
        if(!this.isSizeOk){
          this.$store.commit("setToast", "产品规格中库存,价格必须大于0");
          this.$store.commit('setIsLoading', false)
          return;
        }
        //判断是否上传图片
        if (pics.length < 1) {
          this.$store.commit("setToast", "请至少上传一张图片");
          this.$store.commit('setIsLoading', false)
          return;
        }
        //详细描述必选
        if (editor.$txt.html() == "") {
          this.$store.commit("setToast", "请填写商品描述");
          this.$store.commit('setIsLoading', false)
          return;
        }
        //运费模板必选
        if (!this.goodsTemplate) {
          this.$store.commit("setToast", "请选择运费模板");
          this.$store.commit('setIsLoading', false)
          return;
        }
        //根据包邮类型判断,重量体积是否必穿
        if (this.goodsTemplate.pricingType === 1 && !this.weight) {
          this.$store.commit("setToast", "请填写质量");
          this.$store.commit('setIsLoading', false)
          return;
        }
        if (this.goodsTemplate.pricingType === 2 && !this.weight) {
          this.$store.commit("setToast", "请填写体积");
          this.$store.commit('setIsLoading', false)
          return;
        }
        if(this.productPrice==''){
          this.$store.commit("setToast", "价格不能为空");
          this.$store.commit('setIsLoading', false)
          return false;
        }else if(Number(this.productPrice)<=0){
          this.$store.commit("setToast", "价格必须大于0");
          this.$store.commit('setIsLoading', false)
          return false;
        }
        data.proName = this.proName;
        data.proPics = pics;
        data.specs = sizeValue;
        data.productDetail = editor.$txt.html();
        if (this.videoId) {
          data.videoId = this.videoId;
        }
        data.categoryCode = parseInt(this.categoryCode);
        data.columnId = this.columnId;
        data.productPrice = this.productPrice;
        data.weight = this.weight
        data.volumn = this.volumn
        data.templateId = this.goodsTemplate.templateId
        if (this.permission == 1) {
          data.productNumber = this.productNumber;
          data.resaleTag = this.resaleTag.checked ? 1 : 0
          data.priceTag = this.priceTag.checked ? 1 : 0
          data.productStorageAlam = this.productStorageAlam
        }
        //发布
        data.status = status;
        let self = this;
        if (this.isEdit) {
          data.productId = this.productId;
          axios({
            method: "post",
            url: "/tvshop/product/updateProduct",
            data: qs.stringify(data)
          }).then(function (res) {
            self.$store.commit('setIsLoading', false)
            if (res.data.code == 20000) {
              self.isShowNext = true;
              localStorage.removeItem("editText");
            } else {
              self.$dealRes(res.data.code, res.data.msg);
            }
          }).catch(function (msg) {
            self.$store.commit("setToast", "连接服务器失败,请稍后重试");
          });
        } else {
          axios({
            method: "post",
            url: "/tvshop/product/addProduct",
            data: qs.stringify(data)
          }).then(function (res) {
            self.$store.commit('setIsLoading', false)
            if (res.data.code == 20000) {
              self.isShowNext = true;
              localStorage.removeItem("editText");
            } else {
              self.$dealRes(res.data.code, res.data.msg);
            }
          }).catch(function (msg) {
            self.$store.commit("setToast", "连接服务器失败,请稍后重试");
          });
        }
      },
      clearContent: function () {
        this.sizeGroup = [];
        this.proName = "";
        this.doclear = true;
        this.videoId = "";
        this.columnId = "";
        //用对象保存图片,最后在转成数组
        this.proPic = {};
        this.isEdit = false;
        this.pictures = [];
        this.detailContent = "";
        this.productId = "";
        this.isShowNext = false;
        this.clearImage = true;
        this.sizeGroup = [];
        this.productNumber = '';
        this.productPrice = 0;
        this.productFreight = 0;
        this.alarm = 0;
        this.resaleTag = {
          checked: ''
        },
          this.priceTag = {
            checked: ''
          },
          editor.clear();
        sessionStorage.removeItem('productItem')
        var clumnList = [];
        for (var i = 0; i < this.proColumnList.length; i++) {
          //深拷贝,触发vue数据响应
          clumnList.push(this.proColumnList[i]);
          clumnList[i].isChoosed = false;
        }
        this.proColumnList = clumnList;
        this.$el.scrollTop = 0;
        $('.item').find('div.choose').removeClass('chosen')
      },
      clearEditor: function () {
        editor.clear();
        localStorage.removeItem("editText");
      },
      preview: function () {
        this.isShowPreview = true;
        this.showPrev = editor.$txt.html();
//                console.log(this.showPrev);
      },
      closePrev: function () {
        this.isShowPreview = false;
      }
    },
    beforeRouteEnter(to, from, next) {
      var productItem = null;
      next(vm => {
        vm.permission = sessionStorage.getItem('permission')
        if (sessionStorage.getItem("menuTitle")) {
          vm.menuTitle = sessionStorage.getItem("menuTitle");
        }
        axios({
          method: "get",
          url: "/tvshop/shop/proColumnList"
        }).then(function (res) {
          if (res.data.code == 20000) {
            let proColumnList = res.data.resp.proColumn;
            vm.proColumnList = proColumnList;
            if (proColumnList.length == 0) {
              vm.hasColumnList = false;
            }
            if (sessionStorage.getItem("productItem")) {
              productItem = JSON.parse(sessionStorage.getItem("productItem"));
              for (var i = 0; i < proColumnList.length; i++) {
                if (proColumnList[i].columnId == productItem.productInfoDomain.columnId) {
                  proColumnList[i].isChoosed = true;
                }
              }
              if (!productItem.pictures) {
                productItem.pictures = []
              }
              productItem.pictures.unshift({
                productId: productItem.productInfoDomain.productId,
                picId: productItem.productInfoDomain.picId,
                picturePath: productItem.productInfoDomain.productImage
              })
              vm.proColumnList = proColumnList;
              vm.isEdit = true;
              vm.proName = productItem.productInfoDomain.productName;
              vm.productNumber = productItem.productInfoDomain.productNumber;
              vm.productPrice = productItem.productInfoDomain.productPrice;
              vm.productFreight = productItem.productInfoDomain.productFreight;
              vm.resaleTag.checked = productItem.productInfoDomain.resaleTag;
              vm.priceTag.checked = productItem.productInfoDomain.priceTag;
              vm.alarm = productItem.productInfoDomain.productStorageAlarm;
              //保存初值,并在组件中给proPic赋值
              vm.pictures = productItem.pictures;
              vm.videoId = productItem.productInfoDomain.videoId;
              vm.columnId = productItem.productInfoDomain.columnId;
              vm.columnId = productItem.productInfoDomain.columnId;
              vm.detailContent = productItem.productInfoDomain.productDesc;
              vm.sizeGroup = productItem.inventoryDomainExs;
              vm.productId = productItem.productInfoDomain.productId;
              vm.menuTitle = productItem.productInfoDomain.productCategoryDesc;
              vm.templateId = productItem.productInfoDomain.templateId;
              vm.weight = productItem.productInfoDomain.productWeight;
              vm.volumn = productItem.productInfoDomain.productVolume;
            }
          } else {
            vm.$dealRes(res.data.code, res.data.msg);
          }
        })
      })
    },
    beforeRouteLeave(to, from, next) {
      sessionStorage.removeItem("productItem");
      sessionStorage.removeItem("menuTitle");
      next();
    },
    created: function () {
      var self = this
      axios({
        method: 'get',
        url: '/tvshop/template/getProductFreightList'
      }).then(function (res) {
        if (res.data.code === 20000) {
          self.templateList = res.data.resp.productFreight
        } else {
          self.$store.commit('setToast', '获取商品运费模板列表失败')
        }
      })
    },
    mounted: function () {
      let self = this;
      editor = new wangEditor('customEditor');
      editor.config.menus = [
        'fontfamily',
        'fontsize',
        'bold',
        'italic',
        'underline',
        'lineheight',
        'indent',
        'strikethrough',
        'forecolor',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        'img',
        'emotion'
      ];
      editor.config.uploadImgUrl = 'http://api.vrshop.hongdoujiao.com:8721/tvshop/app/upload';
//      editor.config.uploadImgUrl = 'http://115.239.231.163/tvshop/app/upload';
      editor.config.uploadImgFileName = "file";
      editor.config.uploadParams = {
        type: '2'
      };
      editor.config.hideLinkImg = true;
      editor.config.uploadImgFns.onload = function (res) {
//                console.log(editor)
        axios({
          method: "get",
          url: "/tvshop/app/picUrl",
          params: {
            picId: res
          }
        }).then(function (res) {
          var html = '<img src="' + res.data.resp.picUrl + '" style="vertical-align:bottom;display:inline-block;max-width:100%;"/>';
          editor.command(null, 'insertHtml', html);
        });
      }
      editor.create();
      editor.$txt.html(localStorage.getItem("editText"));
    }
  }
</script>
<style lang="scss" scoped>
    .submitGoods {
        .danger_title {
            line-height: 40px;
            font-size: 18px;
            color: #a90e0e;
        }
        .gogogo, .skuInfo {
            color: #a90e0e;
            text-decoration: underline;
        }
        .button_type_4 {
            margin-left: 580px;
        }

        .block_title {
            font-size: 18px;
            margin-bottom: 20px;
        }

        .block {
            margin-bottom: 20px;

            label {
                display: inline-block;
                width: 105px;
                height: 25px;
                line-height: 25px;
                text-align: right;
                margin-right: 10px;

                mark {
                    color: #a90e0e;
                    background: none;
                }
            }
            .row {
                &:nth-child(1) {
                    margin-top: 0;
                }
                margin-top: 20px;
                width: 960px;
                input[name="resaleTag"],
                input[name="priceTag"] {
                    width: 23px;
                    height: 23px;
                }
            }
            input[name="goodsName"],
            input[name="weight"],
            input[name="volumn"],
            input[name="productPrice"],
            input[name="productNumber"],
            input[name="productFreight"] {
                height: 23px;
                width: 910px;
                border: 1px solid #dbdbdb;
                vertical-align: middle;
                padding: 0 20px;
            }

            .btnStyle {
                width: 150px;
                height: 150px;
                background: #f3f3f3;
                cursor: pointer;
                float: left;
                margin-right: 20px;
                border: #dbdbdb 1px solid;
                position: relative;

                input {
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    position: absolute;
                    left: 0;
                    top: 0;
                }

                s {
                    display: block;
                    width: 36px;
                    height: 36px;
                    margin-top: 57px;
                    margin-left: 57px;
                    background: url(../images/icon_list.png) no-repeat center center;
                    background-position: -66px -134px;
                }
            }
            textarea {
                display: inline-block;
                width: 910px;
                height: 188px;
                border: 1px solid #dbdbdb;
                padding: 10px 20px;
                vertical-align: top;
                outline: none;
                resize: none;
                font-size: 16px;
            }

            .mark {
                color: #888;
                line-height: 27px;
                margin-left: 15px;
            }

            .mark2 {
                display: inline-block;
                height: 25px;
                line-height: 25px;
                color: #888;
            }

            .collection {
                margin-left: 115px;
                margin-top: 20px;
                height: 152px;
                .pic_upload {
                    width: 150px;
                    height: 150px;
                    margin-right: 20px;
                    float: left;
                }
            }
        }
        .customEditorContainer {
            width: 1000px;
            display: inline-block;
            vertical-align: top;
            .buttons {
                box-sizing: border-box;
                width: 100%;
                border-left: 1px solid #ccc;
                height: 51px;

                .editorButton {
                    width: 33.333%;
                    background: #f3f3f3;
                    font-size: 20px;
                    text-align: center;
                    line-height: 50px;
                    height: 50px;
                    border: 1px solid #cccccc;
                    border-left: none;
                    border-top: none;
                    cursor: pointer;
                    float: left;
                }
            }
        }
        .cateChoose {
            height: 70px;
            padding: 10px 0;
            border: 1px solid #dbdbdb;
            background: #fbfbfb;
            width: 1000px;
            display: inline-block;
            vertical-align: top;
        }

        .saleProtection {
            display: inline-block;
            vertical-align: top;
            border: 1px solid #dbdbdb;
            background: #fbfbfb;
            padding: 10px 20px;
        }

        .radioTwo {
            margin: 10px 0;
            min-width: 960px;
        }

        .centerBlock {
            text-align: center;
            margin-bottom: 130px;
            width: 1130px;
        }

        .button_type_2,
        .button_type_1 {
            width: 260px;
            height: 50px;
            margin: 30px;
        }
    }
</style>
