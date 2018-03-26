<template>
    <div class="add_model">
        <div class="mainContent">
            <h1 class="comm_title">订单管理 >> 快递单批量打印</h1>
            <table >
                <tr>
                    <td>快递公司</td>
                    <td>
                        <select name="" v-model="templateId" @change="temDetail()" id="">
                            <option value="null">请选择快递模版</option>
                            <option v-for="item in temList" :value="item.templateId" v-text="item.expressName"></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>图片显示</td>
                    <td>
                        <div class="pic_show"><img :src="picImg" alt=""></div>
                    </td>
                </tr>
            </table>
            <div class="btn">
                <button class="action" @click="showPrintn">确定</button>
                <button class="noAction" @click="routerBack">取消</button>
            </div>
        </div>
        <ul class="print_page" v-show="printType">
            <li v-for="list in orderList" class="tem_box" :style="picStyle">
                <img v-show="printOr" :src="picImg"  alt="">
                <span class="text beizhu" :style="style.receiveRemarks" v-text="list.receiveRemarks"></span>
                <span class="text neirong" :style="style.productName" v-text="list.productName"></span>
                <span class="text jijianren" :style="style.sendName" v-text="list.sendName"></span>
                <span class="text jijiandanwei" :style="style.sendCompanyName" v-text="list.sendCompanyName"></span>
                <span class="text jijianphone" :style="style.sendContact" v-text="list.sendContact"></span>
                <span class="text jijiandizhi" :style="style.sendAddress" v-text="list.sendAddress"></span>
                <span class="text jijianyoubian" :style="style.sendZipCode" v-text="list.sendZipCode"></span>
                <span class="text jijianshifa" :style="style.sendSite" v-text="list.sendSite"></span>
                <span class="text shoujianxm" :style="style.receiveName" v-text="list.receiveName"></span>
                <span class="text shoujiandw" :style="style.receiveCompanyName" v-text="list.receiveCompanyName"></span>
                <span class="text shoujiandz" :style="style.receiveAddress" v-text="list.receiveAddress"></span>
                <span class="text shoujianphone" :style="style.receiveContact" v-text="list.receiveContact"></span>
                <span class="text shoujianyb" :style="style.receiveZipCode" v-text="list.receiveZipCode"></span>
                <div class="PageNext"></div>
            </li>
            <li v-show="printOr" class="btn"><span @click="print">打印</span><span @click="printType=false;">退出</span></li>
        </ul>
    </div>
</template>
<style lang="scss">
    @media print {
        .PageNext { page-break-after: always; }
    }

    div.add_model{
        div.mainContent{
            p.tips{
                color:red;
                font-size: 16px;
                position: absolute;
                right:20px;
                top:16px;
            }
            table{
                margin-left:10px;
                tr:nth-child(3){
                    td:first-child{
                        vertical-align: top;
                    }
                }
                tr:nth-child(2){
                    td:nth-child(2){
                        position: relative;
                        input{
                            position: absolute;
                            left:0;
                            right:0;
                            height:30px;
                            top: 4px;
                            z-index: 1;
                            filter:Alpha(opacity=50);
                            opacity:0;
                            *zoom:1; /* 激活IE6、7的haslayout属性，让它读懂Alpha */
                            cursor:pointer;
                        }
                        span{
                            position: absolute;
                            left:0;
                            right:0;
                            top:4px;
                            border:1px solid #bdbdbd;
                            background: #f3f3f3;
                            border-radius: 4px;
                            height:30px;
                            line-height:30px;
                            text-align: center;
                            color:#323232;
                            font-size: 16px;
                            cursor:pointer;
                        }
                    }
                }
                tr{
                    td{
                        padding:10px;
                        color:#323232;
                        font-size: 16px;
                        select{
                            width:200px;
                            height:26px;
                            line-height:26px;
                            border:1px solid #bdbdbd;
                            padding-left:20px;
                            option{
                                color:#323232;
                            }
                        }
                        div.pic_show{
                            width:254px;
                            height:254px;
                            border:1px solid #bdbdbd;
                            background: #f3f3f3;
                            img{
                                width:100%;
                            }
                        }
                    }
                }
            }
            div.btn{
                width:550px;
                margin:50px auto 0 auto;
                overflow: hidden;
                button{
                    width:260px;
                    height:50px;
                    border-radius: 8px;
                    font-size: 24px;
                    cursor:pointer;
                }
                button.action{
                    float:left;
                    background: #a90f0f;
                    border:1px solid #a90f0f;
                    color:#fff;
                }
                button.noAction{
                    float:right;
                    background: #fff;
                    color:#a90f0f;
                    border:1px solid #a90f0f;
                }
            }
        }
        ul.print_page{
            position: absolute;
            top: -89px;
            left: -60px;
            background: #fff;
            z-index: 10;
            right: 0;
            bottom: 0;
            li.tem_box{
                position: relative;
                width:22.5cm;
                height:12.4cm;
                >img{
                    width:100%;
                    height:100%;
                }
                span{
                    position: absolute;
                    font-weight: bold;
                    font-family: '微软雅黑';
                }
            }
            li.btn{
                width:400px;
                height:50px;
                overflow: hidden;
                margin:50px auto 0 auto;
                padding-bottom:20px;
                display:block;
                span{
                    width:180px;
                    height:50px;
                    text-align: center;
                    line-height:50px;
                    display:block;
                    border:1px solid #bdbdbd;
                    border-radius: 8px;
                    cursor:pointer;
                }
                span:first-child{
                    float:left;
                }
                span:last-child{
                    float:right;
                }
            }
        }
    }
</style>
<script>
    import rxUtils from '../js/rxUtils'
    export default {
        data(){
            return{
                printType:false,
                picImg:'',
                temList:[],
                checkIds:[],
                templateId:'null',
                style:{
                    productName:{
                        top:'',
                        left:''
                    },
                    receiveAddress: {
                        top:'',
                        left:''
                    } ,
                    receiveCompanyName: {
                        top:'',
                        left:''
                    },
                    receiveContact: {
                        top:'',
                        left:''
                    },
                    receiveName: {
                        top:'',
                        left:''
                    },
                    receiveRemarks: {
                        top:'',
                        left:''
                    },
                    receiveZipCode: {
                        top:'',
                        left:''
                    },
                    sendAddress: {
                        top:'',
                        left:''
                    },
                    sendCompanyName: {
                        top:'',
                        left:''
                    },
                    sendContact: {
                        top:'',
                        left:''
                    },
                    sendName: {
                        top:'',
                        left:''
                    },
                    sendSite: {
                        top:'',
                        left:''
                    },
                    sendZipCode: {
                        top:'',
                        left:''
                    }
                },
                orderList:[],
                printOr:true,
                picStyle:{
                    width:'',
                    height:''
                 }
            }
        },
        mounted(){
            let self=this;
            this.$nextTick(function(){
                this.checkIds=rxUtils.sessionStorage.getItem('orderIds').split(',');
                axios.get('/tvshop/template/expressTemplateList', {})
                    .then(function (response) {
                        self.temList=response.data.resp.templateList;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                axios({
                    method: "get",
                    url: "/tvshop/template/orderTemplate",
                    params: {
                        orderIds: rxUtils.sessionStorage.getItem('orderIds')
                    }
                }).then(function (res) {
                    if(res.data.code==20000){
                      self.orderList=res.data.resp.orderTemplates;
                    }else if(res.data.code==20006){
                      self.$store.commit("setToast", res.data.msg);
                      setTimeout(function(){self.$router.push({path:'/myAddress'})},1000)
                    }else{
                      self.$store.commit("setToast", res.data.msg);
                    }
                    console.log(res.data)
                })
            })
        },
        methods:{
            routerBack(){
                this.$router.back();
            },
            showPrintn(){
                if(this.picImg!==''){
                    this.printType=true;
                }else{
                    this.printType=false;
                    this.$store.commit("setToast", "请选择快递模板");
                }
            },
            temDetail(){
                let self=this;
                if(this.templateId!=='null'){
                    axios.get('/tvshop/template/expressTemplateDetail', {
                        params: {
                            templateId:self.templateId
                        }
                    })
                        .then(function (response) {
                            self.picImg=response.data.resp.template.picUrl;
//                            self.picStyle.width=response.data.resp.template.expressPicSize.x/3+'px';
//                            self.picStyle.height=response.data.resp.template.expressPicSize.y/3+'px';
                            self.style.productName.left=response.data.resp.template.productName.x;
                            self.style.productName.top=response.data.resp.template.productName.y;
                            self.style.receiveAddress.left=response.data.resp.template.receiveAddress.x;
                            self.style.receiveAddress.top=response.data.resp.template.receiveAddress.y;
                            self.style.receiveCompanyName.left=response.data.resp.template.receiveCompanyName.x;
                            self.style.receiveCompanyName.top=response.data.resp.template.receiveCompanyName.y;
                            self.style.receiveContact.left=response.data.resp.template.receiveContact.x;
                            self.style.receiveContact.top=response.data.resp.template.receiveContact.y;
                            self.style.receiveName.left=response.data.resp.template.receiveName.x;
                            self.style.receiveName.top=response.data.resp.template.receiveName.y;
                            self.style.receiveRemarks.left=response.data.resp.template.receiveRemarks.x;
                            self.style.receiveRemarks.top=response.data.resp.template.receiveRemarks.y;
                            self.style.receiveZipCode.left=response.data.resp.template.receiveZipCode.x;
                            self.style.receiveZipCode.top=response.data.resp.template.receiveZipCode.y;
                            self.style.sendAddress.left=response.data.resp.template.sendAddress.x;
                            self.style.sendAddress.top=response.data.resp.template.sendAddress.y;
                            self.style.sendCompanyName.left=response.data.resp.template.sendCompanyName.x;
                            self.style.sendCompanyName.top=response.data.resp.template.sendCompanyName.y;
                            self.style.sendContact.left=response.data.resp.template.sendContact.x;
                            self.style.sendContact.top=response.data.resp.template.sendContact.y;
                            self.style.sendName.left=response.data.resp.template.sendName.x;
                            self.style.sendName.top=response.data.resp.template.sendName.y;
                            self.style.sendSite.left=response.data.resp.template.sendSite.x;
                            self.style.sendSite.top=response.data.resp.template.sendSite.y;
                            self.style.sendZipCode.left=response.data.resp.template.sendZipCode.x;
                            self.style.sendZipCode.top=response.data.resp.template.sendZipCode.y;
                            console.log(self.style)
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }else{
                    self.picImg='';
                }
            },
            print(){
                let self=this;
                this.printOr=false;
                setTimeout(function(){window.print();self.printType=false;self.printOr=true;},500)
            }
        }
    }
</script>