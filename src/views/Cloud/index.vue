<template>
  <div class="cloud">
    <NavList ref="navRef" :menuList="state.cloudMenu"></NavList>
    <!-- <CloudMain
      @createFile="createFile"
      @gotoBTM="gotoBTM"
      @gotoBack="gotoBack"
      @changeCurrentLocation="changeCurrentLocation"
      @uploadList="uploadList"
      :breadcrumb="state.breadcrumb"
      :cloudData="state.cloudData"
    ></CloudMain> -->
  </div>
</template>

<script lang="ts" setup>
  import NavList from './components/navList.vue'
  import CloudMain from './components/cloudMain.vue'
  import Bucket from '@/module/cloud/bucket'
  import Objectlay from '@/module/store/objectlay'
  import { encodeURIString } from './conversion'
  import { onMounted, reactive, ref, nextTick } from 'vue'
  import { el } from 'element-plus/es/locale'

  const navRef = ref()
  const state = reactive({
    cloudMenu: [],
    cloudData: [],
    keyArr: [],
    breadcrumb: [],
    currentLocation: ''
  })
  // const level = ref<number>(1)
  // const isShow = ref<boolean>(false)
  // // 创建文件夹
  // const createFile = async () => {
  //   console.log('chuangjian', state.breadcrumb)
  //   let params = {
  //     shareDomain: '',
  //     key: encodeURIString(state.breadcrumb[state.breadcrumb.length - 1].key)
  //   }
  //   const res = await cloud.bucketObjects(params, true)
  //   handleCloudMenu([state.breadcrumb[state.breadcrumb.length - 1]], res)
  // }
  // const handleCloudMenu = (item: any, res: any) => {
  //   let level = item[0].level
  //   for (let i = 0; i < item.length; i++) {
  //     if (item[i].level == level) {
  //       item[i].children = res.filter((el: any) => {
  //         return el.isDirectory
  //       })
  //       state.cloudData = cloud.cloud.get(encodeURIString(item[i].key) || 'default')
  //     } else {
  //       if (item[i].children.length > 0) {
  //         handleCloudMenu(item[i].children, res)
  //       } else {
  //         return
  //       }
  //     }
  //   }
  // }
  // // 上传应用
  // const uploadList = async () => {
  //   const obj = cloud.getHistoryKey(state.breadcrumb)
  //   await cloud.bucketObjects(obj, true, obj.level + 1)
  //   state.cloudData = cloud.cloud.get(obj.key == '' ? 'default' : obj.key)
  // }
  // // 回到我的网盘
  // const gotoBTM = () => {
  //   state.breadcrumb.splice(1, state.breadcrumb.length - 1)
  //   state.cloudData = cloud.cloud.get('default')
  // }
  // const gotoBack = (data: any) => {
  //   // state.breadcrumb.splice()
  //   console.log('返回', data)
  //   for (let i = 0; i < state.breadcrumb.length; i++) {
  //     if (state.breadcrumb[i].level == data.level) {
  //       state.breadcrumb.splice(i, state.breadcrumb.length - 1 - i)
  //       state.breadcrumb[i] = data
  //       break
  //     }
  //   }
  //   state.cloudData = cloud.cloud.get(encodeURIString(data.key)) || []
  // }
  // // 点击菜单
  // const changeCurrentLocation = async (data: any, type: number) => {
  //   console.log('点击的data', data)

  //   if (data.key == '') {
  //     state.cloudData = cloud.cloud.get('default')
  //   } else {
  //     if (data.level) {
  //       level.value = data.level + 1
  //     }
  //     let params = {
  //       shareDomain: '',
  //       key: encodeURIString(data.key)
  //     }
  //     await cloud.bucketObjects(params, false, level.value)
  //     state.cloudData = cloud.cloud.get(encodeURIString(data.key))
  //   }
  //   let isDel = false

  //   // 如果从里面开始点击
  //   // if (data.key.indexOf('/') !== -1) {
  //   //   let arr: any[] = [{ level: 1, name: '我的网盘', key: '' }]
  //   //   let key = ''
  //   //   data.key.split('/').forEach((el: any, index: number) => {
  //   //     key = key + '/' + el
  //   //     let obj = {
  //   //       level: 1,
  //   //       name: '',
  //   //       key: ''
  //   //     }
  //   //     obj.level = index + 2
  //   //     obj.name = el
  //   //     obj.key = key.slice(1)
  //   //     arr.push(obj)
  //   //   })
  //   //   state.breadcrumb = arr
  //   // } else {
  //   for (let i = 0; i < state.breadcrumb.length; i++) {
  //     if (state.breadcrumb[i].level == data.level) {
  //       isDel = true
  //       state.breadcrumb.splice(i, state.breadcrumb.length - 1 - i)
  //       state.breadcrumb[i] = data
  //       break
  //     }
  //   }
  //   if (!isDel) {
  //     state.breadcrumb.push(data)
  //   }
  // }
  // // }

  onMounted(async () => {
    console.log('少时诵诗书', Bucket)

    if (Bucket.Root.HasSubDirectories) {
      Bucket.Root.children = [{} as Objectlay]
    }
    state.cloudMenu.push(Bucket.Root)
  })
</script>
<style lang="scss" scoped>
  .cloud {
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
