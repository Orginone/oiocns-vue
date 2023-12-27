<script setup lang="ts">

import DirectoryViewer from './views/index.vue'
import { IFile,IDEntity } from '@/ts/core'
import { loadFileMenus } from '@/executor/fileOperate'
import { command } from '@/ts/base'
import { cleanMenus } from '@/utils/tools'

const props = defineProps<{
  root: IFile
}>()

const preDirectory= ref<IFile>()
const directory=ref<IFile>(props.root as IFile)
const content = ref<IDEntity[]>(directory.value.content(false))
const loaded=ref(false)
/** 加载目录内容 */
const loadContent = async(file: IFile, directory: IFile) => {
  loaded.value = false
  await file.loadContent()
  if (file.key === directory.key) {
    content.value = directory.content(false)
  }
  loaded.value = true
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
  onBeforeUnmount(() => directory.value.unsubscribe(id))
},{immediate:true})

/** 打开文件 */
const handleFileOpen = (file:any) => {
  if (file?.isContainer) {
    directory.value = file
  } else {
    command.emitter('executor', 'open',file,'preview')
  }
}
/** 获取右键菜单 */
const getContextMenu = (entity:any) => {
  const file = (entity || directory.value) as IFile
  return {
    items: cleanMenus(loadFileMenus(file)) ?? [],
    onClick: ({ key }:{key:string}) => {
      const dirRefresh = ['refresh', 'reload'].includes(key)
      if (dirRefresh) {
        loadContent(file, directory.value as IFile)
      } else {
        command.emitter('executor', key, file);
      }
    },
  }
}
</script>

<template>
  <div class="directory-viewer" v-loading="!loaded" element-loading-text="加载中...">
    <DirectoryViewer
      title="群数据"
      :content="(content as IDEntity[])"
      list-type="list"
      extraTags
      :initTags="['全部']"
      :selectFiles="[]"
      :fileOpen="handleFileOpen"
      :preDirectory="(preDirectory as IFile)"
      :contextMenu="getContextMenu"
    />
  </div>
</template>

<style lang="scss" scoped>
.directory-viewer {
  height: 100%;
}
</style>
