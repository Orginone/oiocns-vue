<!-- 转发弹框 -->
<script setup lang="ts">
import { MenuItemType } from '@/typings/globelType'
// import { ImSearch } from '@/icons/im'
import { Search,Close } from '@element-plus/icons-vue'
import orgCtrl from '@/ts/controller'
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { IMessage, ISession, MessageType } from '@/ts/core'
// import { AiOutlineClose } from '@/icons/ai'


const props = defineProps<{
  open: boolean
  selectMenu?: MenuItemType
  message: any
  btachType: string
  onCancel?: () => void
  onShow: (val: boolean) => void
}>()

const isShow = ref(props.open)
watch(() => props.open, (v) => {
  isShow.value = v
})

const { message, btachType } = props

const filter= ref<string>('')
// 对所有会话进行过滤和排序
const chats = computed(()=>{
  return orgCtrl.chats
    .filter((i) => i.isMyChat)
    .filter(
      (a) =>
        a.chatdata.chatName.includes(filter.value) ||
        a.chatdata.chatRemark.includes(filter.value) ||
        a.chatdata.labels.filter((l) => l.includes(filter.value)).length > 0,
    )
    .sort((a, b) => {
      var num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0);
      if (num === 0) {
        if (b.chatdata.lastMsgTime == a.chatdata.lastMsgTime) {
          num = b.isBelongPerson ? 1 : -1;
        } else {
          num = b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 5 : -5;
        }
      }
      return num;
    })
})


// 选中的会话数组
const selectedKeys = ref<string[]>([])
const selectedList = computed(() => {
  return orgCtrl.chats.filter((i) => selectedKeys.value.includes(i.key))
})

const handleCancel = () => {
  selectedKeys.value = []
  props.onShow(false)
}

const handleOk = () => {
  props.onShow(false)//////////////////////////////////
  if (btachType === 'single' || !btachType) {
    (selectedList.value as ISession[]).map(async (chat: ISession) => {
      message.map(async (msg: IMessage, idx: number) => {
        if (msg.forward && msg.forward.length) {
          await chat.sendMessage(message[idx].msgType, '', [], undefined, msg.forward)
        } else {
          await chat.sendMessage(message[idx].msgType, msg.msgBody, [], undefined, [])
        }
      })
    })
  }
  if (btachType === 'merge') {
    (selectedList.value as ISession[]).map(async (chat: ISession) => {
      await chat.sendMessage(MessageType.Forward, '', [], undefined, message);
    });
  }
  handleCancel()
}

</script>

<template>
  <ElDialog
    width="500px"
    top="25vh"
    v-model="isShow"
    :close-on-click-modal="false"
    destroy-on-close
    @close="handleCancel"
    modal-class="share-forward-dialog"
    :show-close="false"
  >
    <!-- 头部 -->
    <template #header="{ close }">
      <div class="share-forward-dialog-header">
        <div class="title">转发</div>
        <div class="close-btn" @click="close"><ElButton type="text" :icon="Close"></ElButton></div>
      </div>
    </template>
    <!-- body -->
    <div class="share-forward-dialog-body">
      <!-- 搜索栏 -->
      <div class="share-forward-search">
        <!-- 搜索框 -->
          <ElInput class="input"
            placeholder="搜索"
            :prefix-icon="Search"
            v-model="filter"
          />
      </div>
      <!-- 会话列表+已选会话列表 -->
      <div class="share-forward-list">
        <div class="all-session-list session-list">
            <ElCheckboxGroup v-model="selectedKeys">
              <div class="session-list-item" v-for="item in chats" :key="item.key">
                <ElCheckbox class="checkbox" :label="item.key" style="height: 64px;">
                  <TeamIcon
                    :typeName="item.metadata.typeName"
                    :entityId="item.sessionId"
                    :size="32"
                  />
                  <div class="name">{{item.chatdata.chatName}}</div>                
                </ElCheckbox>
              </div>
            </ElCheckboxGroup>
        </div>
        <div class="selected-session-list session-list">
          <div class="session-list-item" v-for="item in selectedList" :key="item.key">
            <div class="info">
              <TeamIcon
                :typeName="item.metadata.typeName"
                :entityId="item.sessionId"
                :size="32"
              />
              <div class="name">
                  <span style="margin-right: 10px;">
                    {{item.chatdata.chatName}}
                  </span>
              </div>              
            </div>

            <div class="closeBtn">
              <ElIcon>
                <Close style="cursor: pointer" @click="selectedKeys=[...selectedKeys.filter((key: string) => key !== item.key)]"/>
              </ElIcon>
            </div>
          </div>
        </div>          
      </div>
      <!-- 留言输入框 -->
      <textarea class="guest-book" placeholder="留言"></textarea>
    </div>
    <!-- footer -->
    <template #footer>
      <div class="share-forward-dialog-footer">
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleOk">发送</ElButton>        
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss" scoped>

.share-forward-dialog-header{
  height: 56px;
  border-bottom: 1px solid #E7E7E7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  .title {
    //styleName: Title/Medium;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    color: #000000E5;
  }
}
.share-forward-dialog-body {
  margin: 24px 0;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .share-forward-search {
    .input:deep(.el-input__wrapper) {
      box-shadow: none !important;
      height: 35px;
      padding: 3px 12px;
      border-radius: 8px;
      // TODO: color/surface/次要容器背景
      background-color: #F7F8FA;
    }
  }
  .share-forward-list {
    display: flex;
    gap: 10px;
    height: 200px;
    border-radius: 8px;
    padding: 10px 12px;
    .session-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;  
      overflow: auto; 
      .session-list-item {
        border-radius: 4px;
        padding: 8px 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        &:hover {
          background-color: #F7F8FA;
        }
        .name {
          //styleName: 14/CN-Medium;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 500;
          line-height: 22px;
          letter-spacing: 0em;
          text-align: left;
          // TODO: color/text & icon/text - color-1
          color: #15181D;
        }
      }   
    }
    .all-session-list {
      .checkbox{
        height: fit-content !important;
        &:deep(.el-checkbox__label) {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      }
    }
    .selected-session-list {
      .session-list-item {
        justify-content: space-between;
        .info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      }
    }
  }
  .guest-book {
    height: 100px;
    border-radius: 8px;
    // TODO: color/surface/分割线
    border: 1px solid #E7E8EB;
    outline: none;
    resize: none;
    padding: 12px;

    //styleName: 14/CN-Regular;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    // TODO: color/text & icon/text - color-3
    color: #6F7686;
  }
}
.share-forward-dialog-footer {
  display: flex;
  justify-content: end;
  border-top: 1px solid #E7E8EB;
  padding: 16px;
}
</style>

<style>
.share-forward-dialog {
  .el-dialog__header,.el-dialog__body,.el-dialog__footer {
    padding: 0;
  }
} 
</style>
