<template>
  <MarketCard>
    <template #right>
      <el-button small link type="primary" @click="GoPage('/market/appShelvesApproval')"
        >应用上架审批</el-button
      >
      <el-radio-group v-model="switchValue" size="small" class="button">
        <el-radio-button label="list"
          ><el-icon :size="18"><Tickets /></el-icon
        ></el-radio-button>
        <el-radio-button label="card"
          ><el-icon :size="18"><Menu /></el-icon
        ></el-radio-button>
      </el-radio-group>
    </template>
  </MarketCard>
  <div class="appListLayout">
    <div class="appListLayout-container">
      <div class="appListLayout-header">
        <p>应用列表</p>
        <div class="search">
          <el-input v-model="searchText" @input="searchList" placeholder="搜索应用" clearable />
        </div>
      </div>
      <div class="appListLayout-content">
        <AppCard
          v-if="switchValue=='card'"
          ref="appCard"
          :dataList="state.myAppList"
          :type="route.query.type"
          @handleUpdate="getData()"
        ></AppCard>
        <div class="page-flex" v-show="switchValue === 'card'">
          <Pagination ref="pageContent" @handleUpdate="handleUpdate"></Pagination>
        </div>
        <DiyTable
          v-show="switchValue!='card'"
          ref="diyTable"
          :hasTitle="true"
          :tableData="state.myAppList"
          :tableHead="state.tableHead"
          @handleUpdate="handleUpdate"
        >
          <template #operate="scope">

            <TheTableButton :data="scope.row" @update="getData"></TheTableButton>
            <!-- <div class="diy-button" @click="joinStaging(scope.row)"> 加入购物车 </div>
            <div class="diy-button"  @click="buyThings(scope.row)"> 购买 </div>
            <div class="diy-button" @click="unpublishFun(scope.row)"> 下架 </div> -->
          </template>
        </DiyTable>
      </div>
      <!-- <div class="appListLayout-radio" v-if="state.myAppList.length > 0">
        <p style="margin-right: 20px">切换视图</p>
        <el-switch v-model="switchValue" />
      </div> -->
    </div>
  </div>

</template>

<script setup lang="ts">
  import { reactive, onMounted, ref, watch, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import $services from '@/services'
  import AppCard from './components/appCard.vue'
  import DiyTable from '@/components/diyTable/index.vue'
  import TheTableButton from './components/applicationListButton.vue'
  import MarketCard from '@/components/marketCard/index.vue'

  const router = useRouter()
  const route = useRoute()
  const diyTable = ref(null)
  const switchValue = ref('card')
  const appCard = ref(null)
  const shopcarNum = ref(0)
  const searchText = ref<string>('')
  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const pageContent = ref(null)

  const state = reactive({
    myAppList: [],
    tableHead: [
      {
        prop: 'caption',
        label: '应用名称'
      },
      {
        prop: 'sellAuth',
        label: '应用权限'
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
        label: '创建时间'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'center',
        width: '250',
        name: 'operate'
      }
    ],
    dialogShow: [
    {
      key: 'info',
      value: false
    }
  ]
  })

  watch(switchValue, (val) => {
    nextTick(() => {
      getData()
    })
  })

  onMounted(() => {
    getData()
  })

  const getShopcarNum = async () => {
    await $services.market
      .searchStaging({
        data: {
          id: 0, //市场id （需删除）
          offset: 0,
          limit: 20,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        var { result = [], total = 0 } = res.data
        shopcarNum.value = total
      })
  }
  // 表格切换页数
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getData()
  }
  const getData = () => {
    $services.appstore
      .merchandise({
        data: {
          id: route.query.data,
          offset: (pageStore.currentPage - 1) * pageStore.pageSize,
          limit: pageStore.pageSize,
          filter: searchText.value
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          state.myAppList = res.data.result || []
          diyTable.value.state.page.total = res.data.total || 0
          pageContent.value.state.page.total = res.data.total || 0
        }
      })
  }
  const GoPage = (path: string) => {
    router.push({ path: path, query: { marketId: route.query.data } })
  }
  const searchList = ()=>{
    getData()
  }


</script>

<style lang="scss" scoped>
  .button {
    margin-left:20px
  }

  .appListLayout {
    width: 100%;
    height: calc(100vh - 60px);
    padding: 6px;
    &-radio {
      display: flex;
      align-items: center;
      position: absolute;
      left: 6px;
      bottom: 0px;
    }
    &-container {
      position: relative;
      width: 100%;
      height: calc(100% - 60px);
      background-color: var(--el-bg-color-overlay);
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
    &-content {
      width: 100%;
      flex: 1;
      padding: 0 24px;
    }
    &-header {
      padding: 16px 24px 16px 24px;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      p {
        font-weight: 600;
        // color: rgba(0, 0, 0, 0.85);
      }
    }
  }
</style>
