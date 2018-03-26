<template>
    <div class="myAddress">
        <div class="mainContent">
            <h1 class="comm_title">进货管理 >> 发货地址  <span class="fr" v-show="!isAddAddress" @click="isAddAddress = !isAddAddress">+添加地址</span></h1>
            <ul class="addressList" v-show="!isAddAddress">
                <li v-for="(item, $index) in addressList"><figure @click="chooseThis(item.addressId, $index)" class="fl" :class="{'active': $index === chooseIndex}"><img src="../images/tick_2.png" alt=""></figure>{{item.addressProvincesInfo}} {{item.addressCityInfo}} {{item.addressDistrictInfo}} {{item.addressStreet}} <span @click="showDel(item.addressId, $index)">删除</span></li>
            </ul>
            <div class="addAddress" v-show="isAddAddress">
                <label>发货地址</label>
                <wholeArea v-model="address"></wholeArea>
                <input type="text" v-show='address' v-model.trim="addressStreet" class="addressStreet" placeholder="详细地址">
                <article class="comm_form">
                    <section class="centerBlock">
                        <button class="button_type_2 fl" @click="save()">保存</button>
                        <button class="button_type_1 fr" @click="cancel()">取消</button>
                    </section>
                </article>
            </div>
        </div>
        <myAlert v-show="$store.state.isShowAlert" :para="{textValue:'确定删除?'}" @alertEvent="del"></myAlert>
    </div>
</template>
<script>
    import wholeArea from '../components/comm/wholeArea.vue'
    import myAlert from '../components/comm/myAlert.vue'
  export default {
    data(){
      return {
        isAddAddress: false,
        address: false,
        addressStreet: '',
        addressList: [],
        chooseIndex: -1
      }
    },
    methods: {
      save:function(){
        this.$store.commit('setIsLoading', true)
        var data = {
          addressProvinces: this.address[0],
          addressCity: this.address[1],
          addressDistrict: this.address[2] || -1,
          addressStreet:this.addressStreet
        }
        axios({
          method: 'post',
          url: '/tvshop/template/addSpaceAddress',
          data: qs.stringify(data)
        }).then(res => {
          this.$store.commit('setIsLoading', false)
          if(res.data.code === 20000){
            this.$store.commit('setToast', '添加成功')
            setTimeout(()=>{
              location.reload()
            }, 1000)
          }else{
            this.$store.commit('setToast', res.data.msg)
          }
        })
      },
      cancel: function(){
        this.isAddAddress = false
      },
      showDel: function(id, index){
        sessionStorage.setItem('id', id)
        sessionStorage.setItem('index', index)
        this.$store.commit('setAlert', true)
        return
      },
      del: function(bool){
        if(bool){
          var id = sessionStorage.getItem('id')
          var index = sessionStorage.getItem('index')
          if(this.addressList[index].defaulted === 1){
            this.chooseIndex = -1
          }
          this.addressList.splice(index, 1)
          axios({
            method: 'post',
            url: '/tvshop/template/delSpaceAddress',
            data: qs.stringify({
              addressId: id
            })
          }).then(res => {
            if(res.data.code !== 20000){
              this.$store.commit('setToast', '操作失败')
            }
          })
        }
        sessionStorage.removeItem('id')
        sessionStorage.removeItem('index')
        this.$store.commit('setAlert', false)
      },
      chooseThis: function(id, index){
        axios({
          method: 'post',
          url: '/tvshop/template/chooseSpaceAddress',
          data: qs.stringify({
            addressId: id
          })
        }).then(res => {
          if(res.data.code === 20000){
            this.chooseIndex = index
          }else{
            this.$store.commit('setToast', '设置收货地址失败')
          }
        })
      }
    },
    components: {
      wholeArea,
      myAlert
    },
    created: function(){
      axios({
        method: 'get',
        url: '/tvshop/template/getSpaceAddressList'
      }).then(res => {
        if(res.data.code === 20000){
          this.addressList = res.data.resp.spaceAddress
          this.addressList.forEach((item, index) => {
            if(item.defaulted === 1){
              this.chooseIndex = index
            }
          })
        }else{
          this.$store.commit('setToast', '获取收货地址列表失败')
        }
      })
    }
  }
</script>
<style lang="scss">
    .myAddress{
        .addressList{
            margin-left:24px;
            li{
                overflow:hidden;
                height:16px;
                line-height:16px;
                font-size:14px;
                margin-top:20px;
                padding-right:100px;
                figure{
                    width:14px;
                    height:14px;
                    border:1px solid #dbdbdb;
                    border-radius:50%;
                    margin-right:10px;
                    img{
                        display:none;
                        margin:0 auto;
                        width:10px;
                    }
                }
                figure.active{
                    background:#a90e0e;
                    border-color:#a90e0e;
                    img{
                        display:block;
                        margin:3px 2px;
                    }
                }
                span{
                    float:right;
                    font-size:14px;
                    color:#2713ee;
                    cursor:pointer;
                }
                span:hover{
                    text-decoration: underline;
                }
            }
        }
        .addAddress{
            margin-top:20px;
            margin-left:24px;
            .addressStreet{
                border:1px solid #dbdbdb;
                height:24px;
                padding-left:20px;
            }
            label{
                vertical-align: middle;
            }
            .comm_form{
                margin-top:100px;
            }
        }
    }
</style>