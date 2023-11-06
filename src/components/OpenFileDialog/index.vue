<script setup lang="ts">
// import MainLayout from '../MainLayout';
// import Directory from '../Directory';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadSettingMenu } from './config/index';
import FullScreenModal from '../Common/fullScreenModal.vue';
import { IFile } from '@/ts/core';
import orgCtrl, { Controller } from '@/ts/controller';

const props = defineProps<{
  title?: string;
  accepts: string[];
  multiple?: boolean;
  maxCount?: number;
  rootKey: string;
  excludeIds?: string[];
  allowInherited?: boolean;
  onOk: (files: IFile[]) => void;
  onCancel: () => void;
}>()

const selectedFiles = ref<IFile[]>()
const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
  () => loadSettingMenu(props.rootKey, props.allowInherited || false),
  new Controller(orgCtrl.currentKey),
);
</script>

<template>
  <FullScreenModal
    v-if="selectMenu && rootMenu"
    open
    :title="title ?? '选择文件'"
    :onCancel="()=>{onCancel(); selectedFiles=[]}"
    destroyOnClose
    width='80vw'
    bodyHeight='65vh'
  >
    <!-- TODO: -->
    <span style="background-color: #ffbd2a;color:white;font-size: large;font-weight: bold;">TODO</span>
    <!-- <MainLayout
      leftShow
      selectMenu={selectMenu}
      onSelect={(data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Directory
        key={key}
        accepts={props.accepts}
        selects={selectedFiles}
        current={selectMenu.item}
        excludeIds={props.excludeIds}
        onFocused={(file) => {
          if (!props.multiple) {
            if (file) {
              setSelectedFiles([file]);
            } else {
              setSelectedFiles([]);
            }
          }
        }}
        onSelected={(files) => {
          if (props.multiple) {
            if (props.maxCount && files.length > props.maxCount) {
              setSelectedFiles(files.slice(-props.maxCount));
            } else {
              setSelectedFiles(files);
            }
          }
        }}
        mode={10}
      />
    </MainLayout> -->
    
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
