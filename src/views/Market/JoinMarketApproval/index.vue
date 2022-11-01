<template>
  <div class="managerApproval">
    <MarketCard> </MarketCard>
    <div class="tabList">
      <DiyTable
        ref="diyTable"
        :hasTitle="false"
        :hasTabs="true"
        :hasTableHead="true"
        :tableData="state.approvalList"
        :tableHead="state.tableHead"
      >
        <template #slot-tabs>
          <el-tabs v-model="activeName" style="width: 100%" @tabClick="handleClick">
            <el-tab-pane label="加入市场申请" name="first"> </el-tab-pane>
            <el-tab-pane label="应用上架申请" name="second"> </el-tab-pane>
            <el-tab-pane label="加入市场审批" name="third"> </el-tab-pane>
            <el-tab-pane label="应用上架审批" name="four"> </el-tab-pane>
          </el-tabs>
        </template>
        <template #operate="scope">
          <el-button v-if="activeName === 'first'" @click="cancelApply(scope.row.id)" type="primary"
            >取消申请</el-button
          >
          <el-button
            v-if="activeName === 'third'"
            @click="approvalSuccess(scope.row.id, 100)"
            type="primary"
            >审批通过</el-button
          >
          <el-button
            v-if="activeName === 'third'"
            @click="approvalSuccess(scope.row.id, 200)"
            type="danger"
            >驳回申请</el-button
          >
          <el-button
            v-if="activeName === 'four'"
            @click="LastSuccess(scope.row.id, 100)"
            type="primary"
            >审批通过</el-button
          >
          <el-button
            v-if="activeName === 'four'"
            @click="LastSuccess(scope.row.id, 200)"
            type="danger"
            >驳回申请</el-button
          >
        </template>
      </DiyTable>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { onMounted, reactive, ref } from 'vue'
  import MarketCard from '@/components/marketCard/index.vue'
  import type { TabsPaneContext } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import DiyTable from '@/components/diyTable/index.vue'
  import { useMarketStore } from '@/store/market'
  const store = useMarketStore()
  const diyTable = ref(null)
  const activeName = ref('first')
  const handleClick = (tab: TabsPaneContext, event: any) => {
    if (tab.index === '0') {
      activeName.value = 'first'
      searchApplyList()
    }
    if (tab.index === '1') {
      activeName.value = 'second'
      starterAppApprovalList()
    }
    if (tab.index === '2') {
      activeName.value = 'third'
      searchApprovalList()
    }
    if (tab.index === '3') {
      activeName.value = 'four'
      searchAppApprovalList()
    }
  }
  const state = reactive({
    approvalList: [],
    tableHead: []
  })

  onMounted(() => {
    store.SearchAllMarket()
    searchApplyList()
  })
  //审批加入市场
  const approvalSuccess = async (index: number, status: number) => {
    await $services.appstore
      .approvalJoin({
        data: {
          id: index,
          status: status
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '审批完成',
            type: 'success'
          })
          searchApprovalList()
        }
      })
  }
  //查询加入市场申请
  const searchApprovalList = async () => {
    await $services.appstore
      .searchJoinApplyManager({
        data: {
          offset: 0,
          limit: 10,

          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          const { result = [], total = 0 } = res.data
          state.approvalList = []
          state.approvalList = result?.map(
            (item: {
              market: { name: any }
              target: { name: any; code: any; createTime: any }
            }) => {
              return {
                ...item,
                createTime: item.target.createTime,
                targetCode: item.target.code,
                targetName: item.target.name,
                marketName: item.market.name
              }
            }
          )
          state.tableHead = [
            {
              prop: 'marketName',
              label: '市场名称'
            },
            {
              prop: 'targetName',
              label: '申请人昵称'
            },
            {
              prop: 'targetCode',
              label: '申请人账号'
            },
            {
              prop: 'createTime',
              label: '创建时间'
            },
            {
              type: 'slot',
              label: '操作',
              fixed: 'right',
              align: 'center',
              width: '400',
              name: 'operate'
            }
          ]
        }
      })
  }
  //取消申请
  const cancelApply = async (index: number) => {
    await $services.appstore
      .cancelJoin({
        data: {
          id: index
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '取消申请成功',
            type: 'success'
          })
          searchApplyList()
        }
      })
  }
  //查询加入市场申请
  const searchApplyList = async () => {
    await $services.appstore
      .searchJoinApply({
        data: {
          offset: 0,
          limit: 10,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          const { result = [], total = 0 } = res.data
          state.approvalList = []
          state.approvalList = result?.map((item: { market: { name: any; code: any } }) => {
            return {
              ...item,

              marketCode: item.market.code,

              marketName: item.market.name
            }
          })
          state.tableHead = [
            {
              prop: 'marketName',
              label: '市场名称'
            },

            {
              prop: 'marketCode',
              label: '市场编码'
            },
            {
              prop: 'createTime',
              label: '创建时间'
            },
            {
              type: 'slot',
              label: '操作',
              fixed: 'right',
              align: 'center',
              width: '400',
              name: 'operate'
            }
          ]
        }
      })
  }
  //上架审批成功
  const LastSuccess = async (index: number, status: number) => {
    await $services.appstore
      .approvalPublish({
        data: {
          id: index,
          status: status
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '审批完成',
            type: 'success'
          })
          searchAppApprovalList()
        }
      })
  }
  //查询应用上架审批
  const searchAppApprovalList = async () => {
    await $services.appstore
      .searchManagerPublishApply({
        data: {
          offset: 0,
          limit: 10,

          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          const { result = [], total = 0 } = res.data
          state.approvalList = []
          state.approvalList = result?.map(
            (item: {
              marketId: any
              product: { name: any; code: any; source: any; authority: any; typeName: any }
            }) => {
              console.log(store.marketMap.get(item.marketId))
              return {
                ...item,
                marketName: store.marketMap.get(item.marketId),
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
              prop: 'marketName',
              label: '市场名称'
            },
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
            },
            {
              type: 'slot',
              label: '操作',
              fixed: 'right',
              align: 'center',
              width: '400',
              name: 'operate'
            }
          ]
        }
      })
  }
  //发起者查询上架申请
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
          state.approvalList = []
          state.approvalList = result?.map(
            (item: {
              marketId: any
              product: { name: any; code: any; source: any; authority: any; typeName: any }
            }) => {
              return {
                ...item,
                marketName: store.marketMap.get(item.marketId),
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
              prop: 'marketName',
              label: '市场名称'
            },
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
      padding-left: 6px;
    }
  }
</style>
