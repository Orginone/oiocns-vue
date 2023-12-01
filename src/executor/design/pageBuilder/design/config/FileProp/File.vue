<script setup lang='ts'>
import OpenFileDialog from '@/components/OpenFileDialog/index.vue'
// import { PageContext } from '../../../render/PageContext'
import {IProps} from './index'
import { IFile } from '@/ts/core'
import { VNode } from 'vue'

// const props = defineProps<IProps>()
const props = defineProps<{
  title?: string
  /** 允许选择的文件类型 */
  accepts: string[]
  /** 是否允许多选 */
  multiple?: boolean
  /** 最大选中数量 */
  maxCount?: number
  // rootKey: string
  currentKey?: string
  excludeIds?: string[]
  allowInherited?: boolean
  /** 确认回调 */
  onOk: (files: IFile[]) => void;
  // onCancel: () => void
  children: VNode
}>()
// const ctx = inject<PageContext>('PageContext')
const ctx = inject('PageContext')
const center = ref(false)

</script>
<template>
  <div
    style="width:100%;"
    @click="center=true"
  >
    
  </div>
  <OpenFileDialog v-if="center"
    v-bind="props"
    :rootKey="ctx.view.pageInfo.directory.spaceKey"
    :onOk="(files) => {
      if (files.length > 0) {
        props.onOk(files);
      }
      center=false
    }"
    :onCancel="()=>center=false"
  />
</template>

<style lang='scss'>

</style>