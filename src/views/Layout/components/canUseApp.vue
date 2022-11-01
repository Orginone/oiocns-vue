<template>
  <div
    v-for="(item, index) in appList"
    :key="index"
    style="width: 80px; height: max-content; float: left; margin: 10px"
    @click="handleChooseItem(item)"
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <HeadImg :name="item.name" :url="item.icon" :imgWidth="40" :limit="1" :isSquare="false" />
      <span class="appName">{{ item.name }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import img1 from '@/assets/img/group22.png'
  import { onMounted, ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useCommonStore } from '@/store/common'
  const commonStore = useCommonStore()

  // 展示数据
  const appList = ref<ProductType[]>([])
  const getAppList = async () => {
    const { data, success } = await $services.product.searchUsefulProduct({
      data: {
        offset: 0,
        limit: 20,
        filter: ''
      }
    })
    if (success) {
      const { result = [], total = 0 } = data
      appList.value = result.map((item: any) => {
        return { ...item, icon: img1 }
      })
      commonStore.isChangeStartApp = false
      emit('onCanUseAppIdChange',appList.value.map(item=>item.id))
    }
  }
  onMounted(() => {
    getAppList()
  })
  watch(
    () => commonStore.isChangeStartApp,
    (val) => {
      if (val) {
        getAppList()
      }
    }
  )
  const emit = defineEmits(['AppChange','onCanUseAppIdChange'])
  const handleChooseItem = async (app: any) => {
    const { data, success } = await $services.product.queryOwnResource({
      data: {
        id: app.id,
        offset: 0,
        limit: 10,
        filter: ''
      }
    })
    if (success) {
      const { result = [], total = 0 } = data
      if (total === 0) {
        return ElMessage({
          type: 'error',
          message: '该应用资源缺失,请联系管理员'
        })
      }
      // TODO:按照权限判断展示哪个资源
      const {link } = result[0]
      emit('AppChange', { appInfo: app, icon: img1, link, path: '/online' })
    }
    // emit('AppChange', app)
  }
</script>

<style lang="scss" scoped>
  .canUseApp-wrap {
  }
</style>
