<template>
  <MarketCard>
    <template #right>
      <el-button small link type="primary" @click="GoPage('/market/managerApply')"
        >加入商店审批</el-button
      >
      <el-button small link type="primary" @click="friendShow">邀请加入商店</el-button>
    </template>
  </MarketCard>
  <div class="userLayout">
    <DiyTable
      ref="diyTable"
      :tableName="tableName"
      :tableData="state.tableData"
      :tableHead="state.tableHead"
      @handleUpdate="handleUpdate"
    >
      <template #unit="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
      <template #groupCode="scope">
        <div>{{ scope.row.groupName }}</div>
      </template>
      <template #operate="scope">
        <el-button link type="danger" @click="personDel(scope.row.id)">移出</el-button>
      </template>
    </DiyTable>
  </div>
  <searchFriend
    v-if="searchDialog"
    @closeDialog="closeDialog"
    :serachType="searchType"
    @checksSearch="checksSearch"
  />
</template>

<script setup lang="ts">
  import DiyTable from '@/components/diyTable/index.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'
  import searchFriend from '@/components/searchs/index.vue'
  import TheTableButton from './components/theTableButton.vue'
  import { useUserStore } from '@/store/user'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const store = useUserStore()
  const searchDialog = ref<boolean>(false)
  const friendShow = () => {
    searchDialog.value = true
  }
  const closeDialog = () => {
    searchDialog.value = false
  }
  type arrList = {
    id: string
  }
  const searchType = ref<number>()
  const judgeWorkSpace = () => {
    if (store.workspaceData.type === 1) {
      searchType.value = 1
    }
    if (store.workspaceData.type === 2) {
      searchType.value = 3
    }
  }
  onMounted(() => {
    judgeWorkSpace()
  })
  const GoPage = (path: string) => {
    router.push({ path: path, query: { marketId: route.query.data } })
  }
  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<arrList> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      console.log(arr);

      addFriends(arr)
    } else {
      searchDialog.value = false
    }
  }
  //删除人员
  const personDel = (id: any) => {
    $services.appstore
      .removeMemver({
        data: {
          id: id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '移出成功',
            type: 'success'
          })
          getData()
        }
      })
  }
  const addFriends = (arr: Array<arrList>) => {
    console.log('arrr', arr)
    $services.appstore
      .pullTarget({
        data: {
          targetIds: arr,
          marketId: route.query.data
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '申请成功',
            type: 'success'
          })
          getData()
          searchDialog.value = false
        }
      })
  }
  const route = useRoute()
  const diyTable = ref(null)
  const tableName = ref('成员列表')
  const state = reactive({
    tableData: [],
    tableHead: [
      {
        prop: 'target.typeName',
        label: '类型'
      },
      {
        prop: 'target.code',
        label: '编码'
      },
      {
        prop: 'target.name',
        label: '名称'
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
        width: '100',
        name: 'operate'
      }
    ]
  })

  onMounted(() => {
    getData()
  })

  type page = {
    currentPage: number
    layout: string
    pageSize: number
    pageSizes: Array<number>
    total: number
  }

  const handleUpdate = (val: page) => {
    getData()
  }

  const getData = () => {
    $services.appstore
      .member({
        data: {
          id: route.query.data,
          offset: diyTable.value.state.page.current,
          limit: diyTable.value.state.page.pageSize,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.tableData = res.data.result
          diyTable.value.state.page.total = res.data.total
        }
      })
  }
</script>

<style lang="scss" scoped>
  .userLayout {
    padding: 10px;
    width: 100%;
    height: calc(100vh - 60px);
    // background-color: #fff;
  }
</style>
