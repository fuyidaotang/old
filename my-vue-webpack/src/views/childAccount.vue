<template>
    <div class="child_account">
        <div class="mainContent">
            <h1 class="comm_title">店铺管理 >> 子账号管理</h1>
            <h2 class="title">栏目分类</h2>
            <button class="button_type_4" @click="showDialog">+添加子账号</button>
            <table>
                <tr>
                    <th class="childTitle">账号名</th>
                    <th>备注</th>
                    <th>操作</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>
                        <span>重置密码</span>
                        <span>编辑</span>
                        <span>删除</span>
                    </td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>
                        <span>重置密码</span>
                        <span>编辑</span>
                        <span>删除</span>
                    </td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>
                        <span>重置密码</span>
                        <span>编辑</span>
                        <span>删除</span>
                    </td>
                </tr>
            </table>
        </div>
        <edit-dialog v-show="isShowEdit" @editEvent="editHandle" :para="editContent"></edit-dialog>
    </div>
</template>
<script type="text/javascript">
    import editDialog from "../components/shopManager/editColumn.vue";
    export default {
        data() {
            return {
                initObj: {},
                //弹出框参数
                editContent: {},
                //是否显示编辑框
                isShowEdit: false
            }
        },
        methods: {
            showDialog: function (item, index) {
                if (item) {
                    this.editContent = item;
                    this.editContent.index = index;
                } else {
                    this.editContent = {};
                }
                this.isShowEdit = true;
            },
            editHandle: function (item) {
                this.isShowEdit = false;
                if (!item) {
                    return;
                }
                if (this.editContent.index) {
                    this.initObj[this.editContent.index] = item
                } else {
                    this.initObj.push(item);
                }
            },
            upColOrder: function (index, id) {
                let self = this;
                if (index != 0) {
                    axios({
                        method: "post",
                        url: "/tvshop/shop/upColOrder",
                        data: qs.stringify({
                            colId: id
                        })
                    }).then(function (res) {
                        let data = res.data;
                        if (data.code === 20000) {
                            let operateItem = self.initObj.splice(index, 1);
                            self.initObj.splice(index - 1, 0, operateItem[0]);
                            self.$store.commit("setToast", "操作成功");
                        } else {
                            self.$dealRes(data.code, data.msg);
                        }
                    })
                } else {
                    this.$store.commit("setToast", "该栏目排序在顶端");
                }
            },
            downColOrder: function (index, id) {
                let self = this;
                if (index != this.initObj.length - 1) {
                    axios({
                        method: "post",
                        url: "/tvshop/shop/downColOrder",
                        data: qs.stringify({
                            colId: id
                        })
                    }).then(function (res) {
                        let data = res.data;
                        if (data.code === 20000) {
                            let operateItem = self.initObj.splice(index, 1);
                            self.initObj.splice(index + 1, 0, operateItem[0]);
                            self.$store.commit("setToast", "操作成功");
                        } else {
                            self.$dealRes(data.code, data.msg);
                        }
                    })
                } else {
                    this.$store.commit("setToast", "该栏目排序在底部");
                }
            },
            delProColumn: function (index, id) {
                let self = this;
                axios({
                    method: "post",
                    url: "/tvshop/shop/delProColumn",
                    data: qs.stringify({
                        colId: id
                    })
                }).then(function (res) {
                    let data = res.data;
                    if (data.code === 20000) {
                        self.initObj.splice(index, 1);
                        self.$store.commit("setToast", "操作成功");
                    } else {
                        self.$dealRes(data.code, data.msg);
                    }
                })
            }
        },
        components: {
            editDialog
        },
        beforeRouteEnter: function (from, to, next) {
            axios({
                method: "get",
                url: "/tvshop/shop/proColumnList",
            }).then(function (res) {
                let data = res.data;
                console.log(data);
                next(vm => {
                    if (data.code == 20000) {
                        vm.initObj = data.resp.proColumn;
                    } else {
                        vm.$dealRes(data.code, data.msg);
                    }
                });
            })
        }
    }
</script>
<style lang="scss">
    .child_account {

        .title {
            margin-top: 20px;
            margin-left: 20px;
        }

        .button_type_4 {
            margin-top: 20px;
            margin-left: 20px;
            padding: 4px 10px;
        }

        table {
            margin-top: 20px;
            margin-left: 20px;
            width: 932px;
            border-top: 1px solid #dbdbdb;
            border-left: 1px solid #dbdbdb;

            td,
            th {
                text-align: center;
                border-bottom: 1px solid #dbdbdb;
                border-right: 1px solid #dbdbdb;
                height: 34px;

                span {
                    margin: 0 15px;
                    color: #2713ee;
                    cursor: pointer;
                }

            }
            th {
                font-weight: normal;
                background: #f3f3f3;
            }

            td:nth-child(1),
            th:nth-child(1) {
                width: 200px;
            }

            td:nth-child(2),
            th:nth-child(2) {
                width: 420px;
            }

            td:nth-child(3),
            th:nth-child(3) {
                width: 310px;
            }

        }
    }
</style>
