<template>
    <div class="order_print">
        <div v-show="!printShow" class="mainContent">
            <h1 class="comm_title">订单管理 &gt;&gt; <router-link v-if="status=='20'" to="/orderManager/20">待发货订单</router-link><router-link v-if="status=='30'" to="/orderManager/30">已发货订单</router-link> &gt;&gt; 发货单</h1>
            <button @click="print">立即打印</button>
            <button @click="type=!type">切换表格样式</button>
            <div class="list_content">
                <ul class="list">
                    <li  v-for="item in orderList">
                        <h1 class="list_header">发货单</h1>
                        <div class="content_header">
                            <table>
                                <tr>
                                    <td>订单号：{{item.orderNumber}}</td>
                                    <td>下单时间：{{item.orderTime | transDate}}</td>
                                </tr>
                                <tr>
                                    <td>会员名:{{item.userName}}</td>
                                    <td>联系电话：{{item.userPhone}}</td>
                                </tr>
                                <tr>
                                    <td>物流公司：{{item.transportCompany}}</td>
                                    <td>物流单号：{{item.transportNumber}}</td>
                                </tr>
                                <tr>
                                    <td>发货地址：{{item.spaceAddress}}</td>
                                    <td></td>
                                </tr>
                            </table>
                        </div>
                        <div v-for="order in item.totalProductInfoList" class="content_center">
                            <div class="box">
                                <div class="box_left">
                                    <p class="name">{{order.productName}}</p>
                                    <img :src="order.productImage" alt="">
                                    <p class="title"></p>
                                    <p class="num">数量小计：{{order.productCount}}件</p>
                                    <p class="total">金额小计：{{order.productAmount}}元</p>
                                </div>
                                <div class="box_right">
                                    <p>进货单</p>
                                    <table v-if="type">
                                        <tr v-for="row in order.rowList">
                                            <td v-for="column in row">{{column}}</td>
                                        </tr>
                                    </table>
                                    <table v-else>
                                        <tr v-for="row in order.columnList">
                                            <td v-for="column in row">{{column}}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="content_footer">
                            <p>注： 若对产品存在疑惑之处请在签收7个工作日内联系售后部门。感谢您的信任与支持！</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="printShow" class="toast">
            <ul class="list">
                <li  v-for="item in orderList">
                    <h1 class="list_header">发货单</h1>
                    <div class="content_header">
                        <table>
                            <tr>
                                <td>订单号：{{item.orderNumber}}</td>
                                <td>下单时间：{{item.orderTime | transDate}}</td>
                            </tr>
                            <tr>
                                <td>会员名:{{item.userName}}</td>
                                <td>联系电话：{{item.userPhone}}</td>
                            </tr>
                            <tr>
                                <td>物流公司：{{item.transportCompany}}</td>
                                <td>物流单号：{{item.transportNumber}}</td>
                            </tr>
                            <tr>
                                <td>发货地址：{{item.spaceAddress}}</td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <div v-for="order in item.totalProductInfoList" class="content_center">
                        <div class="box">
                            <div class="box_left">
                                <p class="name">{{order.productName}}</p>
                                <img :src="order.productImage" alt="">
                                <p class="title"></p>
                                <p class="num">数量小计：{{order.productCount}}件</p>
                                <p class="total">金额小计：{{order.productAmount}}元</p>
                            </div>
                            <div class="box_right">
                                <p>进货单</p>
                                <table v-if="type">
                                    <tr v-for="row in order.rowList">
                                        <td v-for="column in row">{{column}}</td>
                                    </tr>
                                </table>
                                <table v-else>
                                    <tr v-for="row in order.columnList">
                                        <td v-for="column in row">{{column}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="content_footer">
                        <p>注： 若对产品存在疑惑之处请在签收7个工作日内联系售后部门。感谢您的信任与支持！</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss">
    div.order_print{
        div.mainContent{
            >button{
                background: #fbfbfb;
                color:#323232;
                padding:6px;
                border:1px solid #efefef;
                position: absolute;
            }
            >button{
                top:12px;
                cursor:pointer;
            }
            >button:nth-child(2){
                right:140px;
            }
            >button:nth-child(3){
                right:20px;
            }
            div.list_content{
                width:100%;
                h1.list_header{
                    width:100%;
                    text-align:center;
                    display:inline-block;
                    font-size: 20px;
                    font-weight: bold;
                    margin:30px 0 20px 0;
                }
                ul{
                    li{
                        page-break-after:always;
                        page-break-before:always;
                        >div{
                            width:100%;
                            border-bottom:1px solid #323232;
                            padding-bottom:8px;
                        }
                        div.content_header{
                            table{
                                width:1036px;
                                margin:0 auto;
                                tr{
                                    td{
                                        font-size: 14px;
                                        color:#323232;
                                        padding:7px 0;
                                        font-family: '微软雅黑';
                                    }
                                    td:first-child{
                                        width:58%;
                                    }
                                    td:last-child{
                                        width:42%;
                                    }
                                }
                            }
                        }
                        div.content_center{
                            padding:16px 0;
                            div.box{
                                width:1036px;
                                margin:0 auto;
                                overflow: hidden;
                                div.box_left{
                                    width:172px;
                                    float:left;
                                    p{
                                        font-family: '微软雅黑';
                                    }
                                    p.title{
                                        width:100%;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                        font-size: 12px;
                                        margin-top:10px;
                                        margin-bottom:20px;
                                    }
                                    img{
                                        width:100px;
                                        height:100px;
                                    }
                                    p.name{
                                        width:100px;
                                        text-align: center;
                                        font-size: 14px;
                                        margin-bottom:10px;
                                    }
                                    p.num{
                                        margin-bottom:12px;
                                    }
                                    p.num,p.total{
                                        font-size: 14px;
                                    }
                                }
                                div.box_right{
                                    float:right;
                                    width:800px;
                                    p{
                                        font-size: 14px;
                                        color:#323232;
                                        width:100%;
                                        text-align: center;
                                        margin-bottom:10px;
                                    }
                                    table{
                                        collapse: collapse;
                                        width:100%;
                                        td{
                                            border:1px solid #232323;
                                            width:266px;
                                            vertical-align: middle;
                                            text-align: center;
                                            font-size: 14px;
                                            color:#323232;
                                            padding:6px 0;
                                        }
                                    }
                                }
                            }
                        }
                        div.content_footer{
                            border:none;
                            p{
                                font-size: 14px;
                                font-family: '微软雅黑';
                                color:#323232;
                                width:1036px;
                                margin:15px auto 0 auto;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<style scoped="" lang="scss">
    div.toast{
        position: absolute;
        top:-90px;
        left:-60px;
        right:0;
        background: #fff;
        z-index: 2;
        overflow:hidden;
        li{
            page-break-after:always;
            height:756px;
            padding-top:10px;
        }
        li>h1{
            width:100%;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            font-family: '微软雅黑';
            margin:20px 0;
        }
        li>div{
            width:100%;
            border-bottom:1px solid #323232;
            padding-bottom:8px;
        }
        div.content_header table{
            width:100%;
            margin:0 auto;
            margin-left:20px;
        }
        div.content_header table tr td{
            font-size: 14px;
            color:#323232;
            padding:7px 0;
            font-family: '微软雅黑';
        }
        div.content_header table tr td:first-child{
            width:1000px;
        }
        div.content_header table tr td:last-child{
            width:500px;
        }
        div.content_center{
            padding:16px 0;
        }
        div.box{
            width:100%;
            margin:0 auto;
            overflow: hidden;
            margin-left:20px;
        }
        div.box div.box_left {
            width: 172px;
            float:left;
        }
        p{
            font-family: '微软雅黑';
        }
        p.title{
            width:100%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-size: 12px;
            margin-top:10px;
            margin-bottom:20px;
        }
        img{
            width:100px;
            height:100px;
        }
        p.name{
            width:100px;
            text-align: center;
            font-size: 14px;
            margin-bottom:10px;
        }
        p.num{
            margin-bottom:12px;
        }
        p.num,p.total{
            font-size: 14px;
        }
        div.box div.box_right {
            width: 400px;
            float:left;
        }
        div.box div.box_right p{
            font-size: 14px;
            color:#323232;
            width:100%;
            text-align: center;
            margin-bottom:10px;
        }
        div.box div.box_right table {
            collapse: collapse;
            width:100%;
        }
        div.box div.box_right table td{
            border:1px solid #232323;
            width:266px;
            vertical-align: middle;
            text-align: center;
            font-size: 14px;
            color:#323232;
            padding:6px 0;
        }
        div.content_footer{
            border:none;
        }
        div.content_footer p{
            font-size: 14px;
            font-family: '微软雅黑';
            color:#323232;
            width:1036px;
            margin:15px 0 0 0;
            margin-left:20px;
        }
    }
</style>
<script>
    import rxUtils from '../js/rxUtils'
    export default{
        data(){
            return {
                printShow:false,
                orderList:[],
                startTime:'',
                endTime:'',
                status:20,
                type:true
            }
        },
        mounted(){
            let self=this;
            self.status=rxUtils.sessionStorage.getItem('status')
            this.$nextTick(function () {
              var isFactory = (sessionStorage.getItem('permission')*1 === 1)
              if(isFactory){
                axios.get('/tvshop/order/orderInfoList', {
                  params: {
                    orderIds:rxUtils.sessionStorage.getItem('orderIds')
                  }
                })
                  .then(function (response) {
                    self.orderList=response.data.resp.orderInfo;
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }else{
                axios.get('/tvshop/order/ordersList', {
                  params: {
                    orderIds:rxUtils.sessionStorage.getItem('orderIds')
                  }
                })
                  .then(function (response) {
                    self.orderList=response.data.resp.orders;
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }
            })
        },
        methods:{
            print(){
                let self=this;
                this.printShow=true;
                try{
                    print.portrait   =  false    ;//横向打印
                }catch(e){
                    alert("设置为横向打印更合适哦！");
                }
                setTimeout(function(){window.print();self.printShow=false;},500)
            }
        }
    }
</script>