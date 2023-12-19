<!-- 内容区模板布局 -->
<script setup lang="ts">
import { OperateMenuType } from '@/typings/globelType'
import useStorage from '@/hooks/useStorage'
import EntityPreview from './preview/index.vue'

defineProps<{
  previewFlag?: string;
}>()

</script>

<template>
  <div class="main-layout">
    <div class="main-layout-body">
      <div class="main-layout-body-list">
        <slot />
      </div>
      <!-- 详情-->
      <div class="main-layout-body-detail">
        <EntityPreview :flag="previewFlag" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  // TODO: color/surface/品牌背景色
  background-color: #F2F3FF;
  .main-layout-header {
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    height: 60px;
  }

  .main-layout-body {
    height: 0;
    flex: 1;
    display: flex;
    border-radius: 12px 0 0 0;
    overflow: hidden;
    .main-layout-body-list {
      width: 400px;
      padding: 16px;
      // TODO: color/surface/主要容器背景&弹窗背景
      background-color: #FFFFFF;
    }
    .main-layout-body-detail {
      width: 0;
      flex:1;
      background-color: #FCFCFC;
    }
  }
 
}
</style>
