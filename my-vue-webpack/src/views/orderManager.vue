<template>
    <div class="order_manager">
        <div class="mainContent">
            <h1 class="comm_title">订单管理 >> {{status | getOrderTitle}}</h1>
            <div class="comm_search_box">
                <div class="comm_search_item">
                    <label>商品名称</label>
                    <input type="text" v-model="productName" class="input_width_1" autocomplete>
                </div>
                <div class="comm_search_item">
                    <label>用户名</label>
                    <input type="text" v-model="username" class="input_width_1" autocomplete>
                </div>
                <div class="comm_search_item">
                    <label>订单编号</label>
                    <input type="text" v-model="orderNumber" class="input_width_1" autocomplete>
                </div>
                <br style="clear:left">
                <div class="comm_search_item">
                    <label>上架时间</label>
                    <datepicker class="dateChoose" v-model="beginTime" language="zh" :format="'yyyy-MM-dd'"
                                :clear-button="true" @cleared="beginTime=''"></datepicker>
                    <label>至</label>
                    <datepicker class="dateChoose" v-model="endTime" language="zh" :format="'yyyy-MM-dd'"
                                :clear-button="true" @cleared="endTime=''"></datepicker>
                </div>
                <button class="table_button" @click="jumpPage(1)">搜索</button>
                <!--<button class="table_button" v-if="status=='30'||status=='20'" @click="printPage()">打印订单</button>-->
            </div>
            <div class="comm_table_content">
                <!--<button v-if="status=='20'">当前订单导出Excel</button>-->
                <button @click="printExpress" v-if="status=='20'||status=='30'">快递单批量打印</button>
                <button v-if="status=='30'||status=='20'"  @click="printPage()">发货单批量打印</button>
                <ul class="comm_table_title">
                    <li class="col_type_5"><input type="checkbox" v-model="checkAllValue" @click="checkAll($event)" class="all_check"></li>
                    <li class="col_type_5"><span>订单编号</span></li>
                    <li class="col_type_4"><span>下单用户</span></li>
                    <li class="col_type_3"><span>收件人</span></li>
                    <li class="col_type_5"><span>下单时间</span></li>
                    <li class="col_type_3"><span>订单总价</span></li>
                    <li class="col_type_5"><span>地址</span></li>
                    <li class="col_type_3"><span>联系电话</span></li>
                    <li class="col_type_4"><span>操作</span></li>
                </ul>
                <ul class="comm_table_raw" v-for="(item,$index) in initObj" @click="showDetail(item)">
                    <li class="col_type_5"><input @click.stop="checkThis" type="checkbox" class="check_this" :value="item.orderInfodomain.orderId" v-model="checkIds" ></li>
                    <li class="col_type_5"><span>{{item.orderInfodomain.orderNumber}}</span></li>
                    <li class="col_type_4"><span>{{item.usersdomain.userName}}</span></li>
                    <li class="col_type_3"><span>{{item.orderInfodomain.receiveName}}</span></li>
                    <li class="col_type_5"><span>{{item.orderInfodomain.orderTime | transDate}}</span></li>
                    <li class="col_type_3"><span>{{item.orderInfodomain.orderAmount}}</span></li>
                    <li class="col_type_5"><span>{{item.orderInfodomain.receiveAddress}}</span></li>
                    <li class="col_type_3"><span>{{item.orderInfodomain.receivePhone}}</span></li>
                    <li class="col_type_4 operate">
                        <div v-show="!item.orderInfodomain.parentId">
                            <button class="table_button" v-show="status == 10"
                                    @click.stop="showEditDialog(0,item.orderInfodomain.orderNumber,item.orderInfodomain.orderAmount)">
                                修改价格
                            </button>
                            <button class="table_button" v-show="status == 20"
                                    @click.stop="showEditDialog(1,item.orderInfodomain.orderNumber)">发货
                            </button>
                            <button class="table_button" v-show="status == 30 || status == 40"
                                    @click.stop="showLogisticsDetail(item.orderInfodomain.transportNumber,item.expressId)">
                                查看物流
                            </button>
                            <button class="table_button" v-show="status == 50"
                                    @click.stop="showAlert('确定要删除订单吗?',3,item.orderInfodomain.orderNumber)">删除订单
                            </button>
                            <br>
                            <div>
                                <button class="small_b" v-show="status == 10"
                                        @click.stop="showAlert('确定要关闭订单吗?',1,item.orderInfodomain.orderNumber)">关闭
                                </button>
                                <button class="small_b"
                                        @click.stop="showEditDialog(2,item.orderInfodomain.orderNumber,item.orderInfodomain.orderNote)"
                                        :class="{fred:item.orderInfodomain.orderNote}">备注
                                </button>
                                <button class="small_b" v-show="status == 100"
                                        @click.stop="showAlert('确定同意退款吗?',2,item.orderInfodomain.orderNumber)">同意
                                </button>
                                <button class="small_b" v-show="status == 100"
                                        @click.stop="showEditDialog(3,item.orderInfodomain.orderNumber)">拒绝
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <pagination :countNum="countNum" pageSize="6" @jumpPage="jumpPage"></pagination>
        </div>
        <edit-dialog v-show="isShowEdit" :para="editContent" @editEvent="editHandle"></edit-dialog>
        <detail-dialog v-show="isShowDetail" :para="detailContent" :transContent="transContent" :isDetail="isDetail"
                       @detailEvent="detailHandle"></detail-dialog>
        <my-alert :para="alertContent" @alertEvent="alertHandle"></my-alert>
    </div>
</template>
<script>
    import editDialog from "../components/orderManager/editDialog.vue";
    import detailDialog from "../components/orderManager/detailDialog.vue";
    import rxUtils from '../js/rxUtils'
    export default {
        data() {
            return {
                /*选中的ID*/
                checkAllValue:false,
                checkIds:[],
                //******内容**********
                initObj: [],
                currentPage: "1",
                countNum: 0,
                status: "",
                //******内容**********
                //********搜索********
                productName: "",
                beginTime: "",
                endTime: "",
                orderNumber: "",
                username: "",
                //********搜索********
                //********编辑框,详情框,警告框,小吐司********
                isShowEdit: false,
                editContent: {},
                alertContent: {},
                isShowDetail: false,
                detailContent: undefined,
                isDetail: true, //true显示详细信息,false显示物流信息
                transContent: null //物流信息
                //********编辑框,详情框,警告框,小吐司********
            }
        },
        watch: {
            '$route' (to, from) {
                this.status = to.params.orderStatus;
                this.jumpPage(1);
                this.checkIds.splice(0,this.checkIds.length);
            }
        },
        methods: {
            checkThis(){
              let self =this;
              let el=document.getElementsByClassName('check_this');
              for(let i=0;i<el.length;i++){
                if(!el[i].checked){
                  self.checkAllValue=false;
                }
              }
            },
            checkAll(self){
              let my=this;
              let el=document.getElementsByClassName('check_this');
              let el1=self;
              if(!self.target.checked){
                for(let i=0;i<el.length;i++) {
                  el[i].checked = false;
                }
                my.checkIds.splice(0,my.checkIds.length);
              }else{
                  my.checkIds.splice(0,my.checkIds.length);
                for(let i=0;i<el.length;i++) {
                  el[i].checked = true;
                  if(my.checkIds.indexOf(el[i].value)<0){
                    my.checkIds.push(el[i].value);
                  }
                }
              }
            },
            showAlert: function (text, index, orderNum) {
                let alertContent = {};
                alertContent.textValue = text;
                alertContent.eventType = index;
                alertContent.orderNumber = orderNum;
                this.alertContent = alertContent;
                this.$store.commit("setAlert", true);
            },
            alertHandle: function (boolValue) {
                let self = this;
                if (boolValue) {
                    switch (this.alertContent.eventType) {
                        //关闭
                        case 1: {
                            axios({
                                method: "post",
                                url: "/tvshop/order/closeOrder",
                                data: qs.stringify({
                                    orderNumber: this.alertContent.orderNumber
                                })
                            }).then(function (res) {
                                if (res.data.code == 20000) {
                                    self.$store.commit("setToast", "关闭成功");
                                    self.jumpPage(self.currentPage);
                                }
                            });
                            break;
                        }
                        case 2: {
                            axios({
                                method: "post",
                                url: "/tvshop/order/acceptRefund",
                                data: qs.stringify({
                                    orderNumber: this.alertContent.orderNumber
                                })
                            }).then(function (res) {
                                if (res.data.code == 20000) {
                                    self.$store.commit("setToast", "确认成功");
                                    self.jumpPage(self.currentPage);
                                }
                            });
                            break;
                        }
                        case 3: {
                            axios({
                                method: "post",
                                url: "/tvshop/order/delOrder",
                                data: qs.stringify({
                                    orderNumber: this.alertContent.orderNumber
                                })
                            }).then(function (res) {
                                if (res.data.code == 20000) {
                                    self.$store.commit("setToast", "关闭成功");
                                    self.jumpPage(self.currentPage);
                                }
                            });
                        }
                    }
                }
                this.$store.commit("setAlert", false);
            },
            showEditDialog: function (type, orderNum, oldVal) {
                //不直接给this.editContent赋值,触发watcher
                let editContent = {};
                editContent.type = type; //0:修改价格;1:发货;2:备注
                editContent.oldVal = oldVal;
                editContent.orderNumber = orderNum;
                this.editContent = editContent;
                this.isShowEdit = true;
            },
            editHandle: function (bool) {
                if (bool) {
                    this.jumpPage(this.currentPage, true);
                }
                this.closeDialog();
            },
            showDetail: function (item) {
                this.detailContent = item;
                this.isDetail = true;
                this.isShowDetail = true;
            },
            detailHandle: function () {
                this.closeDialog();
            },
            showLogisticsDetail: function (transportNumber, id) {
                let self = this;
                this.isDetail = false;
                this.isShowDetail = true;
                this.transContent = null;
                axios({
                    method: "get",
                    url: "/tvshop/order/getLogistics",
                    params: {
                        transportNumber: transportNumber,
                        transportCompany: id
                    }
                }).then(function (res) {
                    if (res.data.code == 20000 || res.data.code == 20024) {
                        if (res.data.resp) {
                            self.transContent = {
                                LogisticCode: res.data.resp.logistics.LogisticCode,
                                companyName: res.data.resp.logistics.companyName,
                                Traces: res.data.resp.logistics.Traces.reverse()
                            }
                        } else {
                            self.transContent = res.data;
                        }
                    } else {
                        self.$dealRes(res.data.code, res.data.msg);
                    }
                })
            },
            closeDialog: function () {
                this.isShowEdit = false;
                this.isShowDetail = false;
            },
            jumpPage: function (count, isFresh) {
                this.currentPage = count;
                let self = this;
                let para = {
                    pageSize: 6,
                    pageIndex: count
                };
                para.productName = this.productName || undefined;
                para.orderNumber = this.orderNumber || undefined;
                para.startTime = this.beginTime ? this.beginTime.getTime() : undefined; //注意,此处是startTime
                para.endTime = this.endTime ? this.endTime.getTime() : undefined;
                para.userName = this.username || undefined;
                //状态为100时请求退款接口
                let url = "";
                if (this.status == 100) {
                    url = '/tvshop/order/refundOrderList';
                } else {
                    url = '/tvshop/order/orderList';
                    para.status = this.status;
                }
                axios({
                    method: "get",
                    url: url,
                    params: para
                }).then(function (res) {
                    if (res.data.code == 20000) {
                        self.initObj = res.data.resp.orderList.list;
                        self.countNum = res.data.resp.orderList.totalRows;
                    } else {
                        self.$dealRes(res.data.code, res.data.msg);
                    }
                }).catch(function (error) {
                    self.$store.commit("setToast", "连接服务器失败,请稍后重试");
                });
            },
            printPage(){
                let self=this;
                if(self.checkIds.length>0){
                    rxUtils.sessionStorage.setItem('orderIds',self.checkIds.join(','));
                    rxUtils.sessionStorage.setItem('status',self.status);
                    this.$router.push({name:'orderPrint'})
                }else{
                    rxUtils.sessionStorage.removeItem('orderIds')
                    rxUtils.sessionStorage.removeItem('status')
                    self.$store.commit("setToast", "请选择需要打印的订单");
                }
            },
            printExpress(){
                if(this.checkIds.length>0){
                    rxUtils.sessionStorage.setItem('orderIds',this.checkIds.join(','));
                    this.$router.push({path:'/printOrder'})
                }else{
                    rxUtils.sessionStorage.removeItem('orderIds')
                    rxUtils.sessionStorage.removeItem('status')
                    this.$store.commit("setToast", "请选择需要打印的订单");
                }
            }
        },
        components: {
            editDialog,
            detailDialog
        },
        beforeRouteEnter: function (to, from, next) {
            let status = to.params.orderStatus;
            let para = {
                pageSize: 6,
                pageIndex: 1
            };
            //状态100时,请求退款接口
            let url = "";
            if (status == 100) {
                url = '/tvshop/order/refundOrderList';
            } else {
                url = '/tvshop/order/orderList';
                para.status = status;
            }
            next(vm => {
                vm.$store.commit('setIsLoading', true)
                axios({
                    method: "get",
                    url: url,
                    params: para
                }).then(function (res) {
                    vm.$store.commit('setIsLoading', false)
                    if (res.data.code == 20000) {
                        vm.status = status
                        vm.initObj = res.data.resp.orderList.list;
                        vm.countNum = res.data.resp.orderList.totalRows;
                    } else {
                        vm.$dealRes(res.data.code, res.data.msg);
                    }
                }).catch(function (error) {
                    console.log(error)
                    vm.$store.commit("setToast", "连接服务器失败,请稍后重试");
                })
            });
        }
    }
</script>
<style lang="scss">
    .order_manager {
        .check_this,.all_check{
            width:15px;
            height:15px;
        }
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
    }
    div.comm_table_content{
        >button{
            padding:6px 9px;
            border:1px solid #efefef;
            background: #fbfbfb;
            margin-bottom:10px;
            cursor:pointer;
        }
    }
</style>