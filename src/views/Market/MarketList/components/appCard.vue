<template>
  <div class="market-layout" style="height: calc(100% - 56px)">
    <div class="market-content box" style="height: 100%">
      <ul class="box-ul">
        <template v-if="dataList.length !== 0">
          <li class="app-card">
            <ShopCard v-for="item in dataList" :info="item.id" :key="item.id" 
            :cardContent="true"
            :class="{'dropdwon-active':item.id==state.dropDwonActiveId}"
            >
              <template #icon>
                <HeadImg :name="item.name" :url="item.icon || merchandiseImg" :imgWidth="48" :limit="1"
                  :isSquare="false" />
              </template>

              <template #content>
                <div class="shopCar-box">
                  <div class="app-con-title">{{ item.caption }} </div>
                  <!-- 附属标题区 -->
                  <div class="app-card-item-con-belong">
                    <span>归属: {{ chat.getName(item.product.belongId) || '未知' }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>版本： 0.0.1</span>
                  </div>
                  <div style="margin-top:12px;">
                    <div class="app-con-info">价格：
                      <span style="color: var(--el-color-warning)"> ￥ </span>
                      <strong style="color: var(--el-color-warning); font-size: 16px">{{
                      item.price || '0.00'
                      }}</strong>
                    </div>

                    <div class="app-con-info">
                      售卖权属：{{ item.sellAuth }}
                      <el-tag size="small" v-if="item.sellAuth !== '所属权' && item.days">
                        使用期：{{ item.days + '天'}}</el-tag>
                    </div>

                  </div>
                  <!-- <div class="app-con-info">上架时间：{{ item.createTime.substring(0, 11) }}</div> -->
                </div>
              </template>

              <template #option>
                <div class="option-unit">
                  <el-dropdown trigger="click" placement="top" @visible-change="(value:boolean)=> optionDropdownChange(value,item.id)">
                    <div class="option-unit">操作</div>
                    <!-- <el-icon :size="18">
                      <Operation />
                    </el-icon> -->
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="buyThings(item)"> 立即购买 </el-dropdown-item>
                        <!-- <el-dropdown-item @click="joinStaging(item)">加入购物车</el-dropdown-item> -->
                        <el-dropdown-item @click="handleCardInfo(item)">查看详情</el-dropdown-item>
                        <el-dropdown-item @click="unpublishFun(item)" v-if="type == 'manage'">下架</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="option-unit" @click="joinStaging(item)">
                  加入购物车
                </div>
              </template>

            </ShopCard>
          </li>
        </template>
        <div v-else>暂无数据</div>
      </ul>
    </div>
    <AppInfoDialog v-if="state.dialogShow[0].value" :dialogShow="state.dialogShow[0]" @closeDialog="closeDialog">
    </AppInfoDialog>
  </div>
  <!-- <template v-for="item in state.dialogShow" :key="item.key"> -->
  <!-- </template> -->
</template>

<script setup lang="ts">
import { reactive, computed, withDefaults } from 'vue'
import $services from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus'
import ShopCard from '../../components/shopCard.vue'
import AppInfoDialog from './appInfoDialog.vue'
import { ElNotification } from 'element-plus'
import merchandiseImg from '@/assets/img/app_icon.png'
import { useRouter } from 'vue-router'
import {chat} from '@/module/chat/orgchat'
const router = useRouter()
const emit = defineEmits(['handleUpdate', 'shopcarNumChange'])
type Props = {
  dataList: any
  type?: any
}
type AppType = {
  caption: string
  createTime: string
  createUser: string
  days: string
  id: string
  information: string
  marketId: string
  price: number
  productId: string
  sellAuth: string
  status: number
  updateTime: string
  updateUser: string
  version: string
}
const props = withDefaults(defineProps<Props>(), { dataList: [], type: 'manage' })
const handleCurrent: any = computed(() => {
  return (state.page.currentPage - 1) * state.page.pageSize
})

const state = reactive({
  dropDwonActiveId:'',
  page: {
    total: 0, // 总条数
    currentPage: 1, // 当前页
    current: handleCurrent,
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

//立即购买回调
const buyThings = (item: AppType) => {
  ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    
    setTimeout(async () => {
      await $services.order
        .create({
          data: {
            code: new Date().getTime().toString().substring(0, 13),
            name: item.caption,
            merchandiseId: item.id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            ElMessage({
              message: '创建订单成功',
              type: 'success'
            })
          }
        })
    }, 1)
  }).catch(()=>{})
}

const handleUpdate = (page: any) => {
  state.page.currentPage = page.currentPage
  state.page.pageSize = page.pageSize
}

const GoPage = (path: string) => {
  router.push(path)
}

const GoPageWithQuery = (path: string, query: any) => {
  router.push({ path, query })
}
// 下拉框显示隐藏时触发
// value 是否显示，activeId 当前显示 的卡片内容id
const optionDropdownChange = (value:boolean,activeId:string)=>{
  
  if(value) { //显示
    state.dropDwonActiveId = activeId
  }else{
    state.dropDwonActiveId = ''
  }
}
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

// 加入购物车
const joinStaging = async (item: any) => {
  // console.log(item)
  await $services.market
    .joinStaging({
      data: {
        id: item.id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        emit('shopcarNumChange')

        // ElMessage({
        //   message: '添加成功',
        //   type: 'success'
        // })
        ElNotification.success({
          title: '已加入购物车',
          offset: 100,
          showClose: false
        })
      }
    })
}


const createOrder = async (item: any) => {
  ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    $services.order
      .create({
        data: {
          code: new Date().getTime().toString().substring(0, 13),
          name: item.caption,
          merchandiseId: item.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
        }
      })
  })
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
//下架应用
const unpublishApp = (item: any) => {
  $services.market
    .unpublishMerchandise({
      data: {
        id: item.id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        emit('handleUpdate')
        ElMessage({
          message: '下架成功',
          type: 'success'
        })
      }
    })
}

defineExpose({
  state
})
</script>

<style lang="scss" scoped>
.market-layout {
  height: 100%;
}

.app-con-title {
  // color: #000000d9;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.app-con-info {
  font-size: 13px;
  // font-weight: 400;
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.app-card-item-con-footer {
  display: flex;
  width: 100%;
  align-items: flex-end;

  .app-card-item-con-desc {
    width: 50%;
    justify-content: flex-start;
    padding: 0px;

    p {
      font-size: 12px;
      font-weight: 400;
      color: var(--el-text-color-secondary);
      padding-top: 5px;
      display: -webkit-box;
      word-break: break-all;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}

.app-card-item-con-belong {
  // margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
  color: var(--el-text-color-secondary);
  display: flex;
  justify-content: space-between;
}

// :deep(.el-card__body) {
//   padding: 0;
// }
.shopCar {
  padding: 4px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 0 20px;
}

.box {
  .box-ul+.box-ul {
    margin-top: 6px;
  }

  &-ul {
    position: relative;
    // background-color: #fff;
    height: 100%;

    &-title {
      font-weight: bold;
      padding-bottom: 10px;
    }

    .app-card {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      height: calc(100vh - 310px);
      overflow-y: auto;
      // height: calc(100% - 60px);
    }
  }
}
</style>
