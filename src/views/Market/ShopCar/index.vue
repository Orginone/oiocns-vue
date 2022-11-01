<template>
  
    <MarketCard>
      <template #right>
        <el-button type="text" @click="deleteStagings">删除</el-button>
        <el-button type="text" @click="createOrderByStaging(null)">购买</el-button>
        <div>
          <el-radio-group v-model="mode" size="small" class="button" @change="changeView">
            <el-radio-button label="list">
              <el-icon :size="18">
                <Tickets />
              </el-icon>
            </el-radio-button>
            <el-radio-button label="card">
              <el-icon :size="18">
                <Menu />
              </el-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
      </template>
    </MarketCard>
    <div class="shopcar-content">
      <ul class="box-ul" v-if="mode == 'card'">
        <li class="app-card">
          <ShopCard v-for="item in pageStore.tableData" :class="{'bule-shadow':item.checked}" :info="item.id"
            :key="item.id" :cardContent="true" type="shopCard" @click="checkedChange(item)">
            <!-- <template #rightIcon>
              <el-dropdown trigger="click" placement="left-start">
                <el-icon :size="18"><Operation /></el-icon>
                <template #dropdown>
                  <el-dropdown-menu>

                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template> -->
            <template #icon>
              <HeadImg :name="item.name" :url="item.icon || merchandiseImg" :imgWidth="48" :limit="1" :isSquare="false"
                style="height: 40px; line-height: 40px" />
            </template>
            <template #header>
              <el-checkbox>
                <div class="app-con-title">{{ item.merchandise.caption }}</div>
              </el-checkbox>
            </template>
            <template #content>
              <div class="shopCar-box" @click="handleCardInfo(item)">
                <div class="app-con-title">{{ item.merchandise.caption }}</div>
                <!-- 附属标题区 -->
                <div class="app-card-item-con-belong">
                  <span>归属: {{ chat.getName(item.belongId) || '未知' }}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>版本： 0.0.1</span>
                </div>
                <div style="margin-top:12px;">
                  <div class="app-con-info">价格：
                    <span style="color: var(--el-color-warning)"> ￥ </span>
                    <strong style="color: var(--el-color-warning); font-size: 16px">{{
                    item.merchandise.price || '0.00'
                    }}</strong>
                  </div>
                  <div class="app-con-info">售卖权属：{{ item.merchandise.sellAuth }}
                    <el-tag size="small"
                      v-if="item.merchandise.sellAuth !== '所属权' && (item.merchandise.days && item.merchandise.days!==undefined) ">
                      使用期： {{ item.merchandise.days + '天' }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </template>
            <template #option>
              <div class="option-unit" @click="createOrderByStaging(item.id)">立即购买</div>
            </template>
          </ShopCard>
        </li>
      </ul>
      <DiyTable v-else ref="diyTable" :hasTitle="true" :tableData="pageStore.tableData" :tableHead="pageStore.tableHead"
        :options="{ noPage: true ,checkBox: true}" @handleUpdate="handleUpdate" @select="handleSelect">
        <template #operate="scope">
          <DiyButton>
            <template v-slot:opt>
              <div class="diy-button" @click="deleteStaging(scope.row.id)"> 删除 </div>
              <div class="diy-button" @click="createOrderByStaging(scope.row.id)"> 购买 </div>
            </template>
          </DiyButton>
        </template>
      </DiyTable>

      <!-- <template v-for="item in state.dialogShow" :key="item.key"> -->
      <AppInfoDialog v-if="state.dialogShow[0].value" :dialogShow="state.dialogShow[0]" @closeDialog="closeDialog">
      </AppInfoDialog>
      <!-- </template> -->
      <el-pagination class="page-pagination" @size-change="(e) => handlePaginationChange(e, 'limit')"
        @current-change="(e) => handlePaginationChange(e, 'current')" background :page-sizes="pageSizes"
        v-model:currentPage="pagination.current" v-model:page-size="pagination.limit"
        layout="total, prev, pager, next, sizes" :total="pageStore.total"></el-pagination>
    </div>

</template>

<script setup lang="ts">
import $services from '@/services'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { PAGE_SIZES, PAGE_NUM } from '@/constant'
import { ElTable } from 'element-plus'
import ShopCard from '../components/shopCard.vue'
import AppInfoDialog from '../MarketList/components/appInfoDialog.vue'
import DiyButton from '@/components/diyButton/index.vue'
import merchandiseImg from '@/assets/img/app_icon.png'
import moment from 'moment'
import {chat} from '@/module/chat/orgchat'
const router = useRouter()
// 表格分页数据
const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
// 表格展示数据
const pageStore = reactive({
  tableData: [],
  tableHead: [
    {
      prop: 'caption',
      label: '商品名称'
    },
    { prop: 'information', label: '商品信息' },
    { prop: 'sellAuth', label: '售卖权属' },
    { prop: 'days', label: '使用期限' },
    { prop: 'price', label: '售卖价格' },
    { prop: 'number', label: '数量' },
    { prop: 'marketName', label: '市场名称' },
    { prop: 'marketCode', label: '市场编号' }
  ],
  total: 0
})

const handleUpdate = (page: any) => {
  getTableList()
}
// const cardActive = ref(true)
const mode = ref('card')
const loading = ref(false)
const isRouterAlive = ref(true)
const allchecked = reactive({ anyData: [], checked: false })
const pageSizes = ref<Array<any>>(PAGE_SIZES)
onMounted(() => {
  getTableList()
})
// 会话列表搜索关键字
const searchValue = ref<string>('')
const shopcarTableRef = ref<InstanceType<typeof ElTable>>()
//点击行触发，选中或不选中复选框
const handleRowClick = (row: any) => {
  shopcarTableRef.value!.toggleRowSelection(row, undefined)
}

const GoPage = (path: string) => {
  router.push(path)
}
const GoPageWithQuery = (path: string, query: any) => {
  router.push({ path, query })
}
const viewform = (item: any) => {
  alert('55')
}

const state = reactive({
  page: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    pageSize: 20, // 每页条数
    pageSizes: [20, 30, 50], // 分页数量列表
    layout: 'total, prev, pager, next'
  },
  dialogShow: [
    {
      key: 'info',
      value: false
    }
  ]
})
// 查看卡片详情
const handleCardInfo = (item: any) => {
  state.dialogShow.map((el: { value: boolean; key: string; sendData?: any }) => {
    if (el.key == 'info') {
      el.value = true
      el.sendData = item
    }
  })
}
const closeDialog = (val: string) => {
  state.dialogShow.map((el: { value: boolean; key: string }) => {
    if (el.key == val) {
      el.value = false
    }
  })
}

//查询
const getTableList = async () => {
  pageStore.tableData = []
  await $services.market
    .searchStaging({
      data: {
        id: 0, //市场id （需删除）
        offset: (pagination.current - 1) * pagination.limit,
        limit: pagination.limit,
        filter: ''
      }
    })
    .then((res: ResultType) => {
      var { result = [], total = 0 } = res.data
      pageStore.total = total
      result.forEach((item: any) => {
        item.ordertype = 'sell'
        item.checked = false
        return item
      })
      pageStore.tableData = result?.map(
        (item: {
          market: { remark: any; code: any; name: any }
          merchandise: { caption: any; information: any; sellAuth: any; days: any; price: any }
        }) => {
          if (!item.merchandise) { item.merchandise = { caption: null, information: null, sellAuth: null, days: null, price: null } }
          return {
            ...item,
            caption: item.merchandise.caption,
            information: item.merchandise.information,
            sellAuth: item.merchandise.sellAuth,
            days: item.merchandise.days,
            price: item.merchandise.price,
            marketName: item.market.name,
            marketCode: item.market.code
          }
        }
      )

      console.log('pageStore.tableData', pageStore.tableData)
      // isRouterAlive.value = true
    })
}
const gotoApp = (item: { id: string }) => {
  router.push({ path: '/market/MarketList', query: { data: item.id } })
}

const handleSelect = (e: any[], row: any) => {
  var ids = e.map((item) => item.id)
  for (let item of pageStore.tableData) {
    item.checked = false
    if (ids.includes(item.id)) {
      item.checked = true
    }
  }
  console.log(pageStore.tableData)
}

//切换视图
const changeView = (e: any) => {
  //清空选中状态
  pageStore.tableData.forEach((item: { checked: boolean }) => {
    item.checked = false
    return item
  })
}

const checkAll = (e: any) => {
  allchecked.checked = e
  console.log(allchecked.checked)
  pageStore.tableData.forEach((item: { checked: boolean }) => {
    item.checked = allchecked.checked
    return item
  })
  console.log(pageStore.tableData)
}
// 处理表格分页操作
const handlePaginationChange = (newVal: number, type: 'current' | 'limit') => {
  pagination[type] = newVal
  getTableList()
}

function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

//创建订单(批量)
const createOrderByStaging = async (checkedId?: string) => {
  var checkedStagIds: any[] = []
  if (checkedId) {
    checkedStagIds = [checkedId]
  } else {
    checkedStagIds = pageStore.tableData.filter((item: any) => item.checked).map((item: any) => item.id)
  }
  console.log(checkedStagIds)
  if (checkedStagIds.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }
  var checkedStages = pageStore.tableData.filter((item: any) => checkedStagIds.includes(item.id))
  ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    setTimeout(
      async (ids) => {
        await $services.market
          .createOrderByStaging({
            data: {
              code: new Date().getTime().toString().substring(0, 13),
              name:
                checkedStages[0].merchandise.caption +
                (checkedStages.length > 1 ? `...等${checkedStages.length}件商品` : ''),
              stagIds: checkedStagIds
            }
          })
          .then((res: ResultType) => {
            if (res.code == 200) {
              getTableList()
              ElMessage({
                message: '创建订单成功',
                type: 'success'
              })
            }
          })
      },
      1,
      checkedStagIds
    )
  }).catch(()=>{})
}

//从购物车移除 (批量)
const deleteStagings = () => {
  //检查数据
  var checkedRecords = pageStore.tableData.filter((item: any) => item.checked)
  if (checkedRecords.length <= 0) {
    ElMessage({
      message: '请选择商品',
      type: 'warning'
    })
    return
  }
  //要改为并发删除
  for (let item of pageStore.tableData) {
    if (item.checked) {
      $services.market
        .deleteStaging({
          data: {
            id: item.id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            getTableList()
            ElMessage({
              message: '移除成功',
              type: 'warning'
            })
          }
        })
    }
  }
}
//从购物车移除
const deleteStaging = async (id: string) => {
  console.log(id)
  await $services.market
    .deleteStaging({
      data: {
        id: id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        getTableList()
        ElMessage({
          message: '移除成功',
          type: 'warning'
        })
      }
    })
}
//配置表头背景
const getRowClass = ({
  row,
  column,
  rowIndex,
  columnIndex
}: {
  row: any
  column: any
  rowIndex: number
  columnIndex: number
}) => {
  if (rowIndex === 0) {
    return {
      background: '#F5F6FC',
      color: '#333333',
      height: '36px',
      padding: '2px 0'
    }
  } else {
    return {}
  }
}
//改变购物车商品数量
const numChange = async (item: any) => {
  console.log(item)
  ElMessage({
    message: '该功能尚未开放',
    type: 'warning'
  })
  return
  loading.value = true
  await $services.market
    .updateStaging({
      data: {
        id: item.id,
        number: item.number
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        loading.value = false
      }
    })
  loading.value = false
}
//选中/取消选中
const checkedChange = (item: any) => {
  console.log(item.checked)
  item.checked = !item.checked
}
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 100%;
  display: block;
}

.main-content {
  width: 100%;
  height: 95%;
  overflow-y: auto;
  top: 60px;
  position: absolute;
}

/* .top_1 {
  display: inline-block;
  margin-right: 10px;
} */
/* .top {
  display: inline-block;
  height: 100%;
  margin-right: 10px;
} */

.group-side-bar-search {
  padding: 6px;
  float: right;
  width: 300px;
  margin-right: 20px;
  position: relative;
}

.header {
  height: 60px;
  /*设定footer高度*/
  position: absolute;
  /*设定footer绝对位置在底部*/
  top: 0;
  width: 100%;
  /*展开footer宽度*/
  /* line-height: 60px; */
}

.footer {
  height: 60px;
  /*设定footer高度*/
  position: absolute;
  /*设定footer绝对位置在底部*/
  bottom: 0;
  width: 100%;
  /*展开footer宽度*/
  background-color: gray;
  line-height: 60px;
}

.send-box {
  justify-content: flex-end;
  text-align: center;
  margin-left: 30px;
}

.page-pagination {
  bottom: 20px;
  position: fixed;
  right: 20px;
}

.table-row-sty {
  height: calc(100vh - 12rem);
}

.app-con-title {
  // color: #000000d9;
  // font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.app-con-info {
  font-size: 13px;
  // font-weight: 400;
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.app-card-item-con-belong {
  // margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
  display: flex;
  justify-content: space-between;
}


// :deep(.diy-button-pos) {
//   display: flex;
//   justify-content: left;
// }
.diy-button {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    // background: rgba(235, 238, 245, 1);
    border-radius: 4px;
  }
}

.button {
  margin-left: 20px;
}

.shopcar-content {
  padding-left: 6px;
  padding-top: 6px;
 
}

.box {

  // .box-ul + .box-ul {
  //   margin-top: 10px;
  // }
  &-ul {
    position: relative;
    background-color: var(--el-bg-color-overlay);
    height: calc(100vh - 12rem);
    padding: 20px;

    &-title {
      font-weight: bold;
      padding-bottom: 10px;

    }

    .app-card {
      display: flex;
      flex-wrap: wrap;

      .bule-shadow {
        box-shadow: none; // 0px 0px 4px rgb(0, 89, 255, 0.7);
        border-color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-9);

        &::before {
          content: '';

          position: absolute;
          left: 0;
          top: 0;
          display: block;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary) 50%, transparent 50%, transparent 100%);
        }
      }


      .dark-shadow {
        // box-shadow: 4px 4px 4px rgb(174, 177, 184);
      }
    }
  }
}
</style>
