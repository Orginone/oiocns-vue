<template>
  <div class="managerApproval">
    <MarketCard>
      <template #routeContent
        ><HeadImg
          :name="market.name"
          :url="market.icon || storeImg"
          :imgWidth="35"
          :limit="1"
          :isSquare="false"
      /></template>
      <template #marketNameSlot
        ><span style="color: grey; font-size: 17px; margin-right: 20px"
          >{{ market.name }}
        </span></template
      >
    </MarketCard>
    <div class="common-layout">
      <div style="height: 85vh">
        <div
          style="
            height: 35vh;
            margin: 5px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="width: 66%; height: 100%">  
            <el-carousel :interval="4000" type="card" style="width: 100%;height: 100%;">
              <el-carousel-item v-for="item in carousels" :key="item">
                <h3 text="5xl" justify="center">            <el-image
              style="
                width: auto;
                height: auto;
                max-width: 60%;
                max-height: 60%;
                margin-right: 20px;
                border-radius: 15px;
              "
              :src="item"
            /></h3>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div
          style="
            height: 2vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="width: 66%; height: 100%; color: black;font-weight: bold; font-size: 18px">
            热门应用
          </div>
        </div>
        <div
          style="
            height: 25vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div
            style="
              width: 66%;
              height: 100%;
              border-bottom: 1px solid silver;
              color: grey;
              font-size: 14px;
              align-items: left;
              justify-content: center;
              
            "
          >
          <el-row :gutter="100">
                <el-col :span="12" v-for="item in carousels" :key="item"><div class="infoitem" @click="showPolicy" ><span style="color: black;width: 15%;">                <el-image
                    
                    style="
                      width: auto;
                      height: auto;
                      max-width: 100%;
                      max-height: 100%;
                      margin-right: 20px;
                      border-radius: 15px;
                    "
                    :src="item"
                /></span> 
                <div style="display: inline;">
                <div style="font-size: 16px">必剪</div>
                <div style="margin: 0">
                  <el-rate
                    v-model="market.score"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
                <div style="font-size: 10px; color: grey; margin-right: 20px; "
                  >销量:{{ thousands(market.orderNum) }}单</div
                >

              </div>
                
              </div>            </el-col> 

              </el-row>
 
          </div>
        </div>

        <div
          style="
            height: 2vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
   
        </div>
        <div
          style="
            height: 15vh;
            margin: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: grey;
          "
        >
          <div style="width: 66%; height: 100%; color: grey;font-size: 10 px;">
            华为应用市场用户协议 &nbsp;&nbsp;&nbsp;&nbsp;和&nbsp;&nbsp;&nbsp;&nbsp; 关于华为应用市场与隐私的声明<br/>
            苏ICP备17040376号 | 苏网文[2021]2829-053号 | 增值电信业务经营许可证：苏b2-20130048号 | 电子营业执照 | 不良信息举报中心 | 华为应用市场 版权所有 © 2010-2021
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script lang="ts" setup>
import $services from '@/services'
import { onMounted, reactive, ref } from 'vue'
import MarketCard from '@/components/marketCard/index.vue'
import storeImg from '@/assets/img/app_icon.png'
import bijianImg from '@/assets/img/bijian.png'
import bj1 from '@/assets/img/bj1.jpg'
import bj2 from '@/assets/img/bj2.jpg'
import bj3 from '@/assets/img/bj3.jpg'
import bj4 from '@/assets/img/bj4.jpg'
import bj5 from '@/assets/img/bj5.jpg'
import mk1 from '@/assets/img/mk1.jpg'
import mk2 from '@/assets/img/mk2.jpg'
import mk3 from '@/assets/img/mk3.jpg'
import mk4 from '@/assets/img/mk4.jpg'
import mk5 from '@/assets/img/mk5.jpg'
import { ElMessage } from 'element-plus'
import DiyTable from '@/components/diyTable/index.vue'
const carousels = ref([mk1,mk2,mk3,mk4,mk5])
const diyTable = ref(null)
const state = reactive({
  applyList: [],
  tableHead: []
})
const market = ref({
  name: 'XX市场',
  icon: null,
  score: 4.5,
  orderNum: 56789,
  version: 'beta1.0.1',
  price: '免费',
  type: 'web应用'
})

onMounted(() => {
  starterAppApprovalList()
})

const thousands = (num: number) => {
  var str = num.toString()
  var reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
  return str.replace(reg, '$1,')
}
const showPolicy = () => {
  window.open('https://www.bilibili.com/blackboard/activity-GpejgaRvl5.html')
}
const permissionsIsShowed = ref(false)
const showPermissions = () => {
  permissionsIsShowed.value = true
}
const closeDialog = () => {
  permissionsIsShowed.value = false
}
//查询上架申请
const starterAppApprovalList = async () => {
  await $services.appstore
    .searchPublishApply({
      data: {
        offset: 0,
        limit: 10,
        filter: ''
      }
    })
    .then((res: ResultType) => {
      if (res.success) {
        const { result = [], total = 0 } = res.data
        state.applyList = []
        state.applyList = result?.map(
          (item: {
            product: { name: any; code: any; source: any; authority: any; typeName: any }
          }) => {
            return {
              ...item,
              productCode: item.product.code,
              productName: item.product.name,
              productSource: item.product.source,
              productAuthority: item.product.authority,
              productTypeName: item.product.typeName
            }
          }
        )
        state.tableHead = [
          {
            prop: 'productCode',
            label: '应用编号'
          },
          {
            prop: 'productName',
            label: '应用名称'
          },
          {
            prop: 'productSource',
            label: '应用来源'
          },
          {
            prop: 'productAuthority',
            label: '应用权限'
          },
          {
            prop: 'productTypeName',
            label: '应用类型'
          },
          {
            prop: 'price',
            label: '价格'
          },
          {
            prop: 'days',
            label: '使用期限'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: '200'
          }
        ]
      }
    })
}
</script>
  
  <style lang="scss" scoped>
.managerApproval {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .tabList {
    width: 100%;
    height: calc(100vh - 130px);
    padding-left: 16px;
  }
  .infoitem {
    border-bottom: 1px solid;
    color: grey;
    font-size: 14px;
    padding: 5px;
    display: flex;
  }
  .infoitem:hover{
    background-color: rgb(231, 231, 231);
  }
}
</style>
  