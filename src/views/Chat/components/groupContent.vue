<template>
  <div class="group-content-wrap" ref="nodeRef" @scroll="scrollEvent">
    <template v-for="(item, index) in chat.curMsgs.value" :key="item.fromId">
      <!-- 聊天间隔时间3分钟则 显示时间 -->
      <div class="chats-space-Time" v-if="isShowTime(index)">
        <span>
          {{ showChatTime(item.createTime) }}
        </span>
      </div>
      <!-- 左侧聊天内容显示 -->
      <div class="group-content-left con recall" v-if="item.msgType === 'recall'">
        {{ chat.getName(item.fromId) }}撤回了一条消息
        <span class="reWrite" v-if="item.allowEdit" @click="handleReWrite(item.msgBody)">重新编辑</span>
      </div>

      <div class="group-content-left con" v-else-if="item.fromId !== chat.userId.value">
        <el-popover placement="top-end" :width="155" trigger="click" :hide-after="100" v-model:visible="item.edit"
          @show="editShow(item)">
          <template #reference>
            <div class="con-body">
              <HeadImg :name="chat.getName(item.fromId)" :label="''" />
              <div class="con-content">
                <span v-if="chat.curChat.value.typeName!=='人员'" class="con-content-name">{{
                chat.getName(item.fromId)
                }}</span>
                <div class="con-content-link"></div>
                <div class="con-content-txt" v-html="item.msgBody"></div>
              </div>
            </div>
          </template>
          <div class="flex justify-space-between mb-2 flex-wrap gap-2">
            <el-button type="warning" v-on:click="deleteMsg(item)" text v-if="canDelete(item)">删除
            </el-button>
          </div>
        </el-popover>
      </div>
      <!-- 右侧内容显示 -->
      <div class="group-content-right con" v-else>
        <el-popover placement="top-start" :width="155" trigger="click" :hide-after="100" v-model:visible="item.edit"
          @show="editShow(item)">
          <template #reference>
            <div class="con-body">
              <div class="con-content">
                <div class="con-content-link"></div>
                <div class="con-content-txt" v-html="item.msgBody"></div>
              </div>
              <HeadImg :name="chat.getName(item.fromId)" />
            </div>
          </template>
          <div class="flex justify-space-between mb-3 flex-wrap gap-3">
            <el-button type="primary" v-on:click="recallMsg(item)" text>撤回</el-button>
            <el-button type="warning" v-on:click="deleteMsg(item)" text v-if="canDelete(item)">删除
            </el-button>
          </div>
        </el-popover>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted,
  ref,
  nextTick,
  reactive,
  onBeforeUnmount,
  inject
} from 'vue'
import { debounce } from '@/utils/tools'
import HeadImg from '@/components/headImg.vue'
import moment from 'moment'
import {chat} from '@/module/chat/orgchat'
import { ElMessage } from 'element-plus'

// dom节点
const nodeRef = ref(null)
// 事件viewMoreMsg--查看更多 recallMsg--撤销消息
const emit = defineEmits(['handleReWrite'])

const info = inject('reWrite', ref(''))
// 重新编辑功能
const handleReWrite = (txt: string) => {
  info.value = txt
  emit('handleReWrite', txt)
}

const curShow = ref<any>(null)

const editShow = (item: any) => {
  if (item.chatId) {
    item.id = item.chatId
  }
  if (curShow.value && curShow.value.id !== item.id) {
    curShow.value.edit = false
  }
  curShow.value = item
}

const canDelete = (item: any) => {
  if (item.chatId) {
    return true
  }
  return item.spaceId === chat.userId.value
}

const recallMsg = (item: any) => {
  item.edit = false
  if (item.chatId) {
    item.id = item.chatId
    delete item.chatId
    delete item.sessionId
  }
  chat.recallMsg(item).then((res: ResultType) => {
    if (res.data.status != 2) {
      ElMessage({
        type: "warning",
        message: "只能撤回2分钟内发送的消息"
      })
    }
  })
}

const deleteMsg = (item: any) => {
  item.edit = false
  chat.deleteMsg(item)
}

const isShowTime = (index: number) => {
  if (index == 0) return true
  return moment(chat.curMsgs.value[index].createTime).
    diff(chat.curMsgs.value[index - 1].createTime, 'minute') > 3
}

// 显示聊天间隔时间
const showChatTime = (chatDate: moment.MomentInput) => {
  const cdate = moment(chatDate)
  const days = moment().diff(cdate, 'day')
  switch (days) {
    case 0:
      return cdate.format('H:mm')
    case 1:
      return "昨天 " + cdate.format('H:mm')
    case 2:
      return "前天 " + cdate.format('H:mm')
  }
  const year = moment().diff(cdate, 'year')
  if(year == 0){
    return cdate.format('M月D日 H:mm')
  }
  return cdate.format('yy年 M月D日 H:mm')
}

// 实时滚动条高度
const scrollTop = debounce(async () => {
  let scroll = nodeRef.value.scrollTop
  if (chat.curMsgs.value.length > 0 && scroll < 20) {
    let beforeHeight = nodeRef.value.scrollHeight
    let count = await chat.getHistoryMsg()
    if (count > 0) {
      nodeRef.value.scrollTop = nodeRef.value.scrollHeight - beforeHeight
    }
  }
}, 200)

// 滚动设置到底部
const goPageEnd = () => {
  nextTick(() => {
    // console.log('滚动底部', nodeRef.value.scrollHeight);
    nodeRef.value.scrollTop = nodeRef.value.scrollHeight
  })
}

const scrollEvent = () => {
  scrollTop(nodeRef.value.scrollTop)
}
// 暴露子组件方法
defineExpose({
  goPageEnd
})
</script>
<style>
.con-content-txt img {
  max-width: 100%;
  max-height: 400px;
}

.con-content-txt>span {
  line-height: 2;
}

.con-content-txt div {
  max-width: 100% !important;
  word-break: break-all;
  white-space: normal !important;
}
</style>
<style lang="scss" scoped>
.group-content-wrap {
  padding: 20px;
  background-color: var(--el-bg-color-page);
  transition: all 0.7s;

  .chats-space-Time {
    margin: 0 auto;
    text-align: center;

    span {
      border-radius: 4px;
      font-size: 12px;
      display: inline-block;
      border-radius: 4px;
      font-size: 12px;
      padding: 2px 8px;
      color: var(--el-text-color-placeholder);
    }
  }

  .user-head-img-wrap {
    margin-right: 0;
  }

  .history-more {
    text-align: center;
    color: var(--el-color-primary);
  }

  .con-body {
    max-width: 80%;
    display: flex;
    flex-direction: row;
  }

  .con {
    display: flex;
    // align-items: center;
    margin: 10px 0;

    &-img {
      height: 35px;
      width: 35px;
    }

    &-content {
      max-width: 50%;

      &-name {
        margin: 0 10px;
        font-size: 10px;
      }

      &-txt {
        min-height: 30px;
        padding: 10px;
        margin: 0 10px;
        color: black;
        background-color: white;
        border-radius: 5px;
        z-index: 1;
        margin-top: -10px;
        font-size: small;

      }

      &-link {
        width: 15px;
        height: 15px;
        display: inline-block;
        border-color: transparent;
        border-style: solid;
        border-width: 2px;
        position: relative;
        top: 15px;
        -moz-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        z-index: 0;
      }
    }
  }

  .recall {
    font-size: 12px;
    justify-content: center;

    .reWrite {
      margin-left: 4px;
      cursor: pointer;
      color: var(--el-color-primary);
    }
  }

  .group-content-left {
    cursor: pointer;

    .con-content {
      display: flex;
      max-width: 100%;
      margin-left: -10px;
      flex-direction: column;
      justify-content: flex-end;

      &-link {
        margin-left: 7px;
        background-color: var(--el-bg-color-overlay); // white;
        box-shadow: var(--el-box-shadow-lighter); // -1px 1px 6px 2px rgb(229 229 229);
      }

      &-txt {
        color: var(--el-text-color);
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter); // 0 0 5px 5px #e5e5e580;
        word-wrap: break-word;
        word-break: normal;
        max-width: 100%;
      }
    }
  }

  .group-content-right {
    justify-content: flex-end;
    cursor: pointer;

    .con-content {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;

      &-link {
        margin-right: 7px;
        background-color: #a2ddff;
        box-shadow: var(--el-box-shadow-lighter);
      }

      &-txt {
        text-align: left;
        background-color: #a2ddff;
        box-shadow: var(--el-box-shadow-lighter); // 0 0 3px 3px #e5e5e580;
        word-wrap: break-word;
        word-break: normal;
        max-width: 100%;
      }
    }
  }

  .context-text-wrap {
    position: absolute;
    background-color: var(--el-bg-color-overlay);
    width: 80px;
    height: max-content;
    border: 1px solid var(--el-box-shadow-lighter);
    z-index: 999;

    .context-menu-item {
      padding: 4px 6px;
      cursor: pointer;
      text-align: center;

      &:hover {
        background-color: var(--el-bg-color-page);
      }
    }
  }
}
</style>
