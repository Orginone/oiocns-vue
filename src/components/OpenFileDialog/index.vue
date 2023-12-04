<script setup lang="ts">
import MainLayout from '../MainLayout/index.vue'
import Content from './content/index.vue'
import useMenuUpdate from '@/hooks/useMenuUpdate'
import { loadSettingMenu } from './config/index'
import FullScreenModal from '../Common/fullScreenModal.vue'
import { IFile } from '@/ts/core'
import orgCtrl, { Controller } from '@/ts/controller'
import { MenuItemType } from '@/typings/globelType'
import {command} from '@/ts/base'

const props = defineProps<{
  title?: string;
  /** 允许选择的文件类型 */
  accepts: string[];
  /** 是否允许多选 */
  multiple?: boolean;
  /** 最大选中数量 */
  maxCount?: number;
  rootKey: string;
  currentKey?: string;
  excludeIds?: string[];
  allowInherited?: boolean
  /** 确认回调 */
  onOk: (files: IFile[]) => void;
  onCancel: () => void;
}>()
const selectedFiles = ref<IFile[]>()

const {key, rootMenu, selectMenu, onSelectMenu:setSelectMenu} = useMenuUpdate(
  () => loadSettingMenu(props.rootKey, props.allowInherited || false),
  new Controller(props.currentKey ?? orgCtrl.currentKey),
)
/** 
 * 聚焦文件回调
*/
const onFocused = (file:IFile) => {
  if (!props.multiple) {
    if (file) {
      selectedFiles.value=[file]
    } else {
      selectedFiles.value=[]
    }
  }
}
/**
 * 选择文件回调
 * @param files 
 */
const onSelected = (files:IFile[]) => {
  if (props.multiple) {
    if (props.maxCount && files.length > props.maxCount) {
      // 超过最大数量
      selectedFiles.value = files.slice(-props.maxCount)
    } else {
      selectedFiles.value = files
    }
  }
}
</script>

<template>
  <FullScreenModal
    v-if="selectMenu && rootMenu"
    open
    :title="title ?? '选择文件'"
    :onCancel="()=>{onCancel(); selectedFiles=[]}"
    destroyOnClose
    width='80vw'
    top="5vh"
    bodyHeight='60vh'
  >
    <MainLayout
      leftShow
      :selectMenu="selectMenu"
      :onSelect="(data) => {
        setSelectMenu(data)
      }"
      :siderMenuData="rootMenu"
      preview-flag="dialog"
    >
      <Content
        :key="key"
        dialog
        previewFlag='dialog'
        :accepts="accepts"
        :selects="selectedFiles || []"
        :current="selectMenu.item"
        :excludeIds="props.excludeIds"
        :onFocused="onFocused"
        :onSelected="onSelected"
      />
    </MainLayout>
    
    <template #footer>
      <ElSpace spacer="|" wrap :size="2">
        <ElButton
          type="primary"
          @click="onOk(selectedFiles);selectedFiles=[]"
        >
          确认
        </ElButton>
      </ElSpace>
    </template>
  </FullScreenModal>
</template>

<style lang="scss" scoped></style>
