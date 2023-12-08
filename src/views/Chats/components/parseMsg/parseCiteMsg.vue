<script setup lang="ts">

import { MessageType, IMessage } from '@/ts/core';
import { FileItemShare } from '@/ts/base/model';
import { parseAvatar } from '@/ts/base'
import { formatSize } from '@/ts/base/common'
import { shareOpenLink, truncateString } from '@/utils/tools'

/** 将链接转化为超链接 */
const linkText = (val: string) => {
  let reg = /(https?:\/\/[^\s]+)/g;
  return val.replace(reg, '<a target=_blank href="$1"> $1 </a>');
}

const img = ref<FileItemShare>()
const file = ref<FileItemShare>()
/** 语音地址 */
const url = ref<string>()
const str = ref<string>()
/** 消息包含的图片地址数组 */
const imgUrls = ref<string[]>()

const props = defineProps<{item: IMessage}>()

switch (props.item.msgType) {
  case MessageType.Image: {
    img.value = parseAvatar(props.item.msgBody)
    break
  }
  case MessageType.File: {
    file.value = parseAvatar(props.item.msgBody)
    break
  }
  case MessageType.Voice: {
    const bytes = JSON.parse(props.item.msgBody).bytes
    const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' })
    url.value = URL.createObjectURL(blob)
    break
  }
  default: {
    // 优化截图展示问题
    if (props.item.msgBody.includes('$IMG')) {
      str.value = props.item.msgBody
      const matches = [...str.value.matchAll(/\$IMG\[([^\]]*)\]/g)]
      // 获取消息包含的图片地址
      imgUrls.value = matches.map((match) => match[1])
      // 替换消息里 图片信息特殊字符
      const willReplaceStr = matches.map((match) => match[0])
      willReplaceStr.forEach((strItem) => {
        str.value = str.value.replace(strItem, ' ')
      })
    }
  }
}

</script>

<template>
  <!-- 图片 -->
  <template v-if="item.msgType === MessageType.Image">
    <!-- 有缩略图,可预览 -->
    <div v-if="img && img.thumbnail" class="con_content_cite_txt">
      <span>{{item.from.name}}:</span>
      <ElImage
        :src="img.thumbnail"
        :preview-src-list="[shareOpenLink(img.shareLink)]"
      />
    </div>
    <!-- 无图片数据或无缩略图，显示异常 -->
    <div v-else class="con_content_cite_txt">消息异常</div>
  </template>
  <!-- 文件 -->
  <template v-else-if="item.msgType === MessageType.File">
    <div class="con_content_cite_txt">
      <span>{{item.from.name}}:</span>
      <a :href="shareOpenLink(file.shareLink, true)" title="点击下载">
        <div>
          <b>{{file.name}}</b>
        </div>
        <div>{{formatSize(file.size)}}</div>
      </a>
    </div>
  </template>
  <!-- 语音 -->
  <template v-else-if="item.msgType === MessageType.Voice">
    <div class="con_content_cite_txt">
      <span>{{item.from.name}}:</span>
      <div class="voiceStyle">
        <audio :src="url" controls />
      </div>
    </div>
  </template>
  <!-- 默认 -->
  <template v-else>
    <!-- 有截图,垂直展示截图信息。把文字消息统一放在底部 -->
    <template v-if="item.msgBody.includes('$IMG')">
      <div class="con_content_cite_txt">
        <span>{{item.from.name}}:</span>
        <ElImage
          v-for="(url, idx) in imgUrls" :key="idx"
          class="cut_img"
          :src="url"
          :preview-src-list="[url]"
        />
        <p v-if="str.trim()" style="white-space: pre-wrap; margin: 0">{{str}}</p>
      </div>
    </template>
    <!-- 无截图，展示默认文字 -->
    <template v-else>
      <div class="con_content_cite_txt">
        <span>{{item.from.name}}:</span>
        <span v-html="truncateString(linkText(item.msgBody), 80)"></span>
      </div>
    </template>
  </template>
</template>

<style lang="scss" scoped>
  .con_content_cite_txt {
    //styleName: 14/CN-Regular;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    // TODO: color/text & icon/text - color-3
    color: #6F7686;
  }
</style>
