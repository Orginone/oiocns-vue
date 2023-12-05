<script setup lang='ts'>

import { FileItemShare } from '@/ts/base/model'
import { shareOpenLink } from '@/utils/tools'


const props = defineProps<{
  share: FileItemShare
}>()

const options = reactive({
  src: shareOpenLink(props.share.shareLink)
})

</script>
<template>
  <div class="video-preview">
    <video controls class="video-preview-video">
      <source :src="options.src" type="video/mp4" />
      <source :src="options.src" type="video/webm" />
    </video>
  </div>
</template>

<style lang='scss' scoped>
.video-preview {
  width: 100%;
  height: 100%;
}
  .video-preview-video {
    max-width: 100%;
    max-height: 100%;
  }
</style>