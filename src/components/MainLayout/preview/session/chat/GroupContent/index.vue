<script setup lang="ts">
/* eslint-disable no-unused-vars */
import moment from 'moment'
// import { CopyToClipboard } from 'react-copy-to-clipboard'
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import Information from './information.vue'
import ForwardContentModal from './forwardContentModal.vue'
import { showChatTime} from '@/utils/tools'
import { IMessage, ISession, MessageType } from '@/ts/core'
import {parseCiteMsg} from '@/views/Chats/components/parseMsg'
// import { RiShareForwardFill } from '@/icons/ri';
// import { BsListCheck } from '@/icons/bs';
// import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import showMsg from './showMsg.vue'
import msgAction from './msgAction.vue'

const props = defineProps<{
  chat: ISession;
  filter: string;
  handleReWrites: Function;
  /** 返回值，引用 */
  citeText: any;
  /** 点击转发回调 */
  forward: any;
  /** 回车设置引用消息 */
  enterCiteMsg: IMessage;
  /** 是否显示多选 */
  multiSelectShow: boolean;
  multiSelectMsg: (item: IMessage, checked: boolean) => void;
  multiSelectFn: (multi: boolean) => void;
}>()

const loading=ref(false)
const infoMsg=ref<IMessage>(undefined)
const setInfoMsg = (info: IMessage) => {
  infoMsg.value = info 
}

const messages=ref<IMessage[]>(props.chat.messages)

// const filteredMessages = computed(() => {
//   return messages.value.filter((i) => i.msgBody.includes(props.filter))
// })
const body = ref(null)
const beforescrollHeight=ref(0);
const forwardModalOpen=ref<boolean>(false) // 转发时用户
const forwardMessages=ref<IMessage[]>([])
// const multiSelect=ref(props.multiSelectShow)

// 监听消息变更
onMounted(() => {
  // 监听消息变更
  props.chat.onMessage((ms) => messages.value =([...ms]))
  // 设置初始滚动条位置为最底部
  if (body && body.value) {
    if (loading) {
      loading.value = false
      body.value.scrollTop = body.value.scrollHeight - beforescrollHeight.value
    } else {
      body.value.scrollTop = body.value.scrollHeight;
    }
  }
})
onBeforeUnmount(() => {
  // 取消监听消息变更通知
  props.chat.unMessage();
})

// 是否显示时间
const isShowTime = (curDate: string, beforeDate: string) => {
  if (beforeDate === '') return true
  return moment(curDate).diff(beforeDate, 'minute') > 3
}
// 滚动事件
const onScroll = async () => {
  if (!loading.value && body.value && props.chat && body.value.scrollTop < 10) {
    loading.value = true
    beforescrollHeight.value = body.value.scrollHeight
    await props.chat.moreMessage()
    messages.value = [...props.chat.messages]
    loading.value=false
  }
}

// 转发消息查看对话框关闭前的回调
const handleForwadModalClose = () => {
  forwardModalOpen.value = false
  forwardMessages.value = []
}
// 查看转发消息
const viewForward = (item: IMessage[]) => {
  forwardModalOpen.value = true
  forwardMessages.value = item
}

</script>

<template>
  <div class="chart_content" ref="body" :onScroll="onScroll" element-loading-text="加载中..." v-loading="loading">
    <div>
      <!-- 聊天内容区 -->
      <div class="group_content_wrap">
        <template
          v-for="(item,index) in messages.filter((i) => i.msgBody.includes(props.filter))"
          :key="item.id">
          <!-- 聊天间隔时间3分钟则 显示时间 -->
          <div class="chats_space_Time"
            v-if="isShowTime(item.createTime,index > 0 ? messages[index - 1].createTime : '')"
          >
            <span>{{showChatTime(item.createTime)}}</span>
          </div>
          <!-- 渲染消息 -->
          <div class="renderMessage">
            <!-- 撤回消息 -->
            <div v-if="item.msgType===MessageType.Recall" class="group_content_left con recall">
              {{item.msgBody}}
                <span
                  v-if="item.allowEdit"
                  class="reWrite"
                  @click="handleReWrites(item.msgSource)"
                >
                  重新编辑
                </span>
            </div>
            <!-- Notify消息 -->
            <div v-else-if="item.msgType===MessageType.Notify" class="group_content_left con recall">
              {{item.msgBody}}
            </div>
            <!-- 普通消息 -->
            <div v-else :class="item.isMySend ?'group_content_right con' : 'group_content_left con'">
              <div
                class="con_body"
                @contextmenu="(e) => {e.preventDefault();e.stopPropagation()}"
              >
                <!-- 多选转发的选择框 -->
                <ElCheckbox
                  v-if = "props.multiSelectShow"
                  class="multiSelectStyl"
                  @change="(val)=>multiSelectMsg(item,val as boolean)"
                />
                <!-- 消息体 -->
                <div class="viewMsg">
                  <!-- 我的消息 -->
                  <ElPopover
                    v-if="item.isMySend"
                    trigger="hover"
                    :key="item.id"
                    placement="top-start"
                    :popper-style="{ padding: '3px' }"
                    :show-arrow="false"
                  >
                    <!-- 消息内容 -->
                    <template #reference>
                      <div style="display: flex;">
                        <div class="con_content">
                          <!-- 消息发送者可见 -->
                          <template v-if="chat.isBelongPerson">
                            <showMsg :item="item" :view-forward="viewForward"/> 
                          </template>
                          <!-- 非消息发送者可见 -->
                          <template v-else>
                            <ElBadge
                              :key="item.id"
                              :value="item.comments"
                            >
                              <showMsg :item="item" :view-forward="viewForward"/> 
                              <!-- 引用消息 -->
                              <parseCiteMsg v-if="item.cite" :item="item.cite" />
                            </ElBadge>
                          </template>
                          <!-- 已读、未读 -->
                          <div
                            :class="item.readedinfo.includes('已读') ? 'information readed' : 'information'"
                            @click="setInfoMsg(item)"
                          >
                            {{item.readedinfo}}
                          </div>
                        </div>
                        <div style="color: #888">
                          <TeamIcon :entityId="item.metadata.fromId" :size="36" />
                        </div>
                      </div>
                    </template>                  
                    <!-- 气泡展示内容 -->
                    <template #default>
                      <msgAction :item="item" :citeText="citeText" :chat="chat" :forward="forward" :multiSelectFn="multiSelectFn"/>
                    </template>
                  </ElPopover>
                  <!-- 别人的消息 -->
                  <div v-else style="display: flex;">
                    <div>
                      <TeamIcon :entityId="item.metadata.fromId" :size="36" />
                    </div>
                    <div class="con_content">
                      <div class="name">{{item.from.name}}</div>
                      <ElPopover
                        :show-arrow="false"
                        trigger="hover"
                        :key="item.id"
                        placement="top-start"
                        :popper-style="{ padding: '3px' }"
                      >
                        <template #reference>
                          <div>
                            <showMsg :item="item" :viewForward="viewForward"/>
                          </div>
                        </template>
                        <template #default>
                          <msgAction :item="item" :citeText="citeText" :chat="chat" :forward="forward" :multiSelectFn="multiSelectFn"/>
                        </template>
                      </ElPopover>
                      <parseCiteMsg v-if="item.cite" :item="item.cite"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>            
          </div>
        </template>
      </div>
      <!-- 已读未读列表 -->
      <Information v-if="infoMsg" :msg="infoMsg"  @close="setInfoMsg(null)"/>
    </div>
    <!-- 查看详细转发消息的对话框 -->
    <ForwardContentModal
      v-if="forwardMessages.length>1"
      :handleClose="handleForwadModalClose"
      :open="forwardModalOpen"
      :messages="forwardMessages"
      :isBelongPerson="true"
      title=''
      :viewForward="viewForward"
    />
  </div>
</template>


<style lang="scss" scoped>
// TODO:
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
  // .ogo-popover-placement-bottom {
  //   margin-top: -20px;
  // }
// }
.chart_content {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #f2f2f2;
  position: relative;
}
.group_content_wrap {
  
  overflow: auto;
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
        // background-color: var(--el-bg-color-page);
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

// .msgAction {
//   display: flex;
//   width: 100%;
//   justify-content: space-around;
// }

// .actionIconStyl {
//   color: #666;
//   cursor: pointer;
//   margin: 0 4px;
// }

// .actionIconStyl:hover {
//   color: @primary-color;
// }

// .moreActionWrap {
//   display: flex;
//   flex-direction: column;
//   .multiBtn {
//     display: flex;
//     align-items: center;
//     padding: 6px;
//   }
//   .moreActionTxt {
//     font-size: 12px;
//   }
// }
.multiSelectStyl {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

</style>
