<template>
    <div>
        <slot name="title"></slot>
        <div class="btnStyle">
            <!-- 进度条 -->
            <span :style="{width:spanWidth+'px'}" v-show="isShow"></span>
            <input type="file" name="pic1" @change="uploadPic($event)" v-if="updateInput">
            <s></s>
            <img :src="getPic()" v-if="getPic()">
        </div>
    </div>
</template>
<script>
  export default {
    props: ["index", "initImage", "isEdit", "clearImage"],
    data: function () {
      return {
        spanWidth: 0,
        imageSrc: "",
        isShow: true,
        updateInput: true
      }
    },
    watch: {
      initImage: function () {
        if (!this.initImage || this.initImage.picturePath == "") {
          return;
        }
        this.imageSrc = this.initImage.picturePath;
        this.$emit("pushPicId", this.initImage.picId, this.index);
      },
      clearImage: function () {
        if (this.clearImage) {
          this.imageSrc = "";
        }
      }
    },
    methods: {
      getPic: function () {
        if (this.isEdit) {
          return this.imageSrc || (this.initImage && (this.initImage.picturePath || this.initImage.picUrl));
        } else {
          return this.imageSrc;
        }
      },
      uploadPic: function (e) {
        this.isShow = true;
        if (window.FormData) {
          let formData = new FormData();
          let picObj = e.target.files[0];
          if (!picObj) {
            return
          }
          formData.append("file", picObj);
          formData.append("type", 2);
          let self = this;
          if (/^image\/(png|gif|jpg|jpeg)$/.test(picObj.type) && picObj.size < 2097152) {
            axios({
              method: 'post',
              url: '/tvshop/app/upload',
              data: formData,
              onUploadProgress: function (progressEvent) {
                let containerEl = document.querySelector(".btnStyle");
                self.spanWidth = (containerEl.offsetWidth - 2) * progressEvent.total / progressEvent.loaded;
              }
            }).then(function (res) {
              self.isShow = false;
              self.spanWidth = 0;
              if (!isNaN(res.data)) {
                self.$emit("pushPicId", res.data, self.index);
              }
              if (typeof FileReader != 'undefined') {
                var acceptedTypes = {
                  'image/png': true,
                  'image/jpeg': true,
                  'image/gif': true
                };
                if (acceptedTypes[e.target.files[0].type] === true) {
                  var reader = new FileReader();
                  reader.onload = function (event) {
                    var image = new Image();
                    image.src = event.target.result;
                    self.imageSrc = event.target.result;
                    let index = "";
                    switch (self.index) {
                      case "one":
                        index = 0;
                        break;
                      case "two":
                        index = 1;
                        break;
                      case "three":
                        index = 2;
                        break;
                      case "four":
                        index = 3;
                        break;
                      case "five":
                        index = 4;
                        break;
                    }
                    self.$emit("setImageSrc", event.target.result, index);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }
            }).catch(function (msg) {
              console.log(msg);
            })
          } else {
            this.$store.commit("setToast", "不允许的类型,或者超出大小限制");
          }
        }
        this.updateInput = false
        this.$nextTick(function () {
          this.updateInput = true
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    .btnStyle {
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        cursor: pointer;
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
            z-index: 100;
        }
        s {
            display: block;
            width: 36px;
            height: 36px;
            margin-top: 57px;
            margin-left: 57px;
            background: url(../../images/icon_list.png) no-repeat center center;
            background-position: -66px -134px;
        }
        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        span {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 4px;
            background: #a90e0e;
            -webkit-transition: all 0.5s;
            transition: all 0.5s;
            z-index: 2;
        }
    }
</style>
