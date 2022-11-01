<template>
  <div class="managerApproval">
    <MarketCard> </MarketCard>
    <div class="tabList">
      <DiyTable
        ref="diyTable"
        :hasTitle="false"
        :tableData="state.approvalList"
        :tableHead="state.tableHead"
        @handleUpdate="handleUpdate"
      >
        <template #operate="scope">
          <el-button link @click="approvalSuccess(scope.row.id, 100)" type="primary"
            >审批通过</el-button
          >
          <el-button link @click="approvalSuccess(scope.row.id, 200)" type="danger"
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

  import { ElMessage } from 'element-plus'
  import DiyTable from '@/components/diyTable/index.vue'
  import { useMarketStore } from '@/store/market'
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  const store = useMarketStore()

  const diyTable = ref(null)
  const state = reactive({
    approvalList: [],
    tableHead: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const handleUpdate = (page: any) => {
    state.currentPage = page.current
    state.pageSize = page.pageSize
    searchApprovalList()
  }
  onMounted(() => {
    store.SearchAllMarket()
    searchApprovalList()
  })
  const approvalSuccess = async (index: number, status: number) => {
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
          searchApprovalList()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  //查询应用上架申请
  const searchApprovalList = async () => {
    console.log('state.currentPag',state)
    await $services.appstore
      .searchManagerPublishApply({
        data: {
          offset: state.currentPage,
          limit: state.pageSize,

          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          const { result = [] } = res.data
          state.approvalList = []
          let total = 0
          result?.forEach(
            (item: {
              marketId: any
              product: { name: any; code: any; source: any; authority: any; typeName: any }
            }) => {
              if (item.marketId === route.query.marketId) {
                total = total + 1

                console.log(item.marketId)
                state.approvalList.push({
                  ...item,
                  marketName: store.marketMap.get(item.marketId),
                  productCode: item.product.code,
                  productName: item.product.name,
                  productSource: item.product.source,
                  productAuthority: item.product.authority,
                  productTypeName: item.product.typeName
                })
              }
            }
          )
          state.total = total
          diyTable.value.state.loading = false
          diyTable.value.state.page.total = state.total
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
              width: '200',
              name: 'operate'
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

    .tabList {
      width: 100%;
      height: calc(100vh - 130px);
      padding: 6px 6px 0;
    }
  }
</style>
