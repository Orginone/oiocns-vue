<template>
  <div class="main">
    <div class="nav-list">
      <div class="nav-title">选择分类</div>
      <el-select v-model="valuee" placeholder="Select">
        <el-option-group
          v-for="group in optionsList"
          :key="group.label"
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-option-group>
      </el-select>
    </div>
    <div class="content">
      <div class="table">
        <diytab
          :style="{width:'100%'}"
          ref="diyTable"
          :hasTabs="true"
          :tableName="'商城'"
          :hasTitle="true"
          :hasTableHead="true"
          :tableData="state.myAppList"
          :options="options"
          @handleUpdate="handleUpdate"
          @selectionChange="selectionChange"
          :tableHead="tableHead"
        >
        <template #buttons>
            <el-button class="btn-check" type="primary" @click="goBuyCar()" link>购物车</el-button>
          </template>
          <template #price="scope">
              ￥{{scope.row.price||"0.00"}}
          </template>
          <template #days="scope">
              {{scope.row.days?scope.row.days+'天':'-'}}
          </template>
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                ···
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="requireItem">查看详情</el-dropdown-item>
                  <el-dropdown-item @click="joinShopCar(scope.row.id)">加入购物车</el-dropdown-item>
                  <el-dropdown-item @click="buyThings(scope.row)">购买</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #slot-card>
            <card></card>
          </template>
        </diytab>
      </div>
    </div>
    <createShop :createDialog="dialogType.createDialog" @closeDialog="closeDialog('createDialog', false)"/>

  </div>
  
</template>

<script setup lang="ts">
  import diytab from '@/components/diyTable/index.vue'
  import card from '../components/card.vue'
  import { reactive, onMounted, ref, watch, nextTick ,getCurrentInstance } from 'vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { appstore } from '@/module/store/app'
  import createShop from "../components/createShop.vue";
  import marketServices from "@/module/store/market"

  const diyTable = ref(null)
  const valuee = ref<any>('');
  const instance = getCurrentInstance();
  const optionsList = [
    {
      label: '功能分类',
      options: [
        {
          value: 'caiwu',
          label: '财务',
        },
        {
          value: 'zichan',
          label: '资产',
        },
      ],
    },
  ]
  const dialogType: any = reactive({
    createDialog: false, // 创建商店弹窗状态
    detailDialog: false, // 基础详情弹窗状态
  });
  interface ListItem {
    code: string
    name: string
    trueName: string
    teamCode: string
    remark: string
  }

  onMounted(() => {
  })
  // 从文件内获取展示数据
  const getPageDataFromServices = ()=>{
      state.myAppList = marketServices.marketList
  }

  const handleClick = (item: any) => {
    ElMessageBox.confirm(`确认操作吗?`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async() => {
      await marketServices.deleteMarket(item.id);
      getPageDataFromServices()
    })
    .catch(() => { })
  }
  const goBuyCar = ()=>{
    router.push({path: "/store/shoppingCar" });
  }
  const checkList = reactive<any>([])
  const selectionChange = (val: any) => {
    checkList.value = val
  }
  const options = ref<any>({
    checkBox: false,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
   // 关闭弹窗
   const closeDialog = (type: string, key: boolean) => {
    dialogType[type] = key;
  };
  const modeType = ref<'card' | 'list'>('card')
  const router = useRouter()
  const shopcarNum = ref(0)

  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  // 软件开放市场信息
  const softShareInfo = ref<MarketType>({} as MarketType)

  const state = reactive({
    myAppList: []
  })
  // 表格展示信息
  const tableHead = [
    {
      prop: 'caption',
      label: '应用名称'
    },
    {
      prop: 'sellAuth',
      label: '应用权限'
    },
    {
      type:'slot',
      name: 'price',
      label: '价格'
    },
    {
      type: 'slot',
      prop: 'days',
      name:'days',
      label: '使用期限'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      width:'200'
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      width: '300',
      name: 'operate'
    }
  ]
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getAppList()
  }
  //立即购买回调
const buyThings = (item:any) => {
  ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    
    setTimeout(async () => {
      await $services.order
        .create({
          data: {
            code: new Date().getTime().toString().substring(0, 13),
            name: item.caption,
            merchandiseId: item.id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            ElMessage({
              message: '创建订单成功',
              type: 'success'
            })
          }
        })
    }, 1)
  }).catch(()=>{})
}
  onMounted(() => {
    getMarketInfo()
    getShopcarNum()
  })
  //加入购物车
  const joinShopCar = async (id: any) => {
    await appstore.staging(id)
    getAppList()
  }
  const requireItem = () => {}
  // 获取购物车数量
  const getShopcarNum = async () => {
    shopcarNum.value = await appstore.getShopcarNum()
  }

  // 搜索功能-关键词
  const searchVal = ref<string>('') // 搜索关键词

  // 获取应用列表
  const getAppList: (goFirst?: boolean) => void = async (goFirst = true) => {
    const { result = [], total = 0 } = await appstore.merchandise(
      softShareInfo.value.id,
      pageStore,
      searchVal.value
    )
    state.myAppList = result || []
  }

  // 获取共享仓库信息
  const getMarketInfo = async () => {
    softShareInfo.value = await appstore.getMarketInfo()
    getAppList()
  }

  const GoPage = (path: string) => {
    router.push(path)
  }

  watch(modeType, (val, valOld) => {
    // 监听 展示方式变化
    nextTick(() => {
      getAppList()
    })
  })
  const getShopData = () => {
    console.log('1')

    $services.appstore
      .merchandise({
        data: {
          id: router.currentRoute.value.query.id,
          offset: 0,
          limit: 20,
          filter:'',
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.myAppList = res.data.result || []
        }
      })
  }
  watch(() => router.currentRoute.value.fullPath, () => {
    if(router.currentRoute.value.query?.id){
      getShopData();
    }else{
      console.log('2')
      getAppList()
    }
  })
  instance?.proxy?.$Bus.on("clickBus", (num) => {
    if(num =='1020'){ //创建商店
      dialogType.createDialog = true;
    }else if(num == '1021'){
      handleClick(router.currentRoute.value.query.id)
    }else if(num == '1022'){
      router.push({path:'/store/userManage',query:{data:router.currentRoute.value.query.id}})
    }else if(num == '1023'){
      // dialogType.detailDialog = true;
    }
  });
</script>
<style lang="scss">
  .el-dropdown-link{
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;
  }
  .el-dropdown-link:hover{
    background:#1642cb;
    color: #fff;
  }
  .main{
    .el-input__wrapper{
      box-shadow: 0 0 0 0;
      border-radius: 30px;
      background: #F2F4F9;
    }
    .el-select .el-input.is-focus,.el-select .el-input .el-input__wrapper{
      box-shadow: 0 0 0 0;
    }
  }
</style>
<style lang="scss" scoped>
  .main{
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    color: #303133;
    border-top: 3px solid #f0f4f8;
    .nav-list{
      width: 240px;
      height: 100%;
      background: #fff;
      border-right: 1px solid #EBEEF5;
      margin-right: 3px;
      box-sizing: border-box;
      padding: 10px 15px;
      font-size: 14px;
      font-weight: bold;
      .nav-title{
        margin-bottom: 10px;
      }
    }
    .content{
      width:calc(100%);
      display: flex;
      flex-direction: column;
      background: #f0f4f8;
      .menu{
        height: 40px;
        width: 100%;
        background: #aab;
        margin-bottom: 6px;
      }
      .table{
        background: #fff;
        display: flex;
        height:calc(100vh - 100px);
        .btn-check{
          padding: 8px 16px;
          color: #154ad8;
        }
        .btn-check:hover{
            background: #154ad8;
            color: #fff;
            padding: 8px  16px;
        }
        .table-tabs{
          width: 500px;
          .el-menu--horizontal{
            border: 0;
          }
          .el-menu-item{
            padding: 0;
            margin-right: 16px;
            margin-bottom: 3px;
            border: 0 !important;
          }
          .is-active{
            background: #fff;
          }
          .is-active::after{
            content:'';
            position: absolute;
            left: 0;
            margin-left: calc(50% - 9px);
            bottom: 25%;
            width:18px;
            border-radius: 5px;
            height: 2px;
            background: #154ad8;
          }
          .el-menu--horizontal:hover, .el-menu-item:hover{
            background: #fff;
          }
        }
      }
    }
  }
</style>
