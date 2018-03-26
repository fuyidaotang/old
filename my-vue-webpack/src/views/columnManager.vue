<template>
    <div class="column_manager">
        <div class="mainContent">
            <h1 class="comm_title">店铺管理 >> 栏目管理</h1>
            <h2 class="title">栏目分类</h2>
            <button class="button_type_4" @click="showDialog">+添加栏目分类</button>
            <table>
                <tr>
                    <th class="childTitle">栏目名称</th>
                    <th class="contentLeft">上移</th>
                    <th>下移</th>
                    <th>编辑</th>
                    <th>删除</th>
                    <th class="contentRight">用户是否可见</th>
                </tr>
                <tr v-for="(item,$index) in initObj">
                    <td class="childTitle">{{item.columnName}}</td>
                    <td class="contentLeft"><span :class="[$index==0?'top':'up']"
                                                  @click="upColOrder($index,item.columnId)"></span></td>
                    <td><span :class="[$index==initObj.length-1?'bottom':'down']"
                              @click="downColOrder($index,item.columnId)"></span></td>
                    <td><span class="edit" @click="showDialog(item,$index)"></span></td>
                    <td><span class="remove" @click="delProColumn($index,item.columnId)"></span></td>
                    <td class="contentRight smallFont">{{item.columnStatus|transStatus}}</td>
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
                if (typeof index != "undefined") {
                    this.editContent = item;
                    this.editContent.index = index;
                } else {
                    this.editContent = {};
                    if (this.initObj.length >= 10) {
                        this.$store.commit("setToast", "最多只能添加10个栏目");
                        return;
                    }
                }
                this.isShowEdit = true;
            },
            editHandle: function (item) {
                this.isShowEdit = false;
                if (!item) {
                    return;
                }
                if (typeof this.editContent.index != "undefined") {
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
            next(vm => {
                axios({
                    method: "get",
                    url: "/tvshop/shop/proColumnList",
                }).then(function (res) {
                    let data = res.data;
                    if (data.code == 20000) {
                        vm.initObj = data.resp.proColumn;
                    } else {
                        vm.$dealRes(data.code, data.msg);
                    }
                })
            })
        }
    }
</script>
<style lang="scss">
    .column_manager {

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
        width: 900px;
        border-top: 1px solid #dbdbdb;
        border-left: 1px solid #dbdbdb;
        border-right: 1px solid #dbdbdb;

    td,
    th {
        text-align: center;
        border-bottom: 1px solid #dbdbdb;
        height: 34px;
        width: 180px;

    span {
        display: block;
        width: 14px;
        height: 14px;
        margin: 0 auto;
        margin-top: 9px;
        cursor: pointer;
    }

    span:hover {
        transition: all 0.2s;
        transform: scale(1.5, 1.5);
    }

    .top {
        margin-top: 13px;
        background: url(../images/table_icon.png) no-repeat 0 -3px;
        cursor: default;

    &
    :hover {
        transform: none;
    }

    }
    .up {
        margin-top: 13px;
        background: url(../images/table_icon.png) no-repeat 0 -20px;
    }

    .down {
        margin-top: 13px;
        background: url(../images/table_icon.png) no-repeat 0 -38px;
    }

    .bottom {
        margin-top: 13px;
        background: url(../images/table_icon.png) no-repeat 0 -73px;
        cursor: default;

    &
    :hover {
        transform: none;
    }

    }
    .edit {
        background: url(../images/table_icon.png) no-repeat 0 -87px;
    }

    .remove {
        background: url(../images/table_icon.png) no-repeat 0 -53px;
    }

    }
    .smallFont {
        font-size: 14px;
        color: #888;
    }

    th {
        font-weight: normal;
        background: #f3f3f3;
    }

    .childTitle {
        border-right: 1px solid #dbdbdb;
        width: 300px;
    }

    .contentLeft {
        padding-left: 60px;
    }

    .contentRight {
        padding-right: 60px;
    }

    }
    }
</style>
