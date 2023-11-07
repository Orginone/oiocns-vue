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
      <ElIcon @click="setSegmented('list');onSegmentChanged('list');" :size="20" :color="segmented === 'list' ? '#0d0dff' : '#9498df'">
        <List/>
      </ElIcon>
      <ElIcon @click="setSegmented('icon');onSegmentChanged('icon');" :size="20" :color="segmented === 'icon' ? 'blue' : '#9498df'">
        <Th/>
      </ElIcon>
      <ElIcon @click="setSegmented('table');onSegmentChanged('table');" :size="20" :color="segmented === 'table' ? 'blue' : '#9498df'">
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
    height: calc(100% - 32px);
  }
  .footer {
    height: 32px;
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
      align-items: center;
      padding: 1px;
      border-radius: 5px;
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