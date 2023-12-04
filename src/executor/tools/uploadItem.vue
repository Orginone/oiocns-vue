<script setup lang='ts'>

import { model, parseAvatar } from '@/ts/base'
import { IDirectory } from '@/ts/core'
import TypeIcon from '@/components/Common/GlobalComps/typeIcon.vue'

const props = defineProps<{
  icon: string;
  typeName: string;
  directory?: IDirectory;
  readonly?: boolean;
  onChanged?: (icon: string) => void;
}>()

const avatar = ref<model.FileItemShare | undefined>(parseAvatar(props.icon))

const uploadProps = {
  multiple: false, // 不支持多选
  showFileList: false, // 不展示已上传列表
  limit: 1, // 允许上传最大数量
  beforeUpload: (file: File) => {
    const isImage = file.type.startsWith('image');
    if (!isImage) {
      ElMessage.error(`${file.name} 不是一个图片文件`);
    }
    return isImage;
  },
  async httpRequest(options) {
    const file = options.file as File;
    if (file) {
      const result = await props.directory.createFile(file)
      if (result) {
        avatar.value = result.shareInfo()
        props.onChanged(JSON.stringify(result.shareInfo()))
      }
    }
  },
}

</script>

<template>
  <ElSpace>
    <div class="container">
      <ElImage
        v-if="avatar"
        :src="avatar.thumbnail"
        :preview-src-list="[avatar.shareLink]"
      />
      <TypeIcon v-else :iconType="typeName" :size="64" />
    </div>
    <template v-if="!readonly">
      <!-- TODO: -->
      <ElUpload v-bind="uploadProps">
        <ElButton 
          link
          type="primary"
        >
          上传图标
        </ElButton>
      </ElUpload>
      <ElButton v-if="avatar"
        type="primary"
        link
        @click="
          avatar=undefined;
          onChanged('');
        "
      >
        清除图标
      </ElButton>
    </template>
  </ElSpace>
</template>

<style lang='scss' scoped>
.container {
  width: 64px;
  height: 64px;
  border-radius: 10%;
  overflow: hidden;
}
</style>