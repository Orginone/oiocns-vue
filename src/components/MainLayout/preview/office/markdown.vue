<!-- markdown文件预览 -->
<script setup lang='ts'>
import { FileItemShare } from '@/ts/base/model'
import { shareOpenLink } from '@/utils/tools'
import axios from 'axios'
// TODO:
// import VueMarkdown from 'vue-markdown'

const props = defineProps<{
  share: FileItemShare
}>()

const loaded = ref(false)
const mdContent = ref('')

onMounted(() => {
  axios.get(shareOpenLink(props.share.shareLink)).then((res) => {
    loaded.value = true
    if (res.status === 200) {
      mdContent.value = res.data
    }
  })
})
</script>
<template>
  <strong v-if="share.size > 1024 * 1024 * 20" style="font-size: 20px;">文件太大,预览失败!</strong>
  <div v-loading="!loaded" element-loading-text="加载中，请稍后...">
    TODO: markdown插件 preview/office/markdown.vue
    <!-- <VueMarkdown 
      :source="mdContent"
    /> -->
  </div>
</template>

<style lang='scss' scoped>

</style>