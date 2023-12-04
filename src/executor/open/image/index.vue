<script setup lang='ts'>
import { FileItemShare } from '@/ts/base/model'
import { shareOpenLink } from '@/utils/tools'

defineProps<{
  share: FileItemShare
  finished: () => void
}>()

</script>

<template>
  <ElImageViewer
    :url-list="[shareOpenLink(share.shareLink)]"
    v-if="share.shareLink"
    @close="finished"
  />
</template>

<style lang='scss' scoped>

</style>