<template>
    <div class="new_goods_size">
        <a class="gogogo" href="/hdjmanager/chooseCate/2" v-if="!sizeValue[0]">添加规格属性</a>
        <div v-if="sizeValue[0]" class="goodsSizeItem" v-for="sku in sizeValue">
            <h3>{{sku.skuName}}: <span @click="chooseAll(sku, sku.optionList)">全选</span><span @click="chooseInvert(sku, sku.optionList)">反选</span></h3>
            <div class="main cf">
                <div class="item" v-for="(option, index) in sku.optionList">
                    <div class="choose" :class="{'chosen': option.isChoosed}"
                         @click="chooseOption(sku, sku.optionList, index)">
                        <img src="../../images/choosen.png">
                    </div>
                    <span>{{option.optionalName}}</span>
                </div>
            </div>
        </div>
        <div v-if="sizeValue[0]" class="goodsSizeShow" v-show="skuList.length !== 0">
            <h3>商品销售规格<span>库存为0的宝贝规格，在商品详情页不展示</span></h3>
            <div class="batch">
                <span>批量填充：</span>
                <input type="number" v-if="isFactory" placeholder="进货价" v-model="bPrice">
                <input type="number" placeholder="售卖价" v-model="sPrice">
                <input type="number" placeholder="库存" v-model="inventoryCount">
                <span class="alarm">库存数量警报：</span>
                <input class="alarm" type="number" placeholder="当库存少于该数量时，会及时通知您" v-model="alarm" @change="submitDate">
            </div>
            <table v-if="sizeList[0]">
                <tr>
                    <th class="prop_cell" v-for="sku in skuList">{{sku.skuName}}</th>
                    <th v-if="isFactory">进货价(元)</th>
                    <th>售卖价(元)</th>
                    <th>库存(件)</th>
                    <th class="pic_cell">图片</th>
                </tr>
                <tr v-for="(tds, index) in sizeList">
                    <td class="prop_cell" v-for="td in tds.list" :rowspan="td.rowspan" align="center">
                        {{td.optionalName}}
                    </td>
                    <td v-if="isFactory">
                        <input type="number" v-model="tds.bPrice" @change="submitDate" readOnly="true">
                    </td>
                    <td v-if="isFactory">
                        <input type="number" v-model="tds.sPrice" @change="submitDate" readOnly="true">
                    </td>
                    <td  v-if="!isFactory">
                        <input type="number" v-model="tds.sPrice" @change="submitDate">
                    </td>
                    <td>
                        <input type="number" v-model="tds.inventoryCount" @change="submitDate">
                    </td>
                    <td class="pic_cell">
                        <pic-upload class="cell_upload" @pushPicId="pushPicId" :index="index" :initImage="{picturePath:tds.picUrl}" :isEdit="!!tds.picUrl"></pic-upload>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
  import picUpload from '../../components/comm/picUpload.vue';
  export default {
    props: ['chooseSize','pAlarm','permission'],
    watch: {
      // 已选择选择属性
      chooseSize: function(){
        if(this.chooseSize.length === 0){
          this.sizeList = []
          this.optionsList = []
          this.optionMap= {}
          this.skuList = []
          this.initSizeValue()
          return;
        }
        let optionList = []
        this.chooseSize.forEach((item) => {
          let options = ''
          item.prskuInfos.forEach((item2) => {
            options += item2.optionalId + ','
            if(optionList.indexOf(item2.optionalId) === -1){
              optionList.push(item2.optionalId)
            }
          })
          this.optionsList.push(options)
        })
        this.optionList = optionList
        this.initSizeValue()
      },
      bPrice: function() {
        this.fillDate()
        this.submitDate()
      },
      sPrice: function() {
        this.fillDate()
        this.submitDate()
      },
      inventoryCount: function() {
        this.fillDate()
        this.submitDate()
      },
      sizeList: function() {
        this.submitDate()
      },
      pAlarm: function() {
        this.alarm = this.pAlarm
      }
    },
    data() {
      return {
        //后端返回数据
        sizeValue: false,
        optionList: [],//将所有option(o1,o2,o3,o4格式)放进去
        optionsList: [],//将所有options('o1,o2,o3','o1,o2,o3'格式)放进去
        // 所有选中项
        optionMap: {},
        //表格项
        sizeList: [],
        skuList:[],//标题
        //批量填充
        bPrice: '',
        sPrice: '',
        inventoryCount: '',
        alarm: 0,
        isFactory: sessionStorage.getItem('permission') == 1
      }
    },
    components: {
      picUpload
    },
    methods: {
      chooseAll: function (sku, list) {
        list.forEach((item, index) => {
          this.chooseOption(sku, list, index, true)
        })
      },
      chooseInvert: function (sku, list) {
        list.forEach((item, index) => {
          this.chooseOption(sku, list, index)
        })
      },
      // sku存放属性名,list是optionlist,index是操作项在list中的位置,ident标识全选(true),反选(false)
      chooseOption: function (sku, list, index, ident) {
        if(!this.optionMap[sku.skuId]){
          this.optionMap[sku.skuId] = []
        }
        let attrCount = 0
        for(let key in this.optionMap) {
          attrCount++
        }
        if(attrCount>2 && this.isFactory){
          delete this.optionMap[sku.skuId];
          this.$store.commit('setToast','最多只能选择两个属性')
          return
        }
        if(attrCount>3 && !this.isFactory){
          delete this.optionMap[sku.skuId];
          this.$store.commit('setToast','最多只能选择三个属性')
          return
        }
        // 显示选中状态,slice方法深拷贝数组
        list[index].isChoosed = ident || !list[index].isChoosed
        list[index].skuName = sku.skuName
        sku.optionList = list.slice(0)
        // 将选中的项放入 optionMap
        if (list[index].isChoosed) {
          if(this.optionMap[sku.skuId]){
            let length = this.optionMap[sku.skuId].length
            for(let i = 0; i < length; i++){
              if(this.optionMap[sku.skuId][i].optionalId === list[index].optionalId) {
                return;
              }
            }
            this.optionMap[sku.skuId].push(list[index])
          }
        } else {
          //取消选中则将该项移除,依据optionId判断是否同项
          for(let key in this.optionMap){
            if(key == sku.skuId){
              this.optionMap[key].forEach((item, i) => {
                if (item.optionalId === list[index].optionalId) {
                  this.optionMap[key].splice(i, 1)
                  if(this.optionMap[key].length === 0){
                    delete this.optionMap[key]
                  }
                }
              })
            }
          }
        }
        // 根据optionMap生成sizeList
        this.createSizeList()
      },
      //后来人看到这段代码,我只能说,自求多福
      createSizeList: function () {
        let tempArray = []
        for(let key in this.optionMap){
          this.optionMap[key].sort(function(a,b){
              return a.optionalId > b.optionalId
          })
          let tempObj = {
            rowspan: 1,
            list: this.optionMap[key]
          }
          if(this.optionMap[key].length !== 0) {
            tempArray.push(tempObj)
          }
        }
        //再给tempArray排序
        tempArray.sort(function(a,b){
          return a.list[0].skuId > b.list[0].skuId
        })
        var sizeCount = 1
        //获取总条数
        tempArray.forEach((obj) => {
          sizeCount = sizeCount * obj.list.length
        })
        // 设置rowspan
        this.skuList = []
        //数组的forEach是有序的
        tempArray.forEach((obj, index) => {
          let skuObj = {}
          skuObj.skuName = obj.list[0].skuName
          skuObj.skuId = obj.list[0].skuId
          this.skuList[index] = skuObj
          if(index === 0){
            obj.rowspan = sizeCount/obj.list.length
          }else{
            obj.rowspan = tempArray[index-1].rowspan/obj.list.length
          }
        })
        var sizeList = new Array(sizeCount)
        //设置图形数组,用于遍历表格
        tempArray.forEach((tempObj, index) => {
          tempObj.list.forEach((option, i) => {
            var base = 0,times = 1 // 基数和倍数(把for循环去掉,base,times去掉,就知道他们什么用了)
            if(index>0){
              base = tempArray[index-1].rowspan//基数
              for(var j = index - 1; j >= 0; j--) {
                times = times * tempArray[j].list.length
              }
            }
            option.rowspan = tempObj.rowspan
            for(var j=0;j<times;j++){
              if(sizeList[base*j + i*tempObj.rowspan]){
                sizeList[base*j + i*tempObj.rowspan].list.push(option)
              }else{
                sizeList[base*j+ i*tempObj.rowspan] = {
                  bPrice: 0,
                  sPrice: 0,
                  inventoryCount: 0,
                  list:[option]
                }
              }
            }
          })
        })
        //生成options
        tempArray.forEach((tempObj, index) => {
          tempObj.list.forEach((option, i) => {
            var base = 0,times = 1 // 基数和倍数(把for循环去掉,base,times去掉,就知道他们什么用了)
            if(index>0){
              base = tempArray[index-1].rowspan//基数
              for(var j = index - 1; j >= 0; j--) {
                times = times * tempArray[j].list.length
              }
            }
            option.rowspan = tempObj.rowspan
            for(var j=0;j<times;j++){
              for(var a=0;a<tempObj.rowspan;a++){
                if(sizeList[base*j + i*tempObj.rowspan+a].options){
                  sizeList[base*j + i*tempObj.rowspan+a].options += option.optionalId + ','
                }else{
                  sizeList[base*j + i*tempObj.rowspan+a].options = option.optionalId + ','
                }
              }
            }
          })
        })
        this.sizeList = sizeList
      },
      //批量填充数据
      fillDate: function(){
        this.sizeList.forEach((item) => {
          item.bPrice = this.bPrice
          item.sPrice = this.sPrice
          item.inventoryCount = this.inventoryCount
        })
      },
      //获取最终提交数据
      submitDate: function(){
        let str = ''
        var isSubmit = true
        this.sizeList.forEach((item,index) => {
          if(item.inventoryCount <=0 || item.sPrice<=0) {
            isSubmit = false
          }
          str = str + 'productInventory='+item.inventoryCount + '&'
          str = str + 'productPrice='+item.sPrice + '&'
          let optionIds = item.options.substring(0,item.options.length-1)
          str = str + 'optionalIds='+optionIds
          if(item.picId){
            str = str + '&picId='+item.picId
          }
          if(this.chooseSize[0] && this.chooseSize[0].prskuInfos){
            this.chooseSize.forEach((item2) => {
              let flag = true
              item2.prskuInfos.forEach((item3) => {
                if(item.options.indexOf(item3.optionalId) === -1){
                  flag = false
                }
              })
              if(flag){
                str = str + '&inventoryId='+item2.inventory.inventoryId
              }
            })
          }
          if(this.isFactory){
            if(item.bPrice <=0) {
              isSubmit = false
            }
            str = str + '&resalePrice='+item.bPrice
          }
          str = str + '|'
          if(index == this.sizeList.length-1){
            str = str.substring(0,str.length-1)
            if(str[str.length-1] == '&'){
              str = str.substring(0,str.length-1)
            }
            this.$emit('setNewSize', str, this.alarm, isSubmit)
          }
        })
      },
      pushPicId: function(id,index){
        this.sizeList[index].picId = id
        this.submitDate()
      },
      initSizeValue: function () {
        let _this = this
        let para = {}
        if (sessionStorage.getItem("categoryCode")) {
          para.productCategoryCode = sessionStorage.getItem("categoryCode");
        }
        axios({
          method: "get",
          url: "tvshop/product/spaceSkuInfo",
          params: para,
          withCredentials: true
        }).then(function (res) {
          if (res.data.code === 20000) {
            _this.sizeValue = res.data.resp.skuInfo;
            //初始化选中项
            _this.optionList.forEach((item) => {
              _this.sizeValue.forEach((item2) => {
                item2.optionList.forEach((item3,index) => {
                  if(item3.optionalId == item){
                    _this.chooseOption(item2,item2.optionList,index,true)
                  }
                })
              })
            })
            //初始化选中数据
            _this.sizeList.forEach((item) => {
              _this.chooseSize.forEach((item2) => {
                let flag = true
                item2.prskuInfos.forEach((item3) => {
                  if(item.options.indexOf(item3.optionalId) === -1){
                    flag = false
                  }
                })
                if(flag){
                  item.bPrice = item2.inventory.resalePrice
                  item.sPrice = item2.inventory.productPrice
                  item.inventoryCount = item2.inventory.productInventory
                  item.picUrl = item2.inventory.imagePath
                }
              })
            })
          } else {
            _this.$dealRes(res.data.code, res.data.msg);
          }
        })
      }
    },
    created: function(){
      this.initSizeValue()
    }
  }
</script>
<style lang="scss">
    .gogogo{
        color: #a90e0e;
        text-decoration: underline;
    }
    .new_goods_size {
        border: 1px solid #dbdbdb;
        width: 964px;
        display: inline-block;
        vertical-align: top;
        padding: 20px;
        background: #fbfbfb;
        .goodsSizeItem {
            margin-top: 20px;
            h3 {
                font-size: 14px;
                font-weight: bold;
                span {
                    font-size: 14px;
                    font-weight: normal;
                    display: inline-block;
                    width: 50px;
                    text-align: center;
                    line-height: 20px;
                    &:hover {
                        cursor: pointer;
                    }
                    &:first-child {
                        margin-left: 20px;
                        border-right: 1px solid #dddddd;
                    }
                }
            }
            .main {
                width: 931px;
                background: #FFFFFF;
                padding: 0 20px;
                padding-bottom: 20px;
                margin-top: 20px;
                .item {
                    width: 185px;
                    float: left;
                    margin-top: 20px;
                    span {
                        font-size: 14px;
                    }
                    .choose {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border: 1px solid #dddddd;
                        &.chosen {
                            background: #a90f0f;
                        }
                        img {
                            margin-top: 2px;
                            margin-left: 1px;
                        }
                    }
                }
            }
        }
        .goodsSizeShow {
            margin-top: 20px;
            h3 {
                font-size: 14px;
                font-weight: bold;
                span {
                    font-size: 14px;
                    font-weight: normal;
                    color: #c4c4c4;
                    margin-left: 30px;
                }
            }
            .batch {
                margin: 20px;
                height: 16px;
                span, input {
                    font-size: 14px;
                }
                span.alarm {
                    margin-left: 40px;
                }
                input.alarm {
                    width: 240px;
                }
                input {
                    width: 110px;
                    background: #fbfbfb;
                    margin-left: 20px;
                    border: 1px solid #dbdbdb;
                }
            }
            table, tr, td, th {
                border-collapse: collapse;
                border: 1px solid #dbdbdb;
            }
            table {
                .prop_cell{
                    width:200px;
                }
                .pic_cell{
                    width:80px;
                    .cell_upload{
                        width:80px;
                        height:80px;
                        .btnStyle{
                            border:none;
                            overflow:hidden;
                            s{
                                width:20px;
                                height:20px;
                                background-size:56px 178px;
                                background-position:-37px -74px;
                                margin:30px auto;
                            }
                        }
                    }
                }
                td, th {
                    height:40px;
                    line-height:40px;
                    font-size: 14px;
                    width: 120px;
                    text-align: center;
                    input {
                        font-size: 14px;
                        text-align: center;
                    }
                }
                .chosenItem {
                    width: 200px;
                    height:80px;
                }
                td {
                    background: #FFFFFF;
                }
            }
            .pic {
                margin: 20px;
                height: 28px;
                position: relative;
                span, select {
                    font-size: 14px;
                }
                span:last-child {
                    color: #c4c4c4;
                }
                i {
                    position: absolute;
                    border: 8px solid transparent;
                    border-top-color: #888888;
                    top: 10px;
                    left: 265px;
                }
            }
        }
    }
</style>