<!-- 文件预览（office、markdown） -->
<script setup lang='ts'>

// import { SheetViewer, DocxViewer } from 'react-office-viewer';
import { FileItemShare } from '@/ts/base/model';
// import Markdown from './markdown';
import { shareOpenLink } from '@/utils/tools';

const props = defineProps<{
  share: FileItemShare
}>()

// TODO:
const config = {
  locale: 'zh',
  timeout: 5000,
  fileName: props.share.name,
  file: shareOpenLink(props.share.shareLink),
}
</script>

<template>
  <div class="office-preview" v-if="share.shareLink">
    <template v-if="['.xls','.xlsx'].includes(share.extension)">
      TODO:C:\Users\zjdex\Desktop\11-8\src\components\MainLayout\preview\office\index.vue
      <!-- <SheetViewer {...config} /> -->
    </template>
    <template v-else-if="share.extension === '.docx'">
      TODO:<DocxViewer {...config} />
    </template>
    <template v-else-if="share.extension === '.pdf'">
      <iframe
        :width="'100%'"
        :height="'100%'"
        loading="eager"
        :name="share.name"
        :src="shareOpenLink(share.shareLink)"
      />      
    </template>
    <template v-else-if="share.extension === '.md'">
      TODO:<Markdown share={share} />
    </template>
  </div>  
</template>
<style lang='scss' scoped>
  .office-preview {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
</style>