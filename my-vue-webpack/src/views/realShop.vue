<template>
    <div class="realShop">
        <div class="mainContent">
            <h1 class="comm_title">店铺管理 >> 修改店铺信息</h1>
            <article class="comm_form">
                <section class="block">
                    <label>
                        <mark>*</mark>
                        店铺名称:</label>
                    <input type="text" class="comm_input" v-model="spaceName" placeholder="请填写店铺名" :disabled="!isEdit">
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        店铺简介:</label>
                    <textarea class="shopDesc" v-model="spaceInfo" :disabled="!isEdit" placeholder="请输入商品描述,不能多于200字"
                              maxlength="200"></textarea><span v-show="isEdit"
                                                               class="mark">{{spaceInfo.length}}/200</span>
                </section>
                <section class="block">
                    <label>店铺公告:</label>
                    <input type="text" class="comm_input" v-model="spaceNotice" :disabled="!isEdit">
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        店铺地址:</label>
                    <input type="text" class="comm_input" v-model="spaceAddress" :disabled="!isEdit">
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        联系电话:</label>
                    <input type="text" class="comm_input" v-model="spacePhone" placeholder="请输入再用手机号码"
                           :disabled="!isEdit">
                </section>
                <section class="block cf">
                    <label>
                        <mark>*</mark>
                        店铺分类:</label>
                    <my-radio :proColumnList="proColumnList" @setColumnId="setColumnId" class="chooseStyle"></my-radio>
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        店铺联系人:</label>
                    <input type="text" class="comm_input" v-model="spaceContact" placeholder="请填写真实姓名"
                           :disabled="!isEdit">
                </section>
                <section class="block">
                    <label>主营业务:</label>
                    <input type="text" class="comm_input small_input" maxlength="5" placeholder="最多5字"
                           :disabled="!isEdit" v-model="spaceMain[0]">
                    <input type="text" class="comm_input small_input" maxlength="5" placeholder="最多5字"
                           :disabled="!isEdit" v-model="spaceMain[1]">
                </section>
                <section class="block">
                    <label>
                        <mark>*</mark>
                        商品主图</label><span class="mark">商品主图必须上传一张,单张图片大小不能超过2M</span>
                    <div class="collection" v-show="isEdit">
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" @setImageSrc="setImageSrc" index="one"
                                    :initImage="getImageSrc(0)" isEdit="true"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" @setImageSrc="setImageSrc" index="two"
                                    :initImage="getImageSrc(1)" isEdit="true"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" @setImageSrc="setImageSrc" index="three"
                                    :initImage="getImageSrc(2)" isEdit="true"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" @setImageSrc="setImageSrc" index="four"
                                    :initImage="getImageSrc(3)" isEdit="true"></pic-upload>
                        <pic-upload class="pic_upload" @pushPicId="pushPicId" @setImageSrc="setImageSrc" index="five"
                                    :initImage="getImageSrc(4)" isEdit="true"></pic-upload>
                        <video-upload @setVideoUrl="setVideoUrl" class="no_margin" v-model="videoId"></video-upload>
                    </div>
                    <div class="collection" v-show="!isEdit">
                        <img v-for="item in pictures" :src="item.picUrl" class="picShow"
                             @click.stop="$store.commit('setPicContainer',item.picUrl)">
                        <video :src="videoUrl" controls class="picShow" preload="meta"></video>
                    </div>
                </section>
                <section class="centerBlock">
                    <button class="button_type_2" @click="isEdit = true" v-show="!isEdit">编辑</button>
                    <button class="button_type_2" @click="submitApply" v-show="isEdit">确定</button>
                </section>
            </article>
        </div>
    </div>
</template>
<script>
  import picUpload from '../components/comm/picUpload.vue';
  import videoUpload from '../components/comm/videoUpload.vue';
  import myRadio from '../components/shopManager/myRadio.vue';
  var editor = {};
  export default {
    data() {
      return {
        spaceName: "",
        spaceInfo: "",
        spaceNotice: "",
        spaceAddress: "",
        spaceContact: "",
        spacePhone: "",
        classifyId: "",
        videoId: "",
        isEdit: false,
        spaceMain: [],
        //用对象保存图片,最后再转成数组
        proPic: {},
        pictures: [],
        videoUrl: "",
        //分类
        proColumnList: []
      }
    },
    components: {
      picUpload,
      videoUpload,
      myRadio
    },
    methods: {
      pushPicId: function (id, index) {
        this.proPic[index] = id;
      },
      setImageSrc: function (src, index) {
        this.pictures[index] = {}
        this.pictures[index].picUrl = src;
      },
      getImageSrc: function (index) {
        if (this.pictures.length - 1 < index) {
          return "";
        } else {
          return this.pictures[index];
        }
      },
      setColumnId: function (id) {
        if (id) {
          this.classifyId = id;
        } else {
          this.classifyId = null;
        }
      },
      setVideoUrl: function (src) {
        this.videoUrl = src;
      },
      submitApply: function () {
        this.isEdit = false;
        let self = this;
        let pics = "";
        for (var i in this.proPic) {
          pics += this.proPic[i] + ",";
        }
        pics = pics.slice(0, -1);
        let para = {
          spaceName: this.spaceName,
          spaceInfo: this.spaceInfo,
          spaceNotice: this.spaceNotice,
          spaceAddress: this.spaceAddress,
          spacePhone: this.spacePhone,
          spaceContact: this.spaceContact,
          classifyId: this.classifyId,
          picIds: pics,
          videoId: this.videoId
        }
        if (this.spaceMain[0] && this.spaceMain[1]) {
          para.spaceMain = this.spaceMain[0] + "," + this.spaceMain[1]
        }
        if (this.spaceMain[0] && !this.spaceMain[1]) {
          para.spaceMain = this.spaceMain[0]
        }
        if (!this.spaceMain[0] && this.spaceMain[1]) {
          para.spaceMain = this.spaceMain[1]
        }
        axios({
          method: "post",
          url: "/tvshop/shop/updateShopInfo",
          data: qs.stringify(para)
        }).then(function (res) {
          self.$store.commit("setToast", res.data.msg);
        })
      }
    },
    beforeRouteEnter: function (from, to, next) {
      next(vm => {
        axios.all([axios.get('/tvshop/shop/classIfList'), axios.get('/tvshop/shop/shopInfo')]).then(axios.spread(function (classIfList, shopInfo) {
          let data = classIfList.data;
          if (data.code === 20000) {
            let resp = data.resp.classIfList;
            for (var i = 0; i < resp.length; i++) {
              resp[i].columnName = resp[i].classifyName;
              resp[i].columnId = resp[i].classifyId;
              if (resp[i].columnId == shopInfo.data.resp.shopInfo.spaceInfoDomain.classifyId) {
                resp[i].isChoosed = true;
              }
            }
            vm.proColumnList = resp;
          } else {
            vm.$dealRes(data.code, data.msg);
          }
          // console.log(shopInfo);
          let data2 = shopInfo.data;
          if (data2.code === 20000) {
            let resp = data2.resp.shopInfo;
            vm.spaceName = resp.spaceInfoDomain.spaceName;
            vm.spaceInfo = resp.spaceInfoDomain.spaceInfo ? resp.spaceInfoDomain.spaceInfo : "";
            vm.spaceNotice = resp.spaceInfoDomain.spaceNotice;
            vm.spaceAddress = resp.spaceInfoDomain.spaceAddress;
            vm.spaceContact = resp.spaceInfoDomain.spaceContact;
            vm.spacePhone = resp.spaceInfoDomain.spacePhone;
            vm.classifyId = resp.spaceInfoDomain.classifyId;
            vm.pictures = resp.spaceBannerdomainExs;
            vm.spaceMain.push(resp.spaceInfoDomain.spaceMain && resp.spaceInfoDomain.spaceMain.split(",")[0]);
            vm.spaceMain.push(resp.spaceInfoDomain.spaceMain && resp.spaceInfoDomain.spaceMain.split(",")[1]);
            vm.videoUrl = resp.spSpaceVideodomain ? resp.spSpaceVideodomain.videoUrl : "未上传";
          } else {
            vm.$dealRes(data.code, data.msg);
          }
        }));
      });
    }
  }
</script>
<style lang="scss">
    .realShop {
        .block {
            margin-bottom: 30px;
            label {
                display: inline-block;
                width: 105px;
                height: 25px;
                line-height: 25px;
                text-align: right;
                margin-right: 10px;
                vertical-align: middle;
                mark {
                    color: #a90e0e;
                    background: none;
                }
            }
            .comm_input {
                height: 23px;
                width: 530px;
                border: 1px solid #dbdbdb;
                vertical-align: middle;
                padding: 0 20px;
            }
            .small_input {
                width: 200px;
                margin-right: 20px;
            }
            input:disabled,
            textarea:disabled {
                padding: 0;
            }
            .shopDesc {
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
                display: inline-block;
                vertical-align: middle;
                height: 25px;
                line-height: 25px;
                color: #888;
            }
            .collection {
                margin-left: 115px;
                margin-top: 20px;
                height: 152px;
                .picShow {
                    width: 150px;
                    height: 150px;
                    background: #f3f3f3;
                    cursor: pointer;
                    float: left;
                    margin-right: 20px;
                    s {
                        display: block;
                        width: 36px;
                        height: 36px;
                        margin-top: 64px;
                        margin-left: 65px;
                        background: url(../images/icon_list.png) no-repeat center center;
                        background-position: -67px -201px;
                    }
                }
                .pic_upload {
                    width: 150px;
                    height: 150px;
                    margin-right: 20px;
                    float: left;
                }
            }
            .chooseStyle {
                padding: 10px 0;
                border: 1px solid #dbdbdb;
                background: #fbfbfb;
                width: 912px;
                display: inline-block;
                vertical-align: top;
            }
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
