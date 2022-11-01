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
        <template #operate="scope"> </template>
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
    state.currentPage = page.currentPage
    state.pageSize = page.pageSize
    starterAppApprovalList()
  }
  onMounted(() => {
    store.SearchAllMarket()
    starterAppApprovalList()
  })

  //查询上架申请
  const starterAppApprovalList = async () => {
    await $services.appstore
      .searchPublishApply({
        data: {
          offset: (state.currentPage - 1) * state.pageSize,
          limit: state.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(store.marketMap)

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
    // background-color: var(--el-bg-color);
    .tabList {
      width: 100%;
      height: calc(100vh - 120px);
      padding: 6px 6px 0;
    }
  }
</style>
