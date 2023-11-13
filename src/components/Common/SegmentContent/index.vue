<!-- 存储——文件系统 -->
<script setup lang="ts">
import useStorage from '@/hooks/useStorage'
import {Th,List,Table} from '@/icons/fa'

type segmentedTypes = 'icon' | 'table' | 'list'

const props = defineProps<{
  descriptions: string;
  onSegmentChanged: (type: segmentedTypes) => void
}>()

const [segmented, setSegmented] = useStorage('segmented', 'list');
const parentRef = ref<any>()

</script>

<template>
<div id="segmentContent">
  <!-- 默认插槽 -->
  <div class="mainContent" :ref="parentRef">
    <slot />
  </div>
  <div class="footer">
    <!-- 项目个数 -->
    <div class="descriptions">
      {{descriptions}}
    </div>
    <!-- 切换展示类型按钮 -->
    <div class="footer-check">
      <ElIcon :class="segmented === 'list'?'footer-check-btn checked' : 'footer-check-btn'" @click="setSegmented('list');onSegmentChanged('list');">
        <List/>
      </ElIcon>
      <ElIcon :class="segmented === 'icon'?'footer-check-btn checked' : 'footer-check-btn'" @click="setSegmented('icon');onSegmentChanged('icon');">
        <Th/>
      </ElIcon>
      <ElIcon :class="segmented === 'table'?'footer-check-btn checked' : 'footer-check-btn'" @click="setSegmented('table');onSegmentChanged('table');">
        <Table/>
      </ElIcon>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';
#segmentContent {
  height: calc(100% - 35px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  .mainContent {
    padding-bottom: 0;
    overflow: auto;
    overflow-x: hidden;
    height: calc(100% - 40px);
    &::-webkit-scrollbar{
      background-color: transparent;
      width: 4px;
    }
  }
  .footer {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .descriptions {
      color: #154ad8;
      outline: none;
      cursor: pointer;
      -webkit-transition: color .3s;
      transition: color .3s;
      text-decoration: none;
    }
    .footer-check {
      margin-right: 15px;
      cursor: pointer;
      background-color: #f0f0f0;
      display: flex;
      // align-items: center;
      height: 34px;
      padding: 2px;
      border-radius: 6px;
      .footer-check-btn {
        padding: 5px;
        box-sizing: content-box;
        font-size: 20px;
        color: #9498df;
        border-radius: 6px;
      }
      .checked {
        color: #0d0dff;
        background-color: white;
      }
    }
  }
}


.file {
  width: 100%;
  margin-top: 20px;
  flex: 1;
  overflow: auto;
  overflow-x: hidden;
}

.content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.fileImage {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.fileName {
  width: 100%;
  text-align: center;
  // TODO:
  // padding-top: @padding-xs;
}
.active {
  // TODO:
  // color: @primary-color;
  color: yellow;
}

</style>