<script lang="ts" setup>
import NavigationBar from './components/NavigationBar/index.vue'
import { allPages } from './components/NavigationBar/config';

// 当前页面
const current = ref(allPages[0])

</script>

<template>
  <!-- 门户布局 -->
  <div class="homepage">
    <!-- 门户——顶部Banner图 -->
    <div class="headBanner" 
      v-if="current.type==='inner'"
      :style="{backgroundImage: `url(${current.backgroundImageUrl})`}"
    />
    <!-- 门户——内容区域 -->
    <div class="content">
      <component :is="current.component" />
    </div>
    <!-- 门户——顶部导航 -->
    <NavigationBar
      :list="allPages" 
      @change="item=> current = item"
    />    
  </div>
</template>



<style lang="less" scoped>
.homepage {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
  background-color: @portal-background;
  position: relative;
  .headBanner {
    width: 100%;
    min-height: 400px;
    background-size: 100% 400px;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .content {
    width: 100%;
    position: absolute;
    top: 315px;
  }
  
}

</style>
