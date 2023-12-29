<!-- Layout -->
<script lang="ts" setup>

import Navbar from './navbar.vue'
import Executor from '@/executor/index.vue'

</script>

<template>
  <el-container class="pages">
    <!-- Layout——侧边导航 -->
    <Navbar />
    <!-- Layout——命令执行器 -->
    <Executor />
    <!-- TODO: 连接掉线通知 -->
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
