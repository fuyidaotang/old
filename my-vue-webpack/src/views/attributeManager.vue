<template>
    <div class="submitAttribute">
        <div class="mainContent">
            <h1 class="comm_title">属性管理 >> 属性列表</h1>
            <article class="comm_form">
                <div class="pack">
                    <search-box class="searchBox"></search-box>
                    <button class="button_type_3">搜索</button>
                </div>
                <table>
                    <tr>
                        <th class="shopClass">商品分类</th>
                        <th class="className">属性名称</th>
                        <th class="hasAttribute">拥有的属性</th>
                        <th class="operation">操作</th>
                    </tr>
                    <tbody v-for="(item,index) in skuInfoList">
                        <tr v-for="(group,index) in item.prSKUInfos">
                            <td :rowspan='item.row' class="shopClass"
                                v-show="!(index>0&&index<=(item.row-1))">{{item.productCategoryName}}</td>
                            <td class="className">{{group.skuName}}</td>
                            <td class="hasAttribute">{{group.options|Format}}</td>
                            <td class="operation">
                                <a @click="jumpAttr(item,group)">编辑</a>
                                <a @click="deleteAttr(group)">删除</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </article>
        </div>
    </div>
</template>

<script>
    import searchBox from '../components/chooseCate/searchBox.vue';
    export default {
        name: '',
        data () {
            return {
                arr1: [{row:2},{row:3},{row:1},{row:1}],
                skuInfoList: {}
            }
        },
        filters: {
            Format: function (options) {
                return options.substr(0,options.length-1)
            }
        },
        methods: {
            deleteAttr: function (item) {
                let para = {};
                para.skuId = item.skuId;
                axios({
                    method: 'post',
                    url: '/tvshop/product/delSku',
                    data: qs.stringify(para)
                }).then((res) => {
                    if (res.data.code === 20000) {
                        this.$dealRes(res.data.code, res.data.msg);
                        setTimeout(function () {
                            location.reload()
                        }, 1000)
                    } else {
                        this.$dealRes(res.data.code, res.data.msg);
                    }
                })
            },
            jumpAttr: function (item,group) {
                sessionStorage.setItem('productCategoryCode',item.productCategoryCode);
                sessionStorage.setItem('skuId',group.skuId);
                location.href = '/hdjmanager/submitAttribute/' + item.productCategoryCode
            }
        },
        beforeRouteEnter (to,from,next) {
            next(vm=>{
                axios({
                    method: 'get',
                    url: '/tvshop/product/skuOptionList'
                }).then(function (res) {
                    if (res.data.code === 20000) {
                        let sukInfo = res.data.resp.skuInfo;
                        if(sukInfo){
                          sukInfo.forEach((val) => {
                            val.row = val.prSKUInfos.length
                          });
                          vm.skuInfoList = sukInfo;
                        }
                    } else {
                        vm.$dealRes(res.data.code, res.data.msg);
                    }
                })
            })
        },
        components: {
            searchBox
        }
    }
</script>

<style lang='scss'>
    .submitAttribute{
        .mainContent{
            .pack {
                height: 33px;
                margin-top: 30px;
                margin-bottom: 30px;
                .searchBox {
                    float: left;
                    border-radius: 2px;
                    margin-left: 320px;
                }
                .button_type_3 {
                    float: left;
                    margin-left: 30px;
                }
            }
            table{
                td,th{
                    border: 1px solid #dbdbdb;
                    height: 40px;
                    text-align: center;
                }
                th{
                    background: #fbfbfb;
                }
                .shopClass{
                    width: 300px;
                }
                .className{
                    width: 200px;
                }
                .hasAttribute{
                    width: 600px;
                }
                .operation{
                    width: 160px;
                    a{
                        color: #2713ee;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>