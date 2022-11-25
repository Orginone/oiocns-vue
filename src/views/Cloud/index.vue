<template>
  <div class="cloud">
    <NavList ref="navRef" :menuList="state.cloudMenu"></NavList>
    <CloudMain
      @createFile="createFile"
      @gotoBTM="gotoBTM"
      @gotoBack="gotoBack"
      @changeCurrentLocation="changeCurrentLocation"
      @uploadList="uploadList"
      @refreshDirectory="refreshDirectory"
      :breadcrumb="state.breadcrumb"
      :cloudData="state.cloudData"
    ></CloudMain>
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
  import Cloud from '@/module/cloud/operation'

  const navRef = ref()
  const state = reactive({
    cloudMenu: [],
    cloudData: [],
    keyArr: [],
    breadcrumb: [],
    currentLocation: ''
  })
  const cloud = new Cloud()
  const level = ref<number>(1)
  const isShow = ref<boolean>(false)
  // 创建文件夹
  const createFile = async () => {
    await uploadList()
  }
  const handleCloudMenu = (item: any, res: any) => {
    let level = item[0].level
    for (let i = 0; i < item.length; i++) {
      if (item[i].level == level) {
        item[i].children = res.filter((el: any) => {
          return el.isDirectory
        })
        state.cloudData = cloud.cloud.get(encodeURIString(item[i].key) || 'default')
      } else {
        if (item[i].children.length > 0) {
          handleCloudMenu(item[i].children, res)
        } else {
          return
        }
      }
    }
  }
  // 上传应用
  const uploadList = async () => {
    const obj = cloud.getHistoryKey(state.breadcrumb)
    await cloud.bucketObjects(obj, true, obj.level + 1)
    state.cloudData = cloud.cloud.get(obj.key == '' ? 'default' : obj.key)
  }
  // 回到我的网盘
  const gotoBTM = () => {
    state.breadcrumb.splice(1, state.breadcrumb.length - 1)
    state.cloudData = cloud.cloud.get('default')
  }
  const gotoBack = (data: any) => {
    changeCurrentLocation(data, 'file')
  }
  // 刷新当前文件夹
  const refreshDirectory = async () => {
    await uploadList()
  }
  // 点击菜单
  const changeCurrentLocation = async (data: any, type: string) => {
    console.log('点击的data', data)

    if (data.key == '') {
      state.cloudData = cloud.cloud.get('default')
    } else {
      if (data.level) {
        level.value = data.level + 1
      }
      let params = {
        shareDomain: 'user',
        key: encodeURIString(data.key)
      }
      await cloud.bucketObjects(params, false, level.value)
      state.cloudData = cloud.cloud.get(encodeURIString(data.key))
    }
    let isDel = false

    // 如果从里面开始点击
    for (let i = 0; i < state.breadcrumb.length; i++) {
      if (state.breadcrumb[i].level == data.level) {
        isDel = true
        state.breadcrumb.splice(i, state.breadcrumb.length - 1 - i)
        state.breadcrumb[i] = data
        break
      }
    }
    if (!isDel) {
      state.breadcrumb.push(data)
    }
  }

  onMounted(async () => {
    if (Bucket.Root.HasSubDirectories) {
      Bucket.Root.children = [{} as Objectlay]
    }
    state.cloudMenu.push(Bucket.Root)
    //默认打开根路径
    const res = await cloud.bucketObjects({shareDomain: 'user', key: ''}, true)
    changeCurrentLocation({key: '', name: '主文件夹', level: 0}, null)
    handleCloudMenu([state.breadcrumb[state.breadcrumb.length - 1]], res)
  })
</script>
<style lang="scss" scoped>
  .cloud {
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
