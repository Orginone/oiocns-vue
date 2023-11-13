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
        <div v-html="truncateString(linkText(item.msgBody), 80)"></div>
      </div>
    </template>
  </template>
</template>

<style lang="scss" scoped>
// @import '@cfg/theme/variables';
// TODO:
// :global {
//   .ogo-popover-content {
//     .ogo-popover-arrow {
//       display: none;
//     }
//     .ogo-popover-inner {
//       .ogo-popover-inner-content {
//         display: flex;
//         flex-direction: column;
//         padding: 2px 3px;
//       }
//     }
//   }
//   // .ogo-popover-placement-bottom {
//   //   margin-top: -20px;
//   // }
// }
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
      .con_content_txt, .con_content_forward_txt {
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
      }

      .con_content_cite_txt {
        cursor: pointer;
        text-align: left;
        min-height: 30px;
        padding: 7px 10px;
        margin-top: 4px;
        color: black;
        border-radius: 6px;
        z-index: 1;
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

      &:hover {
        // TODO:
        // background-color: var(--el-bg-color-page);
        background-color: red;
      }
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

.msgAction {
  display: flex;
}

.actionIconStyl {
  color: #666;
  cursor: pointer;
  margin: 0 4px;
}

.actionIconStyl:hover {
  // TODO:
  // color: @primary-color;
  color: red;
}

.moreActionWrap {
  display: flex;
  flex-direction: column;
  .multiBtn {
    display: flex;
    align-items: center;
    padding: 6px;
  }
  .moreActionTxt {
    font-size: 12px;
  }
}
.multiSelectStyl {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

</style>
