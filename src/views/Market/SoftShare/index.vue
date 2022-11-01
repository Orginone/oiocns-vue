<template>
  <MarketCard>
    <template #right>
      <el-space :size="16">
        <el-button type="primary" link @click.stop="GoPage('/market/order/buy')"
          >采购订单</el-button
        >
        <el-button type="primary" link @click.stop="GoPage('/market/order/sell')"
          >售卖订单</el-button
        >
        <el-badge :value="shopcarNum" v-if="shopcarNum > 0">
          <el-button type="primary" link @click.stop="GoPage('/market/shopCar')">购物车</el-button>
        </el-badge>
        <el-radio-group v-model="modeType" size="small" class="button">
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
      </el-space>
    </template>
  </MarketCard>
  <el-card class="getApp">
    <div class="getApp-container">
      <div class="getApp-search-box">
        <el-input v-model="searchVal" placeholder="应用名称/编码" class="search-input"> </el-input>
        <el-button type="primary" @click="searchList">搜一下</el-button>
      </div>
      <div class="getApp-content">
        <AppCard
          v-if="modeType === 'card'"
          ref="appCard"
          :dataList="state.myAppList"
          type="shop"
          @handleUpdate="handleUpdate"
          @shopcarNumChange="getShopcarNum"
        ></AppCard>

        <Pagination
          v-if="modeType === 'card'"
          ref="pageContent"
          @handleUpdate="handleUpdate"
        ></Pagination>
        <DiyTable
          v-else
          ref="diyTable"
          :hasTitle="true"
          :tableData="state.myAppList"
          :tableHead="tableHead"
          @handleUpdate="handleUpdate"
        >
          <template #operate="scope">
            <!-- <el-button
              link
              type="primary"
              @click="GoPageWithQuery('/market/merchandiseDetail', { data: scope.row.id })"
              >商品详情</el-button
            > -->

            <el-button link type="primary" @click="joinShopCar(scope.row.id)">加入购物车</el-button>
            <el-button link type="primary" @click="requireItem">下单</el-button>
          </template>
        </DiyTable>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { reactive, onMounted, ref, watch, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import $services from '@/services'
  import AppCard from '../MarketList/components/appCard.vue'
  import DiyTable from '@/components/diyTable/index.vue'
  import TheTableButton from '../MarketList/components/theTableButton2.vue'
  import MarketCard from '@/components/marketCard/index.vue'
  import Pagination from '@/components/pagination/index.vue'
  import { ElMessage } from 'element-plus'
  import { appstore } from '@/module/store/app'
  const modeType = ref<'card' | 'list'>('card')
  const router = useRouter()
  const diyTable = ref(null)
  const appCard = ref(null)
  const shopcarNum = ref(0)
  const pageContent = ref(null)
  const GoPageWithQuery = (path: string, query: any) => {
    router.push({ path, query })
  }
  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  // 软件开放市场信息
  const softShareInfo = ref<MarketType>({} as MarketType)

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
      width: '300',
      name: 'operate'
    }
  ]
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getAppList()
  }
  const searchList = () => {
    pageStore.currentPage = 1
    getAppList()
  }
  onMounted(() => {
    getMarketInfo()
    getShopcarNum()
  })
  //加入购物车
  const joinShopCar = async (id: any) => {
    await appstore.staging(id)
    getAppList()
  }
  const requireItem = () => {}
  // 获取购物车数量
  const getShopcarNum = async () => {
    shopcarNum.value = await appstore.getShopcarNum()
  }

  // 搜索功能-关键词
  const searchVal = ref<string>('') // 搜索关键词

  // 获取应用列表
  const getAppList: (goFirst?: boolean) => void = async (goFirst = true) => {
    const { result = [], total = 0 } = await appstore.merchandise(
      softShareInfo.value.id,
      pageStore,
      searchVal.value
    )
    state.myAppList = result || []
    appCard.value.state.page.total = total
    pageContent.value.state.page.total = total
  }

  // 获取共享仓库信息
  const getMarketInfo = async () => {
    softShareInfo.value = await appstore.getMarketInfo()
    getAppList()
  }

  const GoPage = (path: string) => {
    router.push(path)
  }

  watch(modeType, (val, valOld) => {
    // 监听 展示方式变化
    nextTick(() => {
      appCard.value.state.page.currentPage = 1
      getAppList()
    })
  })
</script>
<style lang="scss" scoped>
  .getApp {
    // width: 100%;
    height: calc(100vh - 110px);
    border: 0;
    padding: 6px;

    // &-radio {
    //   display: flex;
    //   align-items: center;
    //   position: absolute;
    //   left: 16px;
    //   bottom: 0px;
    // }
    :deep(.el-card__body) {
      height: 100%;
    }

    &-container {
      position: relative;
      width: 100%;
      height: calc(100%);
      background-color: var(--el-bg-color-overlay);
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    &-content {
      width: 100%;
      flex: 1;
      // padding: 0 24px;
    }

    &-search-box {
      display: flex;
      justify-content: center;
      width: 600px;
      margin: 14px auto;

      :deep(.el-input__wrapper) {
        background-color: var(--el-color-primary-light-9);
        box-shadow: none;
        border: 1px solid var(--el-input-focus-border-color);
        border-radius: 0;
      }

      :deep(.el-button) {
        border-radius: 0;
        height: 34px;
      }
    }
  }
</style>
