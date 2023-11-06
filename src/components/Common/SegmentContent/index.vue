<!-- 存储——文件系统 -->
<script setup lang="ts">
import useStorage from '@/hooks/useStorage'
// import * as fa from '@/icons/fa'
import { Component } from 'vue'

type segmentedTypes = 'icon' | 'table' | 'list';

const props = defineProps<{
  descriptions: string;
  // content: React.ReactNode;改成用插槽了
  onSegmentChanged: (type: segmentedTypes) => void;
}>()

const [segmented, setSegmented] = useStorage('segmented', 'list');
const parentRef = ref<any>()

</script>

<template>
<div id="segmentContent">
  <ElCard shadow="never" body-class="mainContent">
    <!-- 默认插槽 -->
    <div class="mainContent" :ref="parentRef">
      <slot />
    </div>
    <ElAffix position="bottom" :offset="0" >
      <!-- TODO:right:10 -->
      <!-- <Segmented
        :value="segmented"
        :onChange="(value) => {
          setSegmented(value as segmentedTypes);
          onSegmentChanged(value as segmentedTypes);
        }"
        :options="[
          {
            value: 'list',
            icon: (
              <fa.FaList
                fontSize={20}
                color={segmented === 'list' ? 'blue' : '#9498df'}
              />
            ),
          },
          {
            value: 'icon',
            icon: (
              <fa.FaTh
                fontSize={20}
                color={segmented === 'icon' ? 'blue' : '#9498df'}
              />
            ),
          },
          {
            value: 'table',
            icon: (
              <fa.FaTable
                fontSize={20}
                color={segmented === 'table' ? 'blue' : '#9498df'}
              />
            ),
          },
        ]"
      /> -->
      <!-- 临时版 -->
      <ElButton @click="setSegmented('list');onSegmentChanged('list');">list</ElButton>
      <ElButton @click="setSegmented('icon');onSegmentChanged('icon');">icon</ElButton>
      <ElButton @click="setSegmented('table');onSegmentChanged('table');">table</ElButton>
    </ElAffix>
    <!-- left:10 -->
    <ElAffix position="bottom" :offset="0">
      <ElSpace spacer="|">
        <!-- TODO: -->
        <!-- <Typography.Link>{{descriptions}}</Typography.Link> -->
        <ElLink>{{descriptions}}</ElLink>
      </ElSpace>
    </ElAffix>
  </ElCard>
</div>
</template>

<style lang="scss" scoped>
// @import '~antd/es/style/themes/variable';
#segmentContent {
  height: 100%;
  &:deep(.el-card) {
    height: calc(100% - 35px);
    padding-bottom: 0;
    // TODO:
    // & > :global(.ogo-card-body) {
    //   height: calc(100% - 10px);
    //   padding: 2px 6px;
    // }
    // & > :global(.dx-datagrid-headers) {
    //   border-bottom: none;
    // }
    .mainContent {
      padding-bottom: 0;
      height: calc(100% - 20px);
      overflow: auto;
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