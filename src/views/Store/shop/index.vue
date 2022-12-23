<template>
  <div class="main">
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
          :total="pageStore.total"
          @selectionChange="selectionChange"
          :tableHead="tableHead"
        >
        <template #buttons>
            <el-button class="btn-check" type="primary" @click="goBuyCar()" link>
              购物车
              <el-badge :value="carNum" class="item"> </el-badge>
            </el-button>
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
                  <el-dropdown-item @click="requireItem(scope.row)">查看详情</el-dropdown-item>
                  <el-dropdown-item @click="joinShopCar(scope.row)">加入购物车</el-dropdown-item>
                  <el-dropdown-item @click="buyThings(scope.row)">购买</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #slot-card>
            <div class="card-list">
              <div
                class="card-item"
                v-for="(item, index) in state.myAppList"
                :key="index"
              >
                <div class="item-head">
                  <div class="item-img">{{ item.caption.substring(0,1) }}</div>
                  <div class="item-head-content">
                    <p>
                      <span
                        >{{ item.caption }}
                      </span>
                        <el-dropdown>
                          <span class="el-dropdown-link drop-list"> ··· </span>
                          <template #dropdown>
                            <el-dropdown-item @click="requireItem(item)">查看详情</el-dropdown-item>
                            <el-dropdown-item @click="joinShopCar(item)">加入购物车</el-dropdown-item>
                            <el-dropdown-item @click="buyThings(item)">购买</el-dropdown-item>
                          </template>
                        </el-dropdown>
                    </p>
                    <!-- <p>73MB</p> -->
                  </div>
                </div>
                <div class="item-content">
                  {{item.product.remark}}
                </div>
                <div class="tag">
                  <el-tag class="tag-item" type="info">{{item.sellAuth}}</el-tag>
                </div>
                <div class="time">创建于 {{ item.createTime }}</div>
              </div>
            </div>
          </template>
        </diytab>
      </div>
    </div>
    <createShop :createDialog="dialogType.createDialog" @closeDialog="closeDialog('createDialog', false)"/>
    <addShop :addDialog="dialogType.addDialog" @checksSearch="checksSearch" @closeDialog="closeDialog('addDialog', false)"/>
    <appInfo :infoDialog="dialogType.infoDialog" :infoDetail="infoDetail.info" @closeDialog="closeDialog('infoDialog', false)"></appInfo>
    <el-drawer v-model="showCar" title="购物车" size="300">
        <car></car>
    </el-drawer>
  </div>
  
</template>

<script setup lang="ts">
  import diytab from '@/components/diyTable/index.vue'
  import { reactive, onMounted, ref, watch, nextTick ,getCurrentInstance } from 'vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import createShop from "../components/createShop.vue";
  import addShop from "../components/addShop.vue";
  import appInfo from "./components/appInfo.vue"
  import car from "./components/car.vue"

  import marketCtrl from '@/ts/controller/store/marketCtrl';
  import userCtrl from '@/ts/controller/setting/userCtrl';

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
    addDialog:false,//加入商店弹窗
    infoDialog:false, // 基础详情弹窗状态
  });
  const infoDetail:any= reactive({
    info:{}
  })
  const handleClick = (id: any) => {
    ElMessageBox.confirm(`确认操作吗?`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async() => {
      await  marketCtrl.Market.deleteMarket(id) 
      router.go(0);
    })
    .catch(() => { })
  }
  const goBuyCar = ()=>{
    showCar.value = true;
  }
  const checkList = reactive<any>([])
  const selectionChange = (val: any) => {
    checkList.value = val
  }
  const options = ref<any>({
    checkBox: true,
    order: true,
    selectLimit: 1,
    noPage:false,
    switchType:true,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
  const storeList = ref<any>([]);
   // 关闭弹窗
   const closeDialog = (type: string, key: boolean) => {
    dialogType[type] = key;
  };
  const router = useRouter()

  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 0,
    pageSize: 20,
    total: 0
  })
  // 软件开放市场信息
  const softShareInfo = ref<MarketType>({} as MarketType)
  // 购物车
  const showCar = ref<boolean>(false);
  const carNum = ref<number>(0);
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
    pageStore.currentPage = page.current
    pageStore.pageSize = page.pageSize
    // getAppList()
  }
  //立即购买回调
const buyThings = (item:any) => {
  ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    
    setTimeout(async () => {
      await marketCtrl.buyShoping([item]);
    }, 1)
  }).catch(()=>{})
}
  onMounted(() => {
    getMarketInfo()
    pageStore.tableData = marketCtrl.shopinglist
    carNum.value =  marketCtrl.shopinglist.length || 0
    if(marketCtrl.shopinglist.length ==0){
      setTimeout(() => {
        pageStore.tableData = marketCtrl.shopinglist
        carNum.value =  marketCtrl.shopinglist.length || 0
      },2000);
    }
  })
  //加入购物车
  const joinShopCar = async (item: any) => {
    marketCtrl.joinApply(item);
    pageStore.tableData = marketCtrl.shopinglist
    carNum.value =  marketCtrl.shopinglist.length || 0
  }
  // 加入商店
  const checksSearch = async (val:any)=>{
    let selectId: any[] = []
    console.log('selectId',val)

    val.value.forEach((el: { id: any }) => {
      selectId.push(el.id)
    })
    if(await userCtrl.user.applyJoinMarket(selectId[0])){
      ElMessage({
        message: '加入成功',
        type: 'success'
      })
      closeDialog('addDialog',false)
    }
  }
  // 详情弹窗
  const requireItem = (item:Object) => {
    dialogType.infoDialog = true;
    infoDetail.info = item;
  }

  // 搜索功能-关键词
  const searchVal = ref<string>('') // 搜索关键词

  // 获取应用列表
  const getAppList = (item:any) =>{
    let page = {
      filter:"",
      limit:pageStore.pageSize,
      offset:pageStore.currentPage
    }
    item?.getMerchandise(page).then((res:any)=>{
      state.myAppList = res.result;
      console.log('state.myApp',state.myAppList)
      diyTable.value.state.page.total = res.total
    })
  }

  // 获取共享仓库信息
  const getMarketInfo = async () => {
    marketCtrl.Market.getJoinMarkets().then((res)=>{
      storeList.value = res;
      getAppList(res[0])
    })
  }
  watch(() => router.currentRoute.value.fullPath, () => {
      //监听路由
      let id = router.currentRoute.value.query.id
      let item = storeList.value.filter((item:any) => {
          return item.market.id == id;
      });
      getAppList(item[0]) 
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
    }else if(num == '1024'){
      handleClick(router.currentRoute.value.query.id)
    }else if(num == '1025'){
      dialogType.addDialog = true;
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
        .table-tabs{
          min-width: 300px;
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
  .card-list {
    padding: 10px 0;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    .card-item {
      width: 279px;
      box-sizing: border-box;
      padding: 14px;
      border-radius: 5px;
      margin-right: 12px;
      margin-bottom: 12px;
      border: 1px solid #e9e9e9;
      .item-head {
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        align-items: center;
        .item-img {
          background: #d4f0fc;
          text-align: center;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          margin-right: 15px;
          font-size: 14px;
          color: #0C4EFF;
        }
      }
      .item-head-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        p:nth-child(1) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            margin-right: 5px;
          }
          .drop-list {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
        p:nth-child(2) {
          color: #9c9c9c;
          font-size: 14px;
        }
      }
      .item-content {
        font-size: 12px;
        margin: 12px 0;
        color: #7f7f7f;
      }
      .tag {
        margin: 12px 0;
      }
      .time {
        font-size: 12px;
        color: #7f7f7f;
      }
    }
}
</style>
