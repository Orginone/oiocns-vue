<script setup lang="ts">
import { ISysFileInfo } from '@/ts/core';
import OpenFileDialog from '@/components/OpenFileDialog/index.vue';
import ActivityResource from '@/components/Activity/ActivityResource/index.vue';
import {Plus} from '@element-plus/icons-vue'
import { MenuItemType } from 'typings/globelType';

const props = defineProps<{
  maxCount: number,
  types: string[],
  currentKey?: string,
  onChange: (fileList: ISysFileInfo[]) => void
}>()

const open = ref(false)
const fileList = ref<ISysFileInfo[]>([]);

onMounted(() => {
  props.onChange(fileList.value as ISysFileInfo[])
})
</script>

<template>
  <div class="imageUploader">
    
    <ActivityResource 
      :fileList="fileList.map((i) => i.shareInfo())"
      :maxWidth="200"
      :columns="1"
    />

      <!-- 选择文件对话框 -->
      <OpenFileDialog
        v-if="open"
        multiple
        :rootKey="'disk'"
        :currentKey="currentKey"
        :maxCount="maxCount"
        :accepts="types"
        allowInherited
        :onCancel="() => open=false"
        :onOk="(files) => {
          fileList=[...fileList, ...files.map((i) => i as ISysFileInfo)]
          open=false
        }"
        
      />
      <!-- 选择文件按钮 -->
      <div
        v-if="fileList.length < maxCount"
        class="selectFileBtn" 
        @click="open=true"
      >
        <ElIcon :size="30">
          <Plus/>
        </ElIcon>
        <div style="margin-top: 8px;">选择文件</div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.imageUploader {
  display: flex;
  gap: 8px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  // :global {
  //   .ogo-upload-picture-card-wrapper {
  //     width: auto;
  //   }
  // }
  .selectFileBtn {
    height: 100px;
    width: 100px;
    padding: 16px;
    cursor: pointer;
    border-radius: 10px;
    margin: 46px;
    border: 1px solid #e7e7e7;
    text-align: center;
    font-size: 16px;
    &:hover {
      color: blue;
      background-color: #e7e7e7;
    }
  }
}

:deep(.el-form-item__content) {
  background-color: #fafafa;
}
</style>
