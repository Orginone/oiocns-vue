<template>
  <div class="button">
    <el-button link type="primary" class="diy-button" @click="handleCardInfo"> 详情 </el-button>
    <el-button link type="primary" class="diy-button" @click="joinStaging(props.data)"> 加入购物车 </el-button>
    <el-button link type="primary" class="diy-button"  @click="buyThings(props.data)"> 购买 </el-button>
    <el-button link type="primary" class="diy-button" @click="unpublishFun"> 下架 </el-button>
  </div>
  <div v-for="item in state.dialogShow" :key="item.key">
    <AppInfoDialog v-if="item.key == 'info' && item.value" :dialogShow="item" @closeDialog="closeDialog">
    </AppInfoDialog>
  </div>

</template>

<script setup lang="ts">
  import DiyButton from '@/components/diyButton/index.vue'
  import { reactive, onMounted, ref, watch, nextTick } from 'vue'
  import $services from '@/services'
  import { ElMessage, ElMessageBox,ElNotification } from 'element-plus'
  import { propsToAttrMap } from '@vue/shared';
  import AppInfoDialog from './appInfoDialog.vue'
  const emit = defineEmits(['update','handleUpdate', 'shopcarNumChange'])
  const props = withDefaults(
    defineProps<{
      data: any
      type?: 'manage' | 'shop'
    }>(),
    { type: 'manage' }
  )
  const state = reactive({
    dialogShow: [
    {
      key: 'info',
      value: false
    }
  ]
  })
  type AppType = {
  caption:string
  createTime:string
  createUser: string
  days:string
  id:string
  information:string
  marketId:string
  price:number
  productId:string
  sellAuth:string
  status:number
  updateTime:string
  updateUser:string
  version:string
}
  const buyThings = (item:AppType) =>{
    ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      setTimeout(
        async () => {
          await $services.order
            .create({
              data: {
                code: new Date().getTime().toString().substring(0, 13),
                name:item.caption,
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
        },
        1
      )
    })
  }
  const joinShopCar = () => {
    $services.appstore
      .staging({
        data: {
          id: props.data.id
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
  }
  const joinStaging = async (item: any) => {
  console.log(item)
  await $services.market
    .joinStaging({
      data: {
        id: item.id
      }
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        emit('shopcarNumChange')
        ElNotification.success({
          title: '已加入购物车',
          offset: 100,
          showClose: false
        })
      }
    })
}
  const unpublishFun = () => {
    let title: string
    title = `确定把 ${props.data.caption} 下架吗？`
    ElMessageBox.confirm(title, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        unpublishApp()
      })
      .catch(() => {})
  }
  //下架应用
  const unpublishApp = () => {
    $services.market
      .unpublishMerchandise({
        data: {
          id: props.data.id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          emit('update')
          ElMessage({
            message: '下架成功',
            type: 'success'
          })
        }
      })
  }
  const requireItem = () => {}
  const handleCardInfo = () => {
    state.dialogShow.map((el: { value: boolean; key: string; sendData?: any }) => {
      if (el.key == 'info') {
        el.value = true
        el.sendData = props.data
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
</script>

<style lang="scss" scoped>
  .button{
    width: 200px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;
  }

</style>
