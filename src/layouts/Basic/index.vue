<!-- Layout -->
<script lang="ts" setup>

import Navbar from './navbar.vue'
import Executor from '@/executor/index.vue'
import orgCtrl from '@/ts/controller'
import { useRouter } from 'vue-router'
import { kernel } from '@/ts/base'

const router = useRouter()

const inited = ref(false)
const connectStatus = ref(false)

watchEffect(() => {
  setTimeout(() => {
    inited.value = true
    if (!orgCtrl.logined) {
      return router.push('/auth')
    }
  }, 500);
  kernel.onConnectedChanged((res: boolean) => {
    connectStatus.value = res
  })
})

</script>

<template>
  <!-- 布局 -->
  <el-container class="pages">
    <!-- Layout——侧边导航 -->
    <Navbar />
    <!-- Layout——内容 -->
    <div class="layout-content">
      <Suspense>
        <template #default>
          <router-view v-slot="{ Component }">
            <keep-alive v-if="$route.meta.keepAlive">
              <component :is="Component" />
            </keep-alive>
            <component v-else :is="Component" />
          </router-view>
        </template>
        <template #fallback>
          <LoadingVue />
        </template>
      </Suspense>
    </div>
  </el-container>

  <!-- 命令执行器 -->
  <Executor />
  <!-- 连接掉线通知 -->
  <teleport to='body' >
    <ElAlert v-if="!connectStatus"
      title="当前网络不可用，需检查你的网络设置"
      type="warning"
      show-icon
      closable
      style="position: fixed;top:0;z-index: 10000;"
    />
  </teleport>
</template>

<style lang="less" scoped>
  .pages{
    height: 100%;
    width: 100%;
    display: flex;

  }
  .layout-content {
    height: 100%;
    width: calc(100% - 60px);
  }
</style>
