<template>
    <div class="add_model">
        <div class="mainContent">
            <h1 class="comm_title">订单管理 >> 快递单模板</h1>
            <p class="tips">请上传快递单扫描件图片</p>
            <table v-show="template" >
                <tr>
                    <td>快递公司</td>
                    <td>
                        <input class="expressName" v-model="selected" >
                    </td>
                </tr>
                <tr>
                    <td>模板图片</td>
                    <td><input type="file" @change="update($event)"><span>+添加快递面单</span></td>
                </tr>
                <tr>
                    <td>图片显示</td>
                    <td>
                        <div class="pic_show"><img :src="picImg" alt=""></div>
                    </td>
                </tr>
            </table>
            <div v-show="!template" class="tem_box" :style="picStyle">
                <img :src="picImg" alt="">
                <span class="text jijianren" :style="sendName">寄件姓名</span>
                <span class="text shoujianxm" :style="receiveName">收件姓名</span>
                <span class="text jijiandanwei" :style="sendCompanyName">寄件单位名称</span>
                <span class="text jijianphone" :style="sendContact">寄件联系电话</span>
                <span class="text jijiandizhi" :style="sendAddress">寄件地址</span>
                <span class="text shoujiandw" :style="receiveCompanyName">收件单位名称</span>
                <span class="text shoujiandz" :style="receiveAddress">收件地址</span>
                <span class="text jijianyoubian" :style="sendZipCode">寄件邮编</span>
                <span class="text beizhu" :style="receiveRemarks">买家备注</span>
                <span class="text neirong" :style="productName">寄托物内容</span>
                <span class="text shoujianphone" :style="receiveContact">收件联系电话</span>
                <span class="text jijianshifa" :style="sendSite">寄件始发地</span>
                <span class="text shoujianyb" :style="receiveZipCode">收件邮编</span>
            </div>
            <div  v-show="template" class="btn">
                <button class="action" @click="templateShow">确定</button>
                <button class="noAction" @click="back">取消</button>
            </div>
            <div v-show="!template" class="btn">
                <button class="action" @click="submit">确定</button>
                <button class="noAction" @click="templateHide">取消</button>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
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
                        input.expressName{
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
            div.tem_box{
                margin:50px auto 0 auto;
                position: relative;
                width:22.5cm;
                height:12.4cm;
                >img{
                    width:100%;
                    height:100%;
                }
                span{
                    position: absolute;
                    border:1px solid #a90f0f;
                    width:100px;
                    text-align: center;
                    height:20px;
                    line-height:20px;
                    background: #fbfbfb;
                }
            }
        }
    }
</style>
<script>
    import draggabilly from  'draggabilly'
    export default {
        data(){
            return{
                selected:'',
                picImg:'',
                template:true,
                data:{},
                picId:'',
                productName:{},
                receiveAddress: {} ,
                receiveCompanyName: {},
                receiveContact: {},
                receiveName: {},
                receiveRemarks: {},
                receiveZipCode: {},
                sendAddress: {},
                sendCompanyName: {},
                sendContact: {},
                sendName: {},
                sendSite: {},
                sendZipCode: {},
                picStyle:{
                  width:'',
                  height:''
                }
            }
        },
        mounted(){
            let self=this;
            this.$nextTick(function(){
                var draggableElems = document.querySelectorAll('.text');
                var draggies = []
                for ( var i=0, len = draggableElems.length; i < len; i++ ) {
                    var draggableElem = draggableElems[i];
                    var draggie = new draggabilly( draggableElem, {
                        containment: '.tem_box'
                    });
                    draggies.push( draggie );
                }
                if(this.$route.query.id!==undefined&&this.$route.query.type!==undefined){
                    if(window.location.href.split('?')[1].split('&')[0].split('=')[1]=='true'){
                        self.template=true;
                    }else{
                        self.template=false;
                    }
                    axios.get('/tvshop/template/expressTemplateDetail', {
                        params:{templateId:Number(this.$route.query.id)}
                    })
                        .then(function (response) {
                            self.selected=response.data.resp.template.expressName;
                            self.picImg=response.data.resp.template.picUrl;
                            self.picId=response.data.resp.template.expressPicId;
                            self.productName.top=response.data.resp.template.productName.y;self.productName.left=response.data.resp.template.productName.x;
                            self.receiveAddress.top=response.data.resp.template.receiveAddress.y;self.receiveAddress.left=response.data.resp.template.receiveAddress.x;
                            self.receiveCompanyName.top=response.data.resp.template.receiveCompanyName.y;self.receiveCompanyName.left=response.data.resp.template.receiveCompanyName.x;
                            self.receiveContact.top=response.data.resp.template.receiveContact.y;self.receiveContact.left=response.data.resp.template.receiveContact.x;
                            self.receiveName.top=response.data.resp.template.receiveName.y;self.receiveName.left=response.data.resp.template.receiveName.x;
                            self.receiveRemarks.top=response.data.resp.template.receiveRemarks.y;self.receiveRemarks.left=response.data.resp.template.receiveRemarks.x;
                            self.receiveZipCode.top=response.data.resp.template.receiveZipCode.y;self.receiveZipCode.left=response.data.resp.template.receiveZipCode.x;
                            self.sendAddress.top=response.data.resp.template.sendAddress.y;self.sendAddress.left=response.data.resp.template.sendAddress.x;
                            self.sendCompanyName.top=response.data.resp.template.sendCompanyName.y;self.sendCompanyName.left=response.data.resp.template.sendCompanyName.x;
                            self.sendContact.top=response.data.resp.template.sendContact.y;self.sendContact.left=response.data.resp.template.sendContact.x;
                            self.sendName.top=response.data.resp.template.sendName.y;self.sendName.left=response.data.resp.template.sendName.x;
                            self.sendSite.top=response.data.resp.template.sendSite.y;self.sendSite.left=response.data.resp.template.sendSite.x;
                            self.sendZipCode.top=response.data.resp.template.sendZipCode.y;self.sendZipCode.left=response.data.resp.template.sendZipCode.x;
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            })
        },
        methods:{
            back(){
                this.$router.push({path:'/expressOrder'})
            },
            templateShow(){
                if(this.picImg!==''){
                    this.template=false;
                }else{
                    this.$store.commit("setToast", "请先上传快递面单");
                }
            },
            templateHide(){
                if(this.$route.query.type==undefined){
                    this.template=true;
                }else{
                    this.$router.push({path:'/expressOrder'})
                }
            },
            update(e){
                let self=this;
                this.$store.commit('setIsLoading', true)
                let file = e.target.files[0];
                let param = new FormData(); //创建form对象
                param.append('file',file,file.name);//通过append向form对象添加数据
                param.append('type','1');//添加form表单中其他数据
                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                }; //添加请求头
                axios.post('/tvshop/app/uploadPic',param,config)
                    .then(response=>{
                        console.log(response.data)
//                        self.picStyle.width=response.data.resp.picInfo.width/3+'px';
                        self.picImg=response.data.resp.picInfo.url;
                        self.picId=response.data.resp.picInfo.id
                        self.$store.commit('setIsLoading', false)
                    })
            },
            submit(){
                let self=this;
                let el=document.getElementsByClassName('text');
                self.data={};
                self.data.expressName=self.selected;
                self.data.expressPicId=self.picId;
                self.data.sendName=document.getElementsByClassName('jijianren')[0].style.left+','+document.getElementsByClassName('jijianren')[0].style.top;
                self.data.sendAddress=document.getElementsByClassName('jijiandizhi')[0].style.left+','+document.getElementsByClassName('jijiandizhi')[0].style.top;
                self.data.sendCompanyName=document.getElementsByClassName('jijiandanwei')[0].style.left+','+document.getElementsByClassName('jijiandanwei')[0].style.top;
                self.data.sendContact=document.getElementsByClassName('jijianphone')[0].style.left+','+document.getElementsByClassName('jijianphone')[0].style.top;
                self.data.sendZipCode=document.getElementsByClassName('jijianyoubian')[0].style.left+','+document.getElementsByClassName('jijianyoubian')[0].style.top;
                self.data.sendSite=document.getElementsByClassName('jijianshifa')[0].style.left+','+document.getElementsByClassName('jijianshifa')[0].style.top;
                self.data.receiveName=document.getElementsByClassName('shoujianxm')[0].style.left+','+document.getElementsByClassName('shoujianxm')[0].style.top;
                self.data.receiveAddress=document.getElementsByClassName('shoujiandz')[0].style.left+','+document.getElementsByClassName('shoujiandz')[0].style.top;
                self.data.receiveCompanyName=document.getElementsByClassName('shoujiandw')[0].style.left+','+document.getElementsByClassName('shoujiandw')[0].style.top;
                self.data.receiveContact=document.getElementsByClassName('shoujianphone')[0].style.left+','+document.getElementsByClassName('shoujianphone')[0].style.top;
                self.data.receiveZipCode=document.getElementsByClassName('shoujianyb')[0].style.left+','+document.getElementsByClassName('shoujianyb')[0].style.top;
                self.data.receiveRemarks=document.getElementsByClassName('beizhu')[0].style.left+','+document.getElementsByClassName('beizhu')[0].style.top;
                self.data.productName=document.getElementsByClassName('neirong')[0].style.left+','+document.getElementsByClassName('neirong')[0].style.top;
                console.log(self.data)
                if(this.$route.query.type==undefined){
                    var url='/tvshop/template/addExpressTemplate';
                }else{
                    var url='/tvshop/template/updateExpressTemplate';
                    self.data.templateId=this.$route.query.id;
                }
                axios({
                    method: 'post',
                    url:url,
                    data: qs.stringify(self.data)
                }).then(res =>{
                    console.log(res)
                    if(res.data.code==20000) {
                        self.$store.commit("setToast", "提交成功");
                        setTimeout(function(){self.$router.push({path:'expressOrder'})})
                    }else{
                        self.$store.commit("setToast",res.data.msg);
                    }
                })
            }
        }
    }
</script>