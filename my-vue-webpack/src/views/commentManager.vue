<template>
    <div class="order_manager">
        <div class="mainContent">
            <h1 class="comm_title">订单管理 >> 评价管理</h1>
            <div class="comm_search_box">
                <div class="comm_search_item">
                    <label>商品名称</label>
                    <input type="text" v-model="productName" class="input_width_1" autocomplete>
                </div>
                <div class="comm_search_item verify_state">
                    <label>用户名</label>
                    <input type="text" v-model="username" class="input_width_1" autocomplete>
                </div>
                <div class="comm_search_item verify_state">
                    <label>订单编号</label>
                    <input type="text" v-model="orderNumber" class="input_width_1" autocomplete>
                </div>
                <br style="clear:left">
                <div class="comm_search_item">
                    <label>评论时间</label>
                    <datepicker class="dateChoose" v-model="beginTime" language="zh" :format="'yyyy-MM-dd'"
                                :clear-button="true" @cleared="beginTime=''"></datepicker>
                    <label>至</label>
                    <datepicker class="dateChoose" v-model="endTime" language="zh" :format="'yyyy-MM-dd'"
                                :clear-button="true" @cleared="endTime=''"></datepicker>
                </div>
                <button class="table_button" @click="jumpPage(1)">搜索</button>
            </div>
            <div class="comm_table_content">
                <ul class="comm_table_title">
                    <li class="col_type_5"><span>商品名称</span></li>
                    <li class="col_type_3"><span>评论人</span></li>
                    <li class="col_type_5"><span>下单时间</span></li>
                    <li class="col_type_5"><span>评论内容</span></li>
                    <li class="col_type_5"><span>评论等级</span></li>
                    <!-- <li class="col_type_4"><span>操作</span></li> -->
                </ul>
                <ul class="comm_table_raw" v-for="(item,$index) in initObj" @click="showDetail(item)">
                    <li class="col_type_5"><span>{{item.productName}}</span></li>
                    <li class="col_type_3"><span>{{item.userName}}</span></li>
                    <li class="col_type_5"><span>{{item.commendTime | transDate}}</span></li>
                    <li class="col_type_5"><span class="ellipsis">{{item.commentDesc}}</span></li>
                    <li class="col_type_5"><span>{{item.commentScore}}</span></li>
                    <!-- <li class="col_type_4 operate">
                            <button class="table_button" @click.stop="">回复</button>
                    </li> -->
                </ul>
            </div>
            <pagination :countNum="countNum" pageSize="6" @jumpPage="jumpPage"></pagination>
        </div>
        <div class="detail_container comm_dialog" v-show="isShowDetail">
            <div class="detail_content">
                <h1 class="detail_title">
                    <span class="fl">商品详情</span>
                    <img class="fr" src="../images/cha.png" @click="closeDialog" height="16" width="17">
                </h1>
                <div class="scroll_me" data-scroll="contentScroll">
                    <div class="relative">
                        <div class="scroll_list_wrap" id="scroll_wrap">
                            <article class="scroll_list" id="scroll_list">
                                <section class="content_item">
                                    <span class="fl">商品名称</span>
                                    <span class="fr">{{detailContent.productName}}</span>
                                </section>
                                <section class="content_item">
                                    <span class="fl">评论人</span>
                                    <span class="fr">{{detailContent.userName}}</span>
                                </section>
                                <section class="content_item bigSection">
                                    <span class="fl">评论内容</span>
                                    <span class="fr">{{detailContent.commentDesc}}</span>
                                </section>
                            </article>
                        </div>
                        <div class="scroll-bg" id="scroll_bg">
                            <div class="scroll-block" id="scroll_block"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Scroll from "../js/scroll.js";
    export default {
        data() {
            return {
                currentPage: "1",
                initObj: [],
                countNum: 0,
                //搜索start
                productName: "",
                beginTime: "",
                endTime: "",
                orderNumber: "",
                username: "",
                isShowDetail: false,
                detailContent: {
                    orderInfodomain: {}
                }
            }
        },
        methods: {
            showDetail: function (item) {
                this.detailContent = item;
                this.isShowDetail = true;
            },
            closeDialog: function () {
                this.isShowEdit = false;
                this.isShowEditMark = false;
                this.isShowDeliver = false;
                this.isShowDetail = false;
            },
            jumpPage: function (count) {
                this.$store.commit("setIsLoading", false);
                this.currentPage = count;
                let self = this;
                let para = {
                    pageSize: 6,
                    pageIndex: count,
                    status: this.status
                };
                if (this.productName) {
                    para.productName = this.productName;
                }
                if (this.orderNumber) {
                    para.orderNumber = this.orderNumber;
                }
                if (this.beginTime) {
                    //注意,此处是startTime
                    para.startTime = this.beginTime.getTime();
                }
                if (this.endTime) {
                    para.endTime = this.endTime.getTime();
                }
                if (this.username) {
                    para.userName = this.username;
                }
                axios({
                    method: "get",
                    url: '/tvshop/product/commendList',
                    params: para
                }).then(function (res) {
                    if (res.data.code === 20000) {
                        self.initObj = res.data.resp.productCommend.list;
                        self.countNum = res.data.resp.productCommend.totalRows;
                        self.$store.commit("setIsLoading", true);
                    } else {
                        self.$dealRes(res.data.code, res.data.msg);
                    }
                }).catch(function (error) {
                    self.$store.commit("setToast", "连接服务器失败,请稍后重试");
                })
            }
        },
        components: {
            Scroll
        },
        beforeRouteEnter: function (to, from, next) {
            let para = {
                pageSize: 6,
                pageIndex: 1
            };
            next(vm => {
                vm.$store.commit("setIsLoading", false);
                axios({
                    method: "get",
                    url: '/tvshop/product/commendList',
                    params: para
                }).then(function (res) {
                    if (res.data.code == 20000) {
                        vm.initObj = res.data.resp.productCommend.list;
                        vm.countNum = res.data.resp.productCommend.totalRows;
                        vm.$store.commit("setIsLoading", true);
                    } else {
                        vm.$dealRes(res.data.code, res.data.msg);
                    }
                }).catch(function (error) {
                    vm.$store.commit("setToast", "连接服务器失败,请稍后重试");
                })
            })

        }
    }
</script>
<style lang="scss">
    .order_manager {
        .small_b {
            background: none;
            cursor: pointer;
            width: 45px;
            height: 30px;
            margin-top: 5px;
        }
        .comm_search_box .table_button {
            margin-top: 20px;
            height: 26px;
            margin-left: 20px;
        }
        .bigSection {
            height: 300px;
        }
    }
</style>
