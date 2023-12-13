<script setup lang="ts">
import moment from 'moment'
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import Information from './information.vue'
import ForwardContentModal from './forwardContentModal.vue'
import { showChatTime} from '@/utils/tools'
import { IMessage, ISession, MessageType } from '@/ts/core'
import showMsg from './showMsg.vue'
import msgAction from './msgAction.vue'

const props = defineProps<{
  chat: ISession;
  // filter: string;
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

const body = ref(null)
/** 上一次聊天记录总高度 */
const beforescrollHeight=ref(0)
const forwardModalOpen=ref<boolean>(false) // 转发时用户
const forwardMessages=ref<IMessage[]>([])

// 监听消息变更，获取最新消息列表
onMounted(() => props.chat.onMessage((ms) => messages.value =([...ms])))
onBeforeUnmount(() => props.chat.unMessage())

// 滚动加载更多历史记录
const onScroll = async () => {
  if (!loading.value && body.value && props.chat && body.value.scrollTop === 0) {
    loading.value = true
    // 记录之前的聊天记录总高度
    beforescrollHeight.value = body.value.scrollHeight
    await props.chat.moreMessage()
    messages.value = [...props.chat.messages]
  }
}

// 滚动条的变动（监听消息列表的变动）
watch(messages,(newValue,oldValue) => {
  // 删除、撤回消息，滚动条不动
  if(newValue.length < oldValue.length) return
  if (loading.value) {// 加载历史记录，滚动条位于前一条记录处
    loading.value = false
    nextTick(()=>{
      body.value.scrollTop = body.value.scrollHeight - beforescrollHeight.value
    })
  } else {// 有新消息，滚动到底部
    nextTick(()=>{
      body.value.scrollTo({top:body.value.scrollHeight})
    })
  }
  // 记录聊天记录总高度
  beforescrollHeight.value = body.value.scrollHeight
})


/** 是否显示时间 */
const isShowTime = (curDate: string, beforeDate: string) => {
  if (beforeDate === '') return true
  return moment(curDate).diff(beforeDate, 'minute') > 3
}

// 转发消息查看对话框关闭前的回调
const handleForwadModalClose = () => {
  forwardModalOpen.value = false
  forwardMessages.value = []
}
// 查看转发消息
const viewForward = (item: IMessage[]) => {
  console.log('1111');
  
  forwardModalOpen.value = true
  forwardMessages.value = item
}

</script>

<template>
  <div class="chart_content" ref="body" @scroll="onScroll" element-loading-text="加载中..." v-loading="loading">
    <div class="group_content_wrap">
      <template v-for="(item,index) in messages" :key="item.id">
        <!-- 时间 -->
        <div class="chats_space_Time" v-if="isShowTime(item.createTime,index > 0 ? messages[index - 1].createTime : '')">
          <span>{{showChatTime(item.createTime)}}</span>
        </div>
        <!-- 撤回 -->
        <div v-if="item.msgType===MessageType.Recall" class="con recall">
          {{item.msgBody}}
            <span
              v-if="item.allowEdit"
              class="reWrite"
              @click="handleReWrites(item.msgSource)"
            >
              重新编辑
            </span>
        </div>
        <!-- 通知 -->
        <div v-else-if="item.msgType===MessageType.Notify" class="con recall">
          {{item.msgBody}}
        </div>
        <!-- 普通消息 -->
        <div v-else class="con" :class="item.isMySend ?'group_content_right' : 'group_content_left'">
          <div class="con_body"
            @contextmenu="(e) => {e.preventDefault();e.stopPropagation()}"
          >
            <!-- 多选的选择框 -->
            <ElCheckbox class="multiSelectStyl" v-if="props.multiSelectShow"
              @change="(val)=>multiSelectMsg(item,val as boolean)"
            />
            <div class="viewMsg">
              <!-- 我的消息 -->
              <div v-if="item.isMySend" style="display: flex;gap: 16px;justify-content: end;"> 
                <div class="con_content">             
                  <ElPopover
                    trigger="hover"
                    :key="item.id"
                    placement="left-start"
                    :popper-style="{ padding: '3px' }"
                    :show-arrow="false"
                    popper-class="message-popover"
                  >
                    <template #reference>
                      <div>
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
                      </div>
                    </template>                  
                    <!-- 气泡展示内容 -->
                    <template #default>
                      <msgAction :item="item" :citeText="citeText" :chat="chat" :forward="forward" :multiSelectFn="multiSelectFn"/>
                    </template>
                  </ElPopover>
                  <!-- TODO:已读、未读 -->
                  <!-- <div
                        :class="item.readedinfo.includes('已读') ? 'information readed' : 'information'"
                        @click="setInfoMsg(item)"
                      >
                        {{item.readedinfo}}
                      </div> -->                  
                </div>   
                <div class="con_avatar">
                  <TeamIcon :entityId="item.metadata.fromId" :size="32" />
                </div>
              </div>
              <!-- 他人的消息 -->
              <div v-else style="display: flex;gap:16px;">
                <div class="con_avatar">
                  <TeamIcon :entityId="item.metadata.fromId" :size="32" />
                </div>
                <div class="con_content">
                  <div class="name">{{item.from.name}}</div>
                  <ElPopover
                    :show-arrow="false"
                    trigger="hover"
                    :key="item.id"
                    placement="right-start"
                    :popper-style="{ padding: '3px' }"
                    popper-class="message-popover"
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
                </div>
              </div>
            </div>
          </div>
        </div>            
      </template>
    </div>
  </div>
  <!-- 已读未读列表 -->
  <Information v-if="infoMsg" :msg="infoMsg"  @close="setInfoMsg(null)"/>  
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
</template>


<style lang="scss" scoped>
.chart_content {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden ;
  position: relative;
  &::-webkit-scrollbar {
    background-color: transparent;
  }
}
.group_content_wrap {
  transition: all 0.7s;
  .chats_space_Time {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    //styleName: 12/CN-Regular;
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;

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
  .recall {
    font-size: 12px;
    justify-content: center;

    .reWrite {
      margin-left: 4px;
      cursor: pointer;
      color: #3e5ed8;
    }
  }  
  .con {
    display: flex;
    padding: 8px 0;
    .con_body {
      width: 100%;
      display: flex;
      .multiSelectStyl {
        display: flex;
        align-items: center;
        height: 100%;
        margin-right: 10px;
      }      
      .viewMsg {
        width: 100%;
        .con_content {
          max-width: 90%;
          cursor: pointer;
          .name {
            font-size: 12px;
            margin: 0 0 4px 4px;
            color: #888;
          }
        }
      }
    }    
  }  

  // 他人消息
  .group_content_left {
  }
  // 我的消息
  .group_content_right {
    justify-content: flex-end;
    // TODO: color/brand/Disabled
    --con-bac: #B5C7FF;
    //  TODO: color/text & icon/text - color-1
    --con-txt: #15181D;
  }
}

</style>
<style>
.message-popover {
  border-radius: 4px !important;
  /* TODO: color/surface/分割线 */
  border: 0.5px solid #E7E8EB !important;
  padding: 0 !important;
  width: fit-content !important;
  min-width: 0 !important;
  box-shadow: none !important;

  /* background-color: black !important; */
}
</style>
