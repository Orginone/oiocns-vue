<!-- 显示消息 -->
<script setup lang="ts">
import { FileItemShare } from '@/ts/base/model'
import { IMessage,MessageType } from '@/ts/core'
import { parseAvatar,command } from '@/ts/base'
import { shareOpenLink, truncateString } from '@/utils/tools'
import { formatSize } from '@/ts/base/common'
import typeIcon from '@/components/Common/GlobalComps/typeIcon.vue'
import VoiceBar from './components/voiceBar.vue'
import parseCiteMsg from './parseCiteMsg.vue'

const props = defineProps<{
  item: IMessage
}>()

let isShowBubble = true

/** 文本处理,将链接处理成超链接*/
const linkText = (val: string) => {
  let reg = /(https?:\/\/[^\s]+)/g;
  return val.replace(reg, '<a target=_blank href="$1"> $1 </a>');
}

let img:FileItemShare = null
let file:FileItemShare = null
let url: string = null
let str: string = null
let imgUrls: string[] = null

switch (props.item.msgType) {
  case MessageType.Image: {
    img = parseAvatar(props.item.msgBody)
    isShowBubble = false
    break
  }
  case MessageType.Video: {
    img = parseAvatar(props.item.msgBody)
    isShowBubble = false
    break
  }
  case MessageType.File: {
    file = parseAvatar(props.item.msgBody)
    isShowBubble = false
    break
  }
  case MessageType.Voice: {
    const bytes = JSON.parse(props.item.msgBody).bytes
    const blob = new Blob([new Uint8Array(bytes)], { type: 'audio/mpeg' })
    url = URL.createObjectURL(blob)

  }
  default: {
    // 优化截图展示问题
    if (props.item.msgBody.includes('$IMG')) {
      str = props.item.msgBody
      const matches = [...str.matchAll(/\$IMG\[([^\]]*)\]/g)]
      // 获取消息包含的图片地址
      imgUrls = matches.map((match) => match[1]);
      // 替换消息里 图片信息特殊字符
      const willReplaceStr = matches.map((match) => match[0])
      willReplaceStr.forEach((strItem) => {
        str = str.replace(strItem, ' ')
      })
    }
  }
}
</script>

<template>
  <div class="con-content-wrap" :class="{'showBubble': isShowBubble}">
    <parseCiteMsg v-if="item.cite" :item="item.cite" />
    <div class="con-content-main">
      <template v-if="item.msgType === MessageType.Image">
        <ElImage 
          loading="lazy"
          :src="shareOpenLink(img.shareLink)" 
          :preview-src-list="[shareOpenLink(img.shareLink)]"
        />
      </template>
      <template v-else-if="item.msgType === MessageType.Video">
        <img :src="img.thumbnail" :width="300" @click="command.emitter('executor', 'open', img,'preview')" />
      </template>
      <template v-else-if="item.msgType === MessageType.File">
        <div class="con_content_file" 
          @click="command.emitter('executor', 'open', file,'preview')"
        >
          <div class="con_content_file_left">
            <typeIcon :iconType="file.contentType" :size="40" color="blue"/>
            <div class="file-info">
              <div class="file-name">{{file.name}}</div>
              <div class="file-size">{{formatSize(file.size)}}</div>          
            </div>
          </div>
          <div class="folder-icon">icon16</div>
      </div>
      </template>
      <template v-else-if="item.msgType === MessageType.Voice">
        <VoiceBar :src="url"/>
      </template>
      <template v-else>
        <!-- 包含图片 -->
        <div v-if="item.msgBody.includes('$IMG')">
          <ElImage
            v-for="(url,idx) in imgUrls" :key="idx"
            :src="url"
            :preview="[url]"
            :preview-src-list="[url]"
          />
            <p v-if="str.trim()" style="white-space: pre-wrap; margin: 0">{{str}}</p>
        </div>
        <!-- 纯文本 -->
        <div v-else 
          v-html="linkText(item.msgBody)"
        >
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>

img,:deep(img) {
  max-width: 100%;
  max-height: 400px;
}  
.showBubble {
  overflow-wrap: break-word;
  white-space: pre-wrap;
  padding: 8px 16px;
  border-radius: 8px;
  background-color:var(--con-bac,#F2F4F7);
  color: var(--con-txt,#1D2939);
  // styleName: 14/CN-Regular;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
}
.con_content_file {
  width: 240px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  //  TODO::color/surface/默认页面背景
  background-color: #EEEEF0;
  .con_content_file_left {
    display: flex;
    .file-info {
      display: flex;
      flex-direction: column;
      .file-name {
        //styleName: 14/CN-Medium;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0em;
        text-align: left;
        color: #15181D;
      }
      .file-size {
        //styleName: 12/CN-Regular;
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        letter-spacing: 0em;
        text-align: left;
        color: #15181D;
      }
    }
  }
}
</style>
