<!-- 文件上传 -->
<script setup lang='ts'>
import { IDirectory, ISysFileInfo } from '@/ts/core'
import { command } from '@/ts/base'

const props = defineProps<{
  dir: IDirectory
}>()

const isShow = ref(true)

const uploaded = (file: File) => {
  if (file) {
    props.dir.changCallback()
  }
}

</script>

<template>
  <div class="upload-container">
    <ElUpload
      multiple
      drag
      :limit="100"
      :show-file-list = "false"
      :http-request="async (options) => {
        isShow = false
        command.emitter('executor', 'taskList', dir)
        const file = options.file as File;
        if (file) {
          uploaded([await props.dir.createFile(file)]);
        }
      }"
    >
      <div style="color: limegreen;font-size: 22px">点击或拖拽至此处上传</div>
    </ElUpload>
  </div>
</template>

<style lang='scss' scoped>
.upload-container {
  :deep(.el-upload-dragger) {
    width: 550px;
    height: 300px !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>