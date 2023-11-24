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
    TODO:MainLayout/preview/video
  </div>
</template>

<style lang='scss' scoped>

</style>