<script setup lang="ts">

import DirectoryViewer from './views/index.vue'
import useCtrlUpdate from '@/hooks/useCtrlUpdate'
import useTimeoutHanlder from '@/hooks/useTimeoutHanlder'
import { IDirectory, IFile,IDEntity } from '@/ts/core'
import { loadFileMenus } from '@/executor/fileOperate'
import { command } from '@/ts/base'
import orgCtrl from '@/ts/controller'
import useAsyncLoad from '@/hooks/useAsyncLoad'
import { cleanMenus } from '@/utils/tools'

const props = defineProps<{
  root: IFile
}>()

const preDirectory= ref<IFile>()
const directory=ref<IFile>(props.root)
const content = ref<IDEntity[]>(directory.value.content(false))
const loaded=ref(false)
/** 加载目录内容 */
const loadContent = (file: IFile, directory: IFile) => {
  loaded.value = false
  file.loadContent().then(() => {
    if (file.key === directory.key) {
      content.value = directory.content(false)
    }
    loaded.value = true
  })
}

watch(directory, () => {
  const id = directory.value.subscribe(() => {
    loadContent(directory.value as IFile, directory.value as IFile)
  })
  if (directory.value != props.root) {
    preDirectory.value = directory.value.superior as IFile
  } else {
    preDirectory.value = undefined
  }
  return () => {
    directory.value.unsubscribe(id)
  }
},{immediate:true})


</script>

<template>
  <div class="directory-viewer" :v-loading="!loaded" element-loading-text="'加载中...'">
    <DirectoryViewer
      extraTags
      :initTags="['全部']"
      :selectFiles="[]"
      :content="(content as IDEntity[])"
      :fileOpen="(file:any) => {
          if (file && 'isContainer' in file && file.isContainer) {
            directory = file as IFile
          } else {
            command.emitter('executor', 'open',file,'preview');
          }
        }"
      :preDirectory="(preDirectory as IFile)"
      :contextMenu="(entity:any) => {
          // TODO:
          console.log('here');
          
          // const file = (entity as IFile) || directory;
          // return {
          //   items: cleanMenus(loadFileMenus(file)) ?? [],
          //   onClick: ({ key }: { key: string }) => {
          //     const dirRefresh = ['refresh', 'reload'].includes(key);
          //     if (dirRefresh) {
          //       loadContent(file, directory);
          //     } else {
          //       command.emitter('executor', key, file);
          //     }
          //   },
          // };
        }"
    />
  </div>
</template>

<style lang="scss" scoped>
.directory-viewer {
  height: 100%;
}
</style>
