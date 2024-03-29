<!-- 显示消息 -->
<script setup lang="ts">
import { FileItemShare } from '@/ts/base/model'
import { IMessage,MessageType } from '@/ts/core'
import { parseAvatar,command } from '@/ts/base'
import { shareOpenLink, truncateString } from '@/utils/tools'
import { formatSize } from '@/ts/base/common'
import typeIcon from '@/components/Common/GlobalComps/typeIcon.vue'

const props = defineProps<{
  item: IMessage
}>()

/** 将链接转化为超链接 */
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
    break
  }
  case MessageType.Video: {
    img = parseAvatar(props.item.msgBody)
    break
  }
  case MessageType.File: {
    file = parseAvatar(props.item.msgBody)
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
  <!-- 图片 -->
  <template v-if="item.msgType === MessageType.Image">
    <!-- 有共享链接 -->
    <div 
      v-if="img && img.shareLink"
      class="con_content_txt"
    >
      <ElImage 
        loading="lazy"
        :src="shareOpenLink(img.shareLink)" 
        :preview-src-list="[shareOpenLink(img.shareLink)]"
        style="width: 300px;"
      />
    </div>
    <!-- 无数据或无共享链接 -->
    <div v-else class="con_content_txt">消息异常</div>
  </template>
  <!-- 视频 -->
  <template v-else-if="item.msgType === MessageType.Video">
    <!-- 有共享链接 -->
    <div 
      v-if="img && img.shareLink"
      class="con_content_txt"
      @click="command.emitter('executor', 'open', img,'preview')"
      
    >
      <img :src="img.thumbnail" :width="300"/>
    </div>
    <!-- 无数据或无共享链接 -->
    <div v-else class="con_content_txt">消息异常</div>
  </template>
  <!-- 文件 -->
  <template v-else-if="item.msgType === MessageType.File">
    <!-- 无数据 -->
    <div v-if="!file" class="con_content_txt" style="color: #af1212">
      文件消息异常
    </div>
    <!-- 有数据 -->
    <div
      v-else
      class="con_content_txt"
      @click="command.emitter('executor', 'open', file,'preview')"
    >
      <div style="display: flex;">
        <div style="margin-right: 5px;">
          <div>{{file.name}}</div>
          <div style="font-size: 12px;color: rgba(0, 0, 0, 0.45);">{{formatSize(file.size)}}</div>
        </div>
        <typeIcon :iconType="file.contentType" :size="28" color="blue"/>
      </div>
    </div>
  </template>
  <!-- 语音 -->
  <template v-else-if="item.msgType === MessageType.Voice">
    <div class="voiceStyle">
      <audio :src="url" controls />
    </div>
  </template>
  <!-- 文本 | 纯图片 | 文本+图片 -->
  <template v-else>
    <!-- 包含图片 -->
    <div v-if="item.msgBody.includes('$IMG')" class="con_content_txt">
      <ElImage
        v-for="(url,idx) in imgUrls" :key="idx"
        :src="url"
        :preview="[url]"
        :preview-src-list="[url]"
      />
        <p v-if="str.trim()" style="white-space: pre-wrap; margin: 0">{{str}}</p>
    </div>
    <!-- 纯文本 -->
    <div v-else class="con_content_txt">
      <div v-html="linkText(item.msgBody)"></div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.chart_content {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #f2f2f2;
  position: relative;
}
.group_content_wrap {
  padding: 20px;
  transition: all 0.7s;
  .chats_space_Time {
    margin: 0 auto;
    text-align: center;

    span {
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      border-radius: 4px;
      font-size: 12px;
      padding: 2px 8px;
      color: #a8abb2;
    }
  }

  .user_head_img_wrap {
    margin-right: 0;
  }

  .history_more {
    text-align: center;
    color: var(--el-color-primary);
  }

  .con_body {
    max-width: 40vw;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
  }

  .con {
    display: flex;
    flex-direction: row;
    margin: 20px 0;
    .con_img {
      height: 35px;
      width: 35px;
    }
    img {
      max-width: 100%;
      max-height: 400px;
    }
    .con_content {
      max-width: 50%;
      .name {
        font-size: 12px;
        padding-left: 4px;
        color: #888;
      }
      .con_content_txt, .con_content_forward_txt,.con_content_cite_txt {
        cursor: pointer;
        text-align: left;
        min-height: 30px;
        padding: 10px 16px;
        margin: 0px 0px;
        color: black;
        border-radius: 6px;
        z-index: 1;
        font-size: small;
        word-wrap: break-word;
        word-break: normal;
        line-height: 15px;
        :deep(a){
          color: #154ad8;
        }
      }

      .con_content_cite_txt {
        padding: 7px 10px;
        margin-top: 4px;
        max-width: 300px;
        word-break: normal;
        font-size: 12px;
        color: #8a8a8a;
        box-shadow: inset 0 0 2px #e9e9e9;
        background-color: #ebebeb;
        .emoji {
          width: 20px;
          height: 20px;
          margin: 5px;
        }
      }
      .con_content_forward_txt {
        color: rgb(70, 70, 70);
      }
      .con_content_forward_session {
        font-size: 14px;
        font-weight: 500;
        color: rgb(10, 10, 10);
        // border-left: 2px solid orange;
        padding-right: 2px;
        margin-bottom: 6px;
      }
      .con_content_forward_msg {
        padding: 3px;
      }
    }
  }

  .recall {
    font-size: 12px;
    justify-content: center;

    .reWrite {
      margin-left: 4px;
      cursor: pointer;
      color: #3e5ed8;
    }
  }

  .group_content_left {
    position: relative;
    .con_content {
      max-width: 100%;
      overflow: hidden;
      flex-direction: column;
      justify-content: flex-end;
      .con_content_txt, .con_content_forward_txt {
        background-color: white;
        max-width: 100%;
        box-shadow: inset 0 0 2px #cacaca;
      }
    }
  }

  .group_content_right {
    justify-content: flex-end;
    position: relative;
    .con_content {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      .con_content_txt, .con_content_forward_txt {
        background-color: #b4ccf9;
        margin-right: 10px;
        max-width: 100%;
        box-shadow: inset 0 0 2px #9292ff;
      }
      .information {
        padding-right: 10px;
        cursor: pointer;
        color: #3e5ed8;
        transform: scale(0.8);
        font-weight: 700;
      }
      .readed {
        color: #888;
      }
    }
    .multiSelectStyl {
      position: absolute;
      left: 0;
    }
  }

  .context_text_wrap {
    position: absolute;
    // background-color: var(--el-bg-color-overlay);
    width: 80px;
    height: max-content;
    border: 1px solid var(--el-box-shadow-lighter);
    z-index: 999;

    .context_menu_item {
      padding: 4px 6px;
      cursor: pointer;
      text-align: center;

      // &:hover {
      //   // background-color: var(--el-bg-color-page);
      // }
    }
  }
}
.moreInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: flex-start;

  li {
    padding: 10px 2px;
  }
}

.operate {
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  align-content: flex-start;
}

.voiceStyle {
  audio {
    width: 200px;
    height: 40px;
    overflow-x: hidden;
  }

  audio::-webkit-media-controls-start-playback-button,
  audio::-webkit-media-controls-end-playback-button,
  audio::-webkit-media-controls-mute-button,
  audio::-webkit-media-controls-timeline,
  audio::-webkit-media-controls-volume-slider,
  audio::-webkit-media-controls-overflow-button {
    display: none !important;
  }
  /* 自定义时间显示样式 */
  audio.time-display {
    color: #666;
    font-size: 10px;
  }
}
</style>
