<script setup lang='ts'>

// import { SheetViewer, DocxViewer } from 'react-office-viewer';
import { FileItemShare } from '@/ts/base/model';
import Markdown from './markdown';
import { shareOpenLink } from '@/utils/tools';

const props = defineProps<{
  share: FileItemShare
}>()

// const LoadViewer = () => {
//       const config = {
//         locale: 'zh',
//         timeout: 5000,
//         fileName: share.name,
//         file: shareOpenLink(share.shareLink),
//       };
//       switch (share.extension) {
//         case '.xls':
//         case '.xlsx':
//           return <SheetViewer {...config} />;
//         case '.docx':
//           return <DocxViewer {...config} />;
//         case '.pdf':
//           return (
//             <iframe
//               width={'100%'}
//               height={'100%'}
//               loading="eager"
//               name={share.name}
//               src={shareOpenLink(share.shareLink)}
//             />
//           );
//         case '.md':
//           return <Markdown share={share} />;
//       }
</script>
<template>
  <div class="office-preview" v-if="share.shareLink">
    TODO:office文件预览
  </div>
</template>

<style lang='scss' scoped>

</style>