<script setup lang='ts'>
import { FileItemShare } from '@/ts/base/model'
import { shareOpenLink } from '@/utils/tools'

const props = defineProps<{share: FileItemShare}>()
const src = computed(()=>shareOpenLink(props.share.shareLink))
</script>
<template>
  <div class="preview-image" v-if="share.shareLink">
    <ElImage
      fit="cover"
      :src="src"
      :preview-src-list="[src]"
      style="width: 100%;"
    >
      <template #placeholder>
        <ElImage :src="share.thumbnail" />
      </template>
    </ElImage>   
  </div>
</template>

<style lang='scss' scoped>
.preview-image {
  width: 100%;
  height: 100%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>