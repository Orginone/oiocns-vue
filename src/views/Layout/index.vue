<!-- Layout -->
<script lang="ts" setup>
  import slide from './components/slide.vue'



  // 命令执行器
import Executor from '@/executor/index.vue'; 
</script>

<template>
  <el-container class=" pages home-wrap">
    <!-- Layout——侧边导航 -->
    <slide></slide>
    <!-- Layout——命令执行器 -->
    <Executor />
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

<style>
div{
  font-size: 14px;
}
</style>
<style lang="scss" scoped>
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
