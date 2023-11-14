<script setup lang="ts">
import MainLayout from '../MainLayout/index.vue'
import Directory from '../Directory/index.vue'
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadSettingMenu } from './config/index';
import FullScreenModal from '../Common/fullScreenModal.vue';
import { IFile } from '@/ts/core';
import orgCtrl, { Controller } from '@/ts/controller';
import { MenuItemType } from '@/typings/globelType'
import {command} from '@/ts/base'

const props = defineProps<{
  title?: string;
  accepts: string[];
  multiple?: boolean;
  maxCount?: number;
  rootKey: string;
  currentKey?: string;
  excludeIds?: string[];
  allowInherited?: boolean;
  onOk: (files: IFile[]) => void;
  onCancel: () => void;
}>()

const selectedFiles = ref<IFile[]>()

const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
  () => loadSettingMenu(props.rootKey, props.allowInherited || false),
  new Controller(props.currentKey ?? orgCtrl.currentKey),
)
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
        setSelectMenu(data);
      }"
      :siderMenuData="rootMenu"
      :onMenuClick="(item: MenuItemType, menuKey: string)=>{
        command.emitter('executor', menuKey, item);
      }"
      preview-flag="dialog"
    >
      <Directory
        :key="key"
        dialog
        previewFlag='dialog'
        :accepts="accepts"
        :selects="selectedFiles"
        :current="selectMenu.item"
        :excludeIds="props.excludeIds"
        :onFocused="(file) => {
          if (!props.multiple) {
            if (file) {
              selectedFiles=[file]
            } else {
              selectedFiles=[]
            }
          }
        }"
        :onSelected="(files) => {
          if (multiple) {
            if (maxCount && files.length > maxCount) {
              selectedFiles = files.slice(-maxCount)
            } else {
              selectedFiles = files
            }
          }
        }"
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
