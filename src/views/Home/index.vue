<script lang="ts" setup>
import NavigationBar from './components/NavigationBar/index.vue'
import { allPages } from './components/NavigationBar/config';

// 当前页面
const current = ref(allPages[0])

</script>

<template>
  <!-- 门户布局 -->
  <div class="homepage">
    <!-- 门户——顶部导航 -->
    <NavigationBar 
      :list="allPages" 
      @change="item=> current = item"
    />
    <!-- 门户——顶部Banner图 -->
    <div class="headBanner" 
      v-if="current.type==='inner'"
      :style="{backgroundImage: `url(${current.backgroundImageUrl})`}"
    />
    <!-- 门户——内容区域 -->
    <div class="homepage-content">
      <Suspense>
        <template #default>
          <component :is="current.component"></component>
        </template>
        <template #fallback>
          <div>加载中...</div>
        </template>
      </Suspense>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.homepage{
  width: 100%;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  // 设置y轴滚动吸附
  scroll-snap-type: y mandatory;

  .headBanner {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-position: 50% 20%;
    background-size: cover;
    scroll-snap-align: start;
  }
  .homepage-content {
    // 滚动吸附对齐方式
    scroll-snap-align: start;
  }
}
</style>
