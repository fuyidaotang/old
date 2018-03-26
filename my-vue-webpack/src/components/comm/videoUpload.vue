<template>
    <div class="btnStyle">
        <input type="file" name="pic1" @change="uploadVideo($event)"><s v-show="!isShow"></s>
        <img src="../../images/black.png" v-if="isShow">
        <h2>{{progress}}</h2>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        data: function () {
            return {
                progress: '上传视频',
                isShow: false
            }
        },
        methods: {
            uploadVideo: function (e) {
                if (window.FormData) {
                    let formData = new FormData();
                    let videoObj = e.target.files[0];
                    formData.append("file", videoObj);
                    formData.append("type", 1);
                    let self = this;
                    if (/^video\/(mp4|webm|ogg)$/.test(videoObj.type) && videoObj.size < 20971520000) {
                        axios({
                            method: 'post',
                            url: '/tvshop/app/uploadvideo',
                            data: formData,
                            onUploadProgress: function (progressEvent) {
                                self.progress = progressEvent.total / progressEvent.loaded.toFixed(2) / 100 + "%";
                                if (progressEvent.total == progressEvent.loaded) {
                                    self.progress = "上传成功!";
                                    self.isShow = true;
                                }
                            }
                        }).then(function (res) {
                            if (res.data.code == 20000) {
                                self.$emit("input", res.data.resp.video.videoId);
                                self.$emit("setVideoUrl", res.data.resp.video.videoUrl);
                            } else {
                                self.$dealRes(res.data.code, res.code.msg);
                            }
                        }).catch(function (msg) {
                            console.log(msg);
                        })
                    } else {
                        // alert("不支持的视频格式或视频大小超过200M");
                      self.$store.commit("setToast", "不支持的视频格式或视频大小超过200M");
                    }
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
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
            margin-top: 49px;
            margin-left: 65px;
            background: url(../../images/icon_list.png) no-repeat center center;
            background-position: -67px -201px;
        }
        img {
            display: block;
            width: 36px;
            height: 36px;
            margin-top: 45px;
            margin-left: 57px;
        }
        h2 {
            font-size: 14px;
            color: #cbcbcb;
            text-align: center;
            margin-top: 6px;
        }
    }
</style>