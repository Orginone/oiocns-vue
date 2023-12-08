<script setup lang="ts">

import { JolPlayer } from 'jol-player';
import { FileItemShare } from '@/ts/base/model';
import { shareOpenLink } from '@/utils/tools';
// import { FileUnknownOutlined } from '@ant-design/icons';
import { QuestionFilled } from '@element-plus/icons-vue';
import { command } from '@/ts/base';

const props = defineProps(
  {
    fileList: {
      type: Array as () => FileItemShare[],
      required: true
    },
    columns: {
      type: Number,
      default: 3
    },
  }
)

const computedSize = computed(() => {
  if (props.fileList.length >= props.columns) {
      return props.maxWidth / props.columns - 8;
    } else if (props.fileList.length > 1) {
      return props.maxWidth / props.fileList.length - 8;
    }
    return props.maxWidth - 8;
})


// 预览图片列表
const previewSrcList = computed(() => {
  return props.fileList.map((item) => shareOpenLink(item.shareLink))
})



</script>

<template>
  <template v-for="item in fileList" :key="item.shareLink">
    <!-- 图片 -->
    <div class="pic" v-if="item.contentType?.startsWith('image')">
      <ElImage
        style="width:100%;height: 100%;"
        fit='cover'
        :src="shareOpenLink(item.shareLink)"
        :preview-src-list="previewSrcList"
        :initial-index="previewSrcList.findIndex((src) => src === shareOpenLink(item.shareLink))"
        hide-on-click-modal
        :infinite="false"
        :preview-teleported="true"
      />
    </div>
    <!-- 视频 -->
    <div class="video" v-else-if="item.contentType?.startsWith('video')"
      @click="command.emitter('executor', 'open', item,'preview')"
    >
      <img :src="item.thumbnail">
    </div>
    <!-- pdf -->
    <iframe class="pdf" v-else-if="item.contentType?.includes('pdf') || item.contentType?.startsWith('text')"
      loading="eager"
      :name="item.name"
      :src="shareOpenLink(item.shareLink)"
    />
    <!-- 未知类型 -->
    <ElIcon v-else :size="computedSize"><QuestionFilled/></ElIcon>
  </template>
</template>

<style lang="scss" scoped>
.pic {
  border-radius: 11px;
  overflow: hidden;
  // TODO:
  width: 190px;
  height: 190px;
}
</style>
