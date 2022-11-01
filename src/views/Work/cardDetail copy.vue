<template>
  <div class="thing">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      style="height: 60px; padding-left: 20px"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">我的审批</el-menu-item>
      <el-menu-item index="2">我的申请</el-menu-item>
      <!--  <el-menu-item index="1">待办</el-menu-item>
      <el-menu-item index="2">已办</el-menu-item>
      <el-menu-item index="3">已完成</el-menu-item>
      <el-menu-item index="4">我发起的</el-menu-item>
      <el-menu-item index="5">已逾期</el-menu-item> -->
    </el-menu>
    <div class="content">
      <!-- <div class="search">
        <el-input class="input" v-model="input" placeholder="Please input" />
        <div class="edit">
          <el-button type="primary" color="#153ec9">新建代办</el-button>
          <el-button>拒绝代办</el-button>
          <el-button>完成代办</el-button>
        </div>
      </div> -->
      <div class="tab-list">
        <DiyTable
          class="diytable"
          ref="diyTable"
          :hasTableHead="false"
          :tableData="tableData"
          :tableHead="tableHead"
        >
          <template #content="scope">
            {{ scope.row.target.name }}申请加入{{ scope.row.team.name }}
          </template>
          <template #status="scope">
            <div v-if="scope.row.status >= 0 && scope.row.status < 100">待批</div>
            <div v-else-if="scope.row.status >= 100 && scope.row.status < 200">已通过</div>
            <div v-else>已拒绝</div>
          </template>
          <template #option="scope">
            <div v-if="activeIndex == '1'">
              <el-button
                link
                type="primary"
                style="margin-right: 10px"
                @click="joinSuccess(scope.row)"
                >通过</el-button
              >
              <el-button link type="warning" @click="joinRefse(scope.row)">拒绝</el-button>
            </div>
            <div v-else>
              <el-button link type="warning" @click="cancelJoin(scope.row)">取消申请</el-button>
            </div>
          </template>
        </DiyTable>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, onMounted, reactive } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/store/user'
  import { useRouter } from 'vue-router'
  import DiyTable from '@/components/diyTable/index.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  var tableData = ref<any>([])
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  const activeIndex = ref<string>('1')
  const activeId = ref<string>('0')
  var getList = () => {
    $services.person.getAllApproval({
        data: {
          id: activeId.value,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize
        }
      })
      .then((res: ResultType) => {
        if(res.success){
          tableData.value = res.data.result
          diyTable.value.state.page.total = res.data.total
        }
      })
  }
  var getApplyList = () => {
    $services.person.getAllApply({
        data: {
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize
        }
      })
      .then((res: ResultType) => {
        if(res.success){
          tableData.value = res.data.result
          diyTable.value.state.page.total = res.data.total
        }
      })
  }
  const tableHead = ref([
    {
      prop: 'target.name',
      label: '申请人',
      name: 'target.name'
    },
    {
      type: 'slot',
      prop: 'content',
      label: '内容',
      name: 'content'
    },
    {
      type: 'slot',
      prop: 'status',
      label: '状态',
      name: 'status'
    },
    {
      prop: 'target.updateTime',
      label: '发送时间',
      name: 'target.updateTime'
    },
    {
      type: 'slot',
      prop: 'option',
      label: '操作',
      name: 'option'
    }
  ])
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    handleSelect(activeIndex.value, [])
  }

  var joinRefse = (item: { id: '' }) => {
    ElMessageBox.confirm('确定拒绝吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      $services.person
        .joinRefuse({
          data: {
            id: item.id
          }
        })
        .then((res: ResultType) => {
          ElMessage({
            message: '拒绝成功',
            type: 'success'
          })
          handleSelect(activeIndex.value, [])
        })
    })
  }
  var cancelJoin = (item: { id: '' }) => {
    ElMessageBox.confirm('确定取消吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      $services.person
        .cancelJoin({
          data: {
            id: item.id
          }
        })
        .then((res: ResultType) => {
          ElMessage({
            message: '取消成功',
            type: 'success'
          })
          handleSelect(activeIndex.value, [])
        })
    })
  }
  var joinSuccess = (item: { id: '' }) => {
    ElMessageBox.confirm('确定通过吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      $services.person
        .joinSuccess({
          data: {
            id: item.id
          }
        })
        .then((res: ResultType) => {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
          handleSelect(activeIndex.value, [])
        })
    })
  }
  const handleSelect = (key: any, keyPath: string[]) => {
    tableData.value = []
    diyTable.value.state.page.total = 0
    activeIndex.value = key
    if (key === '1') {
      getList()
    } else {
      getApplyList()
    }
  }
  onMounted(() => {
    const route = useRouter()
    const selectType = route.currentRoute.value.query.type
    let id = route.currentRoute.value.query.id
    if(Array.isArray(id)){
      activeId.value = id[0]
    }else{
      activeId.value = id
    }
    handleSelect(selectType, [])
  })

  var filterHandler = () => {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .thing {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 0;
  }
  .thing-head {
    padding: 30px;
    // background: #fff;
    .thing-type {
      font-size: 16px;
      color: #8d8d8d;
      margin-bottom: 15px;
    }
    .thing-mian {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      display: flex;
      justify-content: space-between;
    }
  }
  .content {
    height: calc(100% - 60px);
    padding: 20px;
    background: var(--el-bg-color-overlay);
    .search {
      background: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .input {
        width: 200px;
      }
      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }
    .tab-list {
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      
      background: var(--el-bg-color-overlay);
      span {
        cursor: pointer;
      }
    }
    .page {
      background: #fff;
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-right: 20px;
    }
  }
</style>
