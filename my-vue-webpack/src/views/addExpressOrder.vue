<template>
    <div class="add_express_order">
        <div class="mainContent">
            <h1 class="comm_title">订单管理 >> 快递单模板</h1>
            <p class="add" @click="routerModel">+添加快递单模板</p>
            <table>
                <thead>
                    <tr>
                    <td>预览图</td>
                    <td>物流公司</td>
                    <td>操作</td>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in temList">
                        <td><img :src="item.picUrl" alt=""></td>
                        <td v-text="item.expressName"></td>
                        <td><span @click="routerSetting(item.templateId)">设置</span><span @click="routerEditor(item.templateId)">编辑</span><span @click="deleteExpress(item.templateId,index)">删除</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style lang="scss">
    div.add_express_order{
        div.mainContent{
            p.add{
                color:blue;
                float:right;
                margin-top:-30px;
                margin-right:20px;
                cursor:pointer;
            }
            table{
                width:95%;
                margin:30px auto 0 auto;
                thead{
                    tr{
                        td{
                            background: #f3f3f3;
                            padding:10px;
                        }
                    }
                }
                tbody{
                    td{
                        background: #fff;
                        color:#323232;
                        font-size: 16px;
                        text-align: center;
                        vertical-align: middle;
                        padding:10px 0;
                        img{
                            width:126px;
                            height:70px;
                            display:block;
                            margin:0 auto;
                        }
                        span{
                            font-size: 16px;
                            color:blue;
                            margin-right:20px;
                            cursor:pointer;
                        }
                    }
                }
                tr{
                    td{
                        collapse: collapse;
                        border:1px solid #bdbdbd;
                        text-align: center;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>
<script>
    export default {
        data(){
            return {
                temList:[]
            }
        },
        methods:{
            routerModel(){
                this.$router.push({path:'/addModel'})
            },
            routerSetting(id){
                this.$router.push({name:'addModel',query:{
                    type:false,
                    id:id
                }})

            },
            routerEditor(id){
                this.$router.push({name:'addModel',query:{
                    type:true,
                    id:id
                }})
            },
            deleteExpress(id,index){
                let self=this;
                axios({
                    method: 'post',
                    url:'/tvshop/template/removeExpressTemplate',
                    data: qs.stringify({
                        templateId:id
                    })
                }).then(function (response) {
                        if(response.data.code==20000){
                            self.$store.commit("setToast", "删除成功");
                            setTimeout(function(){
                                self.temList.splice(index,1)
                            },1000)
                        }

                    })
            }
        },
        mounted(){
            let self=this;
            this.$nextTick(function(){
                axios.get('/tvshop/template/expressTemplateList', {})
                    .then(function (response) {
                        console.log(response.data)
                        self.temList=response.data.resp.templateList;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
        }
    }
</script>