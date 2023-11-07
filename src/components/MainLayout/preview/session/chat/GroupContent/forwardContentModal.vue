<!-- 转发消息弹框 -->
<script setup lang="ts">
import moment from 'moment'
import { showChatTime } from '@/utils/tools'

import { IMessage, MessageType } from '@/ts/core'
import { parseCiteMsg} from '@/views/Chats/components/parseMsg'
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import ShowMsg from './showMsg.vue'



const props = defineProps<{
  open: boolean;
  messages: IMessage[];
  title: string;
  isBelongPerson?: boolean;
  handleClose: () => void;
  viewForward?: (item: IMessage[]) => void;
}>()

const { open, title, isBelongPerson, handleClose, viewForward } = props


const isShow = ref(open)
watch(()=>props.open, (val) => {
  isShow.value = val
})

const isShowTime = (curDate: string, beforeDate: string) => {
  if (beforeDate === '') return true;
  return moment(curDate).diff(beforeDate, 'minute') > 3
}
</script>

<template>
  <ElDialog
    :title="title"
    v-model="isShow"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="chart_content">
      <div class="group_content_wrap">
        <template v-for="(item,index) in messages" :key="item.metadata.fromId + index">
          <!-- 聊天间隔时间3分钟则 显示时间 -->
          <div 
            v-if="isShowTime(item.createTime,index > 0 ? messages[index - 1].createTime: '')"  
            class="chats_space_Time"
          >
            <span>{{showChatTime(item.createTime)}}</span>
          </div>
          <!-- 聊天内容显示 -->
          <div 
            v-if="item.msgType != MessageType.Recall"
            :class="['con',!item.isMySend?'group_content_left':'group_content_right']"
          >
            <!-- loadMsgItem -->
            <ElPopover
              trigger="hover"
              :key="item.id"
              placement="bottom"
              :visible="false"
            >
              <template #reference>
                <div
                  class="con_body"
                  @contextmenu="e => {e.preventDefault();e.stopPropagation()}"
                >
                  <!-- 我的消息 -->
                  <template v-if="item.isMySend">
                    <div class="con_content">
                      <ShowMsg v-if="isBelongPerson" :item="item" :viewForward="viewForward"/>
                      <ElBadge
                        v-else
                        :key="item.id"
                        :value="item.comments"
                      >
                        <ShowMsg :item="item" :viewForward="viewForward"/>
                        <parseCiteMsg v-if="item.cite" :item="item.cite" />
                      </ElBadge>
                    </div>
                    <div style="color: #888">
                      <TeamIcon :entityId="item.metadata.fromId" :size="36" />
                    </div>
                  </template>
                  <!-- 别人的消息 -->
                  <template v-else>
                    <div style="color:#888;padding-right: 10px;">
                      <TeamIcon :entityId="item.metadata.fromId" :size="36" />
                    </div>
                    <div class="con_content">
                      <div class="name">{{item.from.name}}</div>
                      <ShowMsg :item="item" :viewForward="viewForward"/>
                      <parseCiteMsg v-if="item.cite" :item="item.cite" />
                    </div>
                  </template>   
                </div>
              </template>
            </ElPopover>
          </div>
        </template>
      </div>
    </div>
  </ElDialog>
</template>

<style lang="scss" scoped>
// @import '@cfg/theme/variables';
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
  height: 60vh;
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
      // .con_content_txt, .con_content_forward_txt {
      //   cursor: pointer;
      //   text-align: left;
      //   min-height: 30px;
      //   padding: 10px 16px;
      //   margin: 0px 0px;
      //   color: black;
      //   border-radius: 6px;
      //   z-index: 1;
      //   font-size: small;
      //   word-wrap: break-word;
      //   word-break: normal;
      //   line-height: 15px;
      // }

      // .con_content_cite_txt {
      //   cursor: pointer;
      //   text-align: left;
      //   min-height: 30px;
      //   padding: 7px 10px;
      //   margin-top: 4px;
      //   color: black;
      //   border-radius: 6px;
      //   z-index: 1;
      //   max-width: 300px;
      //   word-break: normal;
      //   font-size: 12px;
      //   color: #8a8a8a;
      //   box-shadow: inset 0 0 2px #e9e9e9;
      //   background-color: #ebebeb;
      //   .emoji {
      //     width: 20px;
      //     height: 20px;
      //     margin: 5px;
      //   }
      // }
      // .con_content_forward_txt {
      //   color: rgb(70, 70, 70);
      // }
      // .con_content_forward_session {
      //   font-size: 14px;
      //   font-weight: 500;
      //   color: rgb(10, 10, 10);
      //   // border-left: 2px solid orange;
      //   padding-right: 2px;
      //   margin-bottom: 6px;
      // }
      // .con_content_forward_msg {
      //   padding: 3px;
      // }
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
      // TODO:
      &:hover {
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
