<template>
  <div class="managerApproval">
    <MarketCard> </MarketCard>
    <div class="tabList">
      <DiyTable ref="diyTable" :hasTitle="false" :tableData="state.data" :tableHead="state.tableHead"
        @handleUpdate="handleUpdate">
        <template #operate="scope">
          <el-button link type="primary" @click="showOrderList(scope.row.id)">查看售卖详情</el-button>
          <el-button link type="primary" @click="unpublishFun(scope.row)">下架</el-button>
        </template>
      </DiyTable>
    </div>

    <el-dialog width="70%" v-model="orderListDialog.show" append-to-body :before-close="closeDialog" :title="'售卖详情'">
      <DiyTable :style="{ height: 500 + 'px', width: '100%' }" ref="diyTable2" :hasTitle="false"
        :tableData="dialogState.data" :tableHead="dialogState.tableHead" @handleUpdate="dialogHandleUpdate">
      </DiyTable>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import $services from '@/services'
import { onMounted, reactive, ref } from 'vue'
import MarketCard from '@/components/marketCard/index.vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import DiyTable from '@/components/diyTable/index.vue'
import { chat } from '@/module/chat/orgchat'
import { appstore } from '@/module/store/app'
const router = useRouter()
const route = useRoute()
const diyTable = ref(null)
const product = ref(null)
const dialogState = reactive({
  data: [],
  tableHead: [

    {
      prop: 'order.code',
      label: '订单号'
    },
    {
      prop: 'caption',
      label: '名称'
    },
    {
      prop: 'belongId',
      label: '买方名称',
      formatter: (row: any, column: any) => chat.getName(row.belongId)
    },
    {
      prop: 'sellAuth',
      label: '售卖权属'
    },
    {
      prop: 'days',
      label: '使用期限'
    },
    {
      prop: 'price',
      label: '售卖价格'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      minWidth: '120'
    },
  ],
  currentPage: 1,
  pageSize: 20,
  total: 0
})
const state = reactive({
  data: [],
  tableHead: [
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
      prop: 'marketName',
      label: '市场名称'
    },
    {
      prop: 'marketCode',
      label: '市场编号'
    },
    {
      prop: 'sellAuth',
      label: '售卖权属'
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
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      width: '250',
      name: 'operate'
    }
  ]
})
const page = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})
const handleUpdate = (page: any) => {
  page.currentPage = page.currentPage
  page.pageSize = page.pageSize
  getTableList()
}
const dialogHandleUpdate = (page: any) => {
  dialogState.currentPage = page.currentPage
  dialogState.pageSize = page.pageSize
  // getDialogTableList()
}
onMounted(() => {
  getTableList()
})

const orderListDialog = reactive({ show: false, data: {} })
const closeDialog = () => {
  orderListDialog.show = false
}

const getDialogTableList = async (id: string) => {
  const res = await appstore.searchMerchandiseSellList(id, page)
  const { result = [], total = 0 } = res
  dialogState.data = result?.map((item: any) => {
    if (!item.order) {
      item.order = {}
    }
    return {
      ...item,
      code: item.order.code,
      belongId: item.order.belongId
    }
  })
  dialogState.total = total
}
const showOrderList = (id: string) => {
  orderListDialog.show = true
  getDialogTableList(id)
}
const unpublishFun = (item: any) => {
  let title: string
  title = `确定把 ${item.caption} 下架吗？`
  ElMessageBox.confirm(title, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      unpublishApp(item)
    })
    .catch(() => { })
}
//下架应用-应用所有者
const unpublishApp = async (item: any) => {
  console.log(item)
  if (item) {
    await appstore.unpublishApp(item.id)
    getTableList()
  }
}
//查询上架申请
const getTableList = async () => {
  state.data = []
  product.value = await appstore.queryInfo(route.query.id.toString())
  const { result = [], total = 0 } = await appstore.searchPublishList(
    route.query.id.toString(),
    page
  )
  state.data = result?.map((item: any) => {
    return {
      ...item,
      productCode: product.value.code,
      productName: product.value.name,
      productSource: product.value.source,
      productAuthority: product.value.authority,
      productTypeName: product.value.typeName,
      marketName: item.market.name,
      marketCode: item.market.code
    }
  })
  page.total = total
  diyTable.value.state.loading = false
  diyTable.value.state.page.total = page.total
}
</script>

<style lang="scss" scoped>
.managerApproval {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color);

  .tabList {
    width: 100%;
    height: calc(100vh - 130px);
    padding-left: 6px;
    padding-top: 6px;
  }
}
</style>
