<template>
    <div class="comm_dialog shopEditDialog">
        <div class="edit_content">
            <h1 class="edit_title">
                <img class="fr" src="../../images/cha.png" @click="resultEvent(false)" height="16" width="16">
            </h1>
            <div>
                <label class="inputHeader">栏目名:</label>
                <input class="edit_item" placeholder="请输入栏目名" v-model.trim="columnName" maxlength="5">
            </div>
            <div>
                <label class="inputHeader">用户是否可见:</label>
                <myselect class="chooseItem" v-model="status" :items="items"></myselect>
            </div>
            <div class="centerblock">
                <button class="button_type_1" @click="resultEvent(false)">取消</button>
                <button class="button_type_2" @click="resultEvent(true)">确定</button>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import myselect from "./mySelect.vue";
    export default {
        props: ["para"],
        data() {
            return {
                columnName: "",
                status: "",
                items: [{
                    value: 0,
                    text: "用户不可见"
                }, {
                    value: 1,
                    text: "用户可见"
                }]
            }
        },
        watch: {
            //编辑产品时赋初值
            para: function () {
                this.columnName = this.para.columnName;
                this.status = this.para.columnStatus;
            }
        },
        methods: {
            resultEvent: function (bool) {
                if (!bool) {
                    this.$emit("editEvent");
                    return;
                }
                if (!this.columnName) {
                    this.$store.commit("setToast", "栏目名不能为空");
                    return;
                }
                if (!this.status && this.status !== 0) {
                    this.$store.commit("setToast", "请选择状态");
                    return;
                }
                let self = this;
                if (this.para.columnId) {
                    axios({
                        method: "post",
                        url: "/tvshop/shop/updateColumn",
                        data: qs.stringify({
                            colId: this.para.columnId,
                            colName: this.columnName,
                            status: this.status
                        })
                    }).then(function (res) {
                        if (res.data.code === 20000) {
                            self.$store.commit("setToast", "操作成功");
                            let newObj = {
                                columnName: self.columnName,
                                columnId: self.para.columnId,
                                columnStatus: self.status
                            };
                            self.$emit("editEvent", newObj);
                        } else {
                            self.$dealRes(res.data.code, res.data.msg);
                        }
                    })
                } else {
                    axios({
                        method: "post",
                        url: "/tvshop/shop/addProColumn",
                        data: qs.stringify({
                            colName: this.columnName,
                            colStatus: this.status
                        })
                    }).then(function (res) {
                        if (res.data.code === 20000) {
                            console.log(res.data.resp.column);
                            self.$emit("editEvent", res.data.resp.column)
                        } else {
                            self.$dealRes(res.data.code, res.data.msg);
                        }
                    })
                }
            }
        },
        components: {
            myselect
        }
    }
</script>
<style type="text/css" lang="scss">
    .shopEditDialog {
        .inputHeader {
            display: inline-block;
            width: 110px;
            vertical-align: middle;
            height: 30px;
            line-height: 30px;
            margin-top: 20px;
            margin-left: 20px;
            text-align: right;
        }
        .edit_item {
            height: 30px;
            vertical-align: middle;
            width: 160px;
            border: 1px solid #eaeaea;
            margin-top: 15px;
            padding-left: 10px;
        }
        .chooseItem {
            vertical-align: middle;
            width: 170px;
            margin-top: 15px;
        }
        .centerblock {
            padding-top: 15px;
            padding-bottom: 10px;
            button {
                margin: 0 10px;
            }
        }
    }
</style>
