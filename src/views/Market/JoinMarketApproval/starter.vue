<template>
  <div class="managerApproval">
    <MarketCard> </MarketCard>
    <div class="tabList">
      <DiyTable
        ref="diyTable"
        :hasTitle="false"
        :tableData="state.applyList"
        @handleUpdate="handleUpdate"
        :tableHead="state.tableHead"
      >
        <template #operate="scope">
          <el-button link @click="cancelApply(scope.row.id)" type="danger">取消申请</el-button>
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
  const diyTable = ref(null)
  const state = reactive({
    applyList: [],
    tableHead: [
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
        width: '200',
        name: 'operate'
      }
    ],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const handleUpdate = (page: any) => {
    state.currentPage = page.currentPage
    state.pageSize = page.pageSize
    searchApplyList()
  }
  onMounted(() => {
    searchApplyList()
  })
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
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  //查询加入市场申请
  const searchApplyList = async () => {
    await $services.appstore
      .searchJoinApply({
        data: {
          offset: (state.currentPage - 1) * state.pageSize,
          limit: state.pageSize,

          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log(res)
        if (res.success) {
          const { result = [], total = 0 } = res.data
          state.applyList = result?.map((item: { market: { name: any; code: any } }) => {
            return {
              ...item,

              marketCode: item.market.code,

              marketName: item.market.name
            }
          })
          state.total = total
          diyTable.value.state.loading = false
          diyTable.value.state.page.total = state.total
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
