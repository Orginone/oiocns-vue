<script setup lang="ts">
import { DxResizable } from 'devextreme-vue'
import useStorage from '@/hooks/useStorage';
import EntityPreview from './preview/index.vue';

/**
 * 内容区模板类
 */
 const props = defineProps<{
  previewFlag?: string;
  children?: any // 子组件
 }>();
const [mainWidth, setMainWidth] = useStorage<string | number>('mainWidth', '40%')

</script>
<template>
  <ElContainer class='main_layout'>
    <ElContainer class='body'>
      <ElMain class="main">
        <DxResizable
          handles='right'
          :width="mainWidth"
          :onResize="(e:any) => setMainWidth(e.width)">
          <slot name="content"></slot>
        </DxResizable>
        <div class="content">
          <EntityPreview :flag="previewFlag" />
        </div>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';
.main_layout {
  height: 100%;
  box-sizing: border-box;
  .header {
    // TODO:-color: @component-background;
    // border-radius: @border-radius-base;
    // border-bottom: 2px solid @border-color;
    background-color: #fafafa;
    padding: 12px;
    border-radius: 4px;
    border-bottom: 2px solid #efefef;
    -webkit-box-shadow: inset -20px 0px 10px 10px #f8f9ff;
    box-shadow: inset -20px 0 10px 10px #f8f9ff;
    display: flex;
    justify-content: space-between;
    height: 53px;
  }
  .sider {
    width: 250px;
    height: 100%;
    // background-color: @component-background;
    background-color: #fafafa;
    // border-right: 1px solid @border-color;
    border-right: 1px solid #efefef;
    .menuBar {
      display: flex;
      padding: 0 30px;
      margin-top: 10px;
      justify-content: space-between;
    }
    .container {
      height: 100%;
      // padding: 0 @padding-xs;
      padding: 0 10px;
      overflow-y: scroll;
    }
    .title {
      // border-radius: @border-radius-base;
      border-radius: 10px;
      clear: both;
      padding: 8px;
      text-align: center;
      cursor: pointer;
      .backup {
        color: #154ad8;
        float: left;
        padding: 6px;
      }
      .label {
        font-size: 16px;
        white-space: nowrap;
        width: 160px;
        padding: 6px;
      }
    }
  }
  .body {
    height: calc(100%);
    display: flex;
    flex-direction: row;
    .main {
      display: flex;
      padding: 0;
    }
    .content {
      flex: 1;
      display: flex;
      height: 100%;
      padding: 12px;
      border-right: 1px solid #efefef;
      // background-color: @component-background;
      // border-radius: @border-radius-base;
      background-color:#fafafa;
      border-radius: 10px;
      overflow-y: hidden;
      flex-direction: column;
    }
  }
}
:deep(.el-dropdown-menu__item){
  margin: 0 6px !important;
  padding: 0 !important;
}
.menu-item-btn {
  cursor: pointer;
  display: flex;
  align-items: start;
  padding: 6px;
  border-radius: 4px;
  // justify-content: space-between;
  &:hover {
    background-color: #f2f4f9;
  }
  >i {
    margin-right: 6px;
  }
}
</style>
