<template>
    <div class="comm_dialog orderEditDialog">
        <div class="edit_content">
            <h1 class="edit_title">
                <img class="fr" src="../../images/cha.png" @click="resultEvent(false)" height="16" width="16">
            </h1>
            <h1 class="alertMsg" v-cloak>
                {{alertMsg}}
            </h1>
            <div v-show="type === 1">
                <label class="inputHeader">快递公司:</label>
                <my-select class="chooseCompany" :initOption="initCompanys" v-model="transportCompany"></my-select>
            </div>
            <div v-show="type === 1">
                <label class="inputHeader">快递单号:</label>
                <input class="edit_item" placeholder="请输入快递单号" v-model.trim="transportNumber">
            </div>
            <div v-show="type === 0">
                <label class="inputHeader">新价格:</label>
                <input class="edit_item" type="number" v-model="newVal" placeholder="请输入新价格">
            </div>
            <textarea v-show="type == 2" v-model="newVal" placeholder="请输入备注" class="markInput"></textarea>
            <textarea v-show="type == 3" v-model="newVal" placeholder="请输入拒绝理由" class="markInput"></textarea>
            <div class="centerblock">
                <button class="button_type_1" @click="resultEvent(false)">取消</button>
                <button class="button_type_2" @click="resultEvent(true)">确定</button>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import mySelect from "./mySelect.vue";
    export default {
        props: ["para"],
        data() {
            return {
                transportNumber: "",
                transportCompany: "",
                initCompanys: [],
                newVal: "",
                alertMsg: "",
                type: -1
            }
        },
        watch: {
            para: function (val) {
                if (val.oldVal) {
                    this.newVal = val.oldVal
                }
                this.type = val.type;
            }
        },
        methods: {
            resultEvent: function (bool) {
                let self = this;
                if (!bool) {
                    this.$emit("editEvent", false);
                    this.transportNumber = "";
                    this.transportCompany = "";
                    this.newVal = "";
                    this.type = "";
                    this.alertMsg = "";
                    return;
                }
                let obj = {};
                if (this.type == 1) {
                    if (self.transportNumber === "" || self.transportCompany === "") {
                        self.alertMsg = "请填写完整物流信息";
                        return;
                    }
                    obj.url = "/tvshop/order/deliverGoods";
                    obj.para = qs.stringify({
                        orderNumber: self.para.orderNumber,
                        transportNumber: self.transportNumber,
                        transportCompany: parseInt(self.transportCompany)
                    });
                } else if (this.type == 0) {
                    obj.url = "/tvshop/order/modifyOrderPrice";
                    obj.para = qs.stringify({
                        orderNumber: self.para.orderNumber,
                        newPrice: self.newVal
                    });
                } else if (this.type == 2) {
                    obj.url = "/tvshop/order/addOrderRemarks";
                    obj.para = qs.stringify({
                        orderNumber: self.para.orderNumber,
                        remarks: self.newVal
                    });
                } else if (this.type == 3) {
                    obj.url = "/tvshop/order/refusedRefund";
                    obj.para = qs.stringify({
                        orderNumber: self.para.orderNumber,
                        remarks: self.newVal
                    });
                }
                this.transportNumber = "";
                this.transportCompany = "";
                this.newVal = "";
                this.type = -1;
                this.alertMsg = "";
                self.$emit("editEvent", false);
                axios({
                    method: "post",
                    url: obj.url,
                    data: obj.para
                }).then(function (res) {
                    if (res.data.code == "20000") {
                        self.$emit("editEvent", true);
                    } else {
                        self.$dealRes(res.data.code, res.data.msg);
                    }
                    self.newVal = "";
                }).catch(function (msg) {
                    self.$store.commit("setToast", "连接服务器失败,请稍后重试");
                });
            }
        },
        components: {
            mySelect
        },
        beforeCreate: function () {
            let self = this;
            //发货时才获取快递公司列表
            axios({
                method: "get",
                url: "/tvshop/order/searchExpress",
            }).then(function (res) {
                if (res.data.code == "20000") {
                    self.initCompanys = res.data.resp.express;
                } else {
                    console.log("快递公司获取失败" + res.data.code);
                }
            }).catch(function (msg) {
                console.log(msg);
            });
        }
    }
</script>
<style type="text/css" lang="scss">
    .orderEditDialog {
        .inputHeader {
            display: inline-block;
            width: 80px;
            vertical-align: middle;
            height: 30px;
            line-height: 30px;
            margin-top: 20px;
            margin-left: 20px;
        }
        .edit_item {
            height: 30px;
            vertical-align: middle;
            width: 190px;
            border: 1px solid #eaeaea;
            margin-top: 15px;
            padding-left: 10px;
        }
        .chooseCompany {
            width: 200px;
            margin-top: 20px;
            vertical-align: middle;
        }
        .markInput {
            width: 280px;
            height: 50px;
            border: none;
            outline: none;
            resize: none;
            display: block;
            margin: 0 auto;
            margin-top: 20px;
        }
        .centerblock {
            padding-top: 15px;
            padding-bottom: 10px;
            button {
                margin: 0 10px;
            }
        }
        .alertMsg {
            text-align: center;
            color: #a90e0e;
            font-size: 18px;
            height: 18px;
            margin-top: 10px;
        }
    }
</style>