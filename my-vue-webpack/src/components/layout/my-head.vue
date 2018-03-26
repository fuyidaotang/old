<template>
    <header>
        <figure class="logo">
            <img src="../../images/logo.png" height="22" width="136">
            <h4>360° 全景直播电商系统</h4>
        </figure>
        <div class="user_area">
            <a href="http://upload.hongdoujiao.com/download/help.zip" class="fl">帮助手册</a>
            <figure>
                <img :src="headPic" height="22" width="136">
                <span>{{username}},你好!</span>
            </figure>
            <figure>
                <img src="../../images/icon_close.png" height="22" width="18">
                <span @click="signOut">安全退出</span>
            </figure>
        </div>
    </header>
</template>
<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                headPic: "",
                username: ""
            }
        },
        methods: {
            signOut: function () {
                let self = this;
                axios({
                    method: "get",
                    url: "/tvshop/login/logOut"
                }).then(function (res) {
                    if (res.data.code == 20000) {
                        self.$store.commit("setToast", "注销成功");
                        sessionStorage.removeItem("isLogin");
                        setTimeout(function () {
                            location.href = "/hdjmanager/login.html?clear=1";
                        }, 1000)
                    }
                })
            }
        },
        beforeCreate: function () {
            let self = this;
            axios({
                method: "get",
                url: "/tvshop/user/userInfo",
            }).then(function (res) {
                if (res.data.code === 20000) {
                    self.headPic = res.data.resp.userinfo.headPic;
                    self.username = res.data.resp.userinfo.username;
                    sessionStorage.setItem('userInfo', JSON.stringify(res.data.resp.userinfo))
                } else {
                    self.$dealRes(res.data.code, res.data.msg);
                }
            })
        }
    }
</script>
<style lang="scss">
    header {
        height: 89px;
        border-bottom: 1px solid #dbdbdb;
        .logo {
            float: left;
            margin-left: 30px;
            margin-top: 25px;
            img {
                width: 136px;
                height: 22px;
            }
            h4 {
                color: #aaa;
                margin-top: 10px;
            }
        }
        .user_area {
            float: right;
            margin-right: 30px;
            margin-top: 25px;
            height: 40px;
            >a{
                margin-right:20px;
                line-height:48px;
                color:#323232;
            }
            >a:hover{
                text-decoration: underline;
            }
            figure {
                float: left;
                line-height: 40px;
                img {
                    display: inline-block;
                    vertical-align: middle;
                }
                span {
                    vertical-align: middle;
                    font-size: 20px;
                }
            }
            figure:nth-of-type(1) {
                margin-right: 76px;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 20px;
                }
            }
            figure:nth-of-type(2) {
                cursor: pointer;
                img {
                    width: 18px;
                    height: 22px;
                }
            }
        }
    }
</style>
