<template>
    <div class="inputContainer">
        <input type="hidden" v-model="id">
        <input type="text" @input="getCompanys" @click="isShow = !isShow" v-model="ecName" placeholder="请选择">
        <s @click="isShow = !isShow"></s>
        <ul v-if="isShow">
            <li v-for="item in items" @click="choose(item)">{{item.ecName}}({{item.ecCode}})</li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
    var timer;
    export default {
        props: ["initOption", "value"],
        data() {
            return {
                isShow: false,
                ecName: this.value,
                id: "",
                items: []
            }
        },
        watch: {
            initOption: function () {
                this.items = this.initOption;
            },
            value: function () {
                if (this.value == "") {
                    this.ecName = "";
                    this.id = "";
                }
            }
        },
        methods: {
            choose: function (item) {
                this.isShow = false;
                this.ecName = item.ecName;
                this.id = item.ecId;
                this.$emit("input", this.id);
            },
            getCompanys: function () {
                let self = this;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    self.isShow = true;
                    let para = {
                        where: self.ecName
                    }
                    axios({
                        method: "get",
                        url: "/tvshop/order/searchExpress",
                        params: para
                    }).then(function (res) {
                        if (res.data.resp.express.length === 0) {
                            self.items = self.initOption;
                        } else {
                            self.items = res.data.resp.express;
                        }

                    });
                }, 300);
            }

        }
    }
</script>
<style type="text/css" scoped>
    .inputContainer {
        position: relative;
        display: inline-block;
    }
    s {
        position: absolute;
        display: block;
        border: 6px solid transparent;
        border-top: 8px solid #888888;
        top: 8px;
        right: 10px;
        cursor: pointer;
    }
    ul {
        position: absolute;
        border: 1px solid #dbdbdb;
        border-top: none;
        border-bottom: none;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
    }
    li {
        border-bottom: 1px solid #dbdbdb;
        line-height: 30px;
        font-size: 18px;
        text-align: center;
        background: #fff;
        cursor: pointer;
    }
    li:hover {
        background: #fbfbfb;
    }
    input {
        display: inline-block;
        height: 24px;
        line-height: 24px;
        border: 1px solid #dbdbdb;
        font-size: 18px;
        text-align: center;
        cursor: pointer;
        width: 180px;
        padding-right: 20px;
    }
</style>