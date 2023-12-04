<script setup lang='ts'>
import { IFile } from '@/ts/core';
import { File, SEntity } from '../../../design/config/FileProp'
import { Context } from '../../../render/PageContext'
import {style} from './index'
const props = defineProps<{
  height: number;
  url?: SEntity;
  props: any;
  ctx: Context
}>()

const url = ref(props.url?.id)
</script>
<template>
  <div :style="style(height, url)">
    <File
      :accepts="['图片']"
      :onOk="(files: IFile[]) => {
        props.props.url = files[0].metadata
        url = props.props.url.id
      }"
    >
      <ElButton
        :style="{ position: 'absolute', left: '10px', bottom: '10px' }"
        size="small"
      >
        添加图片
      </ElButton>
    </File>
  </div>
</template>

<style lang='scss' scoped>

</style>