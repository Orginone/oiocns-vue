<script lang="ts" setup>
import NavigationBar from './components/NavigationBar/index.vue'
import { allPages } from './components/NavigationBar/config'

// 当前页面
const current = ref(allPages[0])

</script>

<template>
  <div class="homepage">
    <div class="headBanner"  v-if="current.type==='inner'"
      :style="{backgroundImage: `url(${current.backgroundImageUrl})`}"
    ></div>
    <div class="content" v-if="current.type==='inner'">
      <component :is="current.component" />
    </div>
    <template v-if="current.type==='page'">
        <component :is="current.component" />
    </template>
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
    height: 100%;
    position: absolute;
    top: 315px;
  }
  
}

</style>
