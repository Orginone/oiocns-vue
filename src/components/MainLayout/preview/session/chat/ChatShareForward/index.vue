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
let chats = orgCtrl.chats
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


// 选中的会话数组
const selectedKeys = ref<string[]>([])
const selectedList = computed(() => {
  return chats.filter((i) => selectedKeys.value.includes(i.key))
})
// const selectedKeys=ref<string[]>([])
// const selectedData=ref<ISession[]>([])




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
      :title="'转发'"
      width="70%"
      top="30px"
      v-model="isShow"
      :close-on-click-modal="false"
      destroy-on-close
      @close="handleCancel"
    >
      <!-- 搜索和已选个数 -->
      <div class="searchAndChosen">
        <!-- 搜索框 -->
        <div class="chatMemberInput">
          <ElInput
            placeholder="搜索"
            :prefix-icon="Search"
            v-model="filter"
          />
        </div>
        <!-- 已选个数显示 -->
        <div class="chosenNum">
          {{`已选：${selectedKeys.length}会话`}}
        </div>
      </div>
      <div class="departLine">&nbsp;</div>
      <ElRow class="chatShareForwardModal">
        <!-- 左侧全部会话列表 -->
        <ElCol class="chatMember" :span="12">
          <div class="memberWrap">
            <ElCheckboxGroup v-model="selectedKeys">
              <ElRow class="chatMemlistRow" v-for="item in chats" :key="item.key">
                <ElCol class="chatMemlistCol" :span="24">
                  <ElCheckbox :label="item.key" style="height: 64px;">
                    <div class="listItem">
                        <ElBadge>
                          <TeamIcon
                            :typeName="item.metadata.typeName"
                            :entityId="item.sessionId"
                            :size="40"
                          />
                        </ElBadge>
                      <div>
                        <span style="margin-right: 10px;">
                          {{item.chatdata.chatName}}
                        </span>
                      </div>
                    </div>
                  </ElCheckbox>
                </ElCol>
              </ElRow>
            </ElCheckboxGroup>
          </div>
        </ElCol>
        <!-- 右侧选中的会话 -->
        <ElCol :span="12" class="chosenMember">
          <div class="chosenMemberWrap">
            <template v-for="item in selectedList" :key="item.key">
              <ElRow class="chatMemlistRow chosenListRow">
                <ElCol :span="24">
                  <div class="listItem">
                    <!-- 头像 -->
                      <ElBadge>
                        <TeamIcon
                          :typeName="item.metadata.typeName"
                          :entityId="item.sessionId"
                          :size="40"
                        />
                      </ElBadge>
                    <!-- 名称 -->
                    <div class="title">
                        <span style="margin-right: 10px;">
                          {{item.chatdata.chatName}}
                        </span>
                    </div>
                    <!-- 右侧叉叉 -->
                    <div class="closeBtn">
                      <ElIcon>
                        <Close style="cursor: pointer" @click="selectedKeys=[...selectedKeys.filter((key: string) => key !== item.key)]"/>
                      </ElIcon>
                    </div>
                    
                  </div>
                </ElCol>
              </ElRow>
              <!-- {/* <div className={css.forwardTextWrap}>{forwardShowText()}</div> */} -->
            </template>
          </div>
        </ElCol>
      </ElRow>
      <!-- FOOTER -->
      <template #footer>
        <ElButton @click="handleCancel">取消</ElButton>
        <ElButton type="primary" @click="handleOk">发送</ElButton>
      </template>
    </ElDialog>
</template>

<style lang="scss" scoped>

.chatShareForwardModal {
    position: relative;

    .listItem {
        min-width: 240px;
        display: flex;
        align-items: center;
        position: relative;
        .closeBtn {
          position: absolute;
          right: 5px;
        }
    }
    .chartMember {
        position: relative;
        margin-top: 5px;
        padding-top: 40px;
    }
}
.departLine {
    border-right: 1px solid #ebeef5;
    height: 400px;
    position: fixed;
    z-index: 99;
    left: 50%;
    background-color: rgba(0, 0, 0, 0);
}
.searchAndChosen {
    position: absolute;
    top: 0;
    height: 52px;
    margin-top: 13px;
    margin-left: 50px;
    background-color: transparent;
    z-index: 9;
    width: 80%;
    display: flex;
    .chatMemberInput, .chosenNum {
        flex: 1;
        height: 36px;
        font-size: 15px;
        vertical-align: middle;
    }
    .chosenNum {
        padding-left: 10px;
        vertical-align: middle;
        line-height: 36px;
    }
}

.chatMemlistRow {
    padding-left: 5px;
    padding-right: 5px;
    margin-left: 5px;
}
.chatMemlistRow:hover {
    background-color: rgb(248, 245, 245);
}
.chosenListRow {
    margin-left: 10px;
}
.chatMember {
    position: relative;
    padding-top: 40px;
    margin-top: 5px;
    padding-bottom: 10px;
    height: calc(400px);
}
.chosenMember {
    position: relative;
    margin-top: 5px;
    padding-top: 40px;
    height: calc(400px - 86px);
    // height: calc(100vh - 50vh - 76px);
}
.memberWrap {
    height: calc(400px);
    overflow-y: scroll;
    padding-bottom: 20px;
}
.chosenMemberWrap {
    // height: calc(100vh - 50vh - 76px);
    height: calc(400px - 86px);
    overflow-y: scroll;
    padding-bottom: 20px;
}


.forwardTextWrap {
    position: absolute;
    width: 100%;
    top: calc(400px - 60px);
    left: 5px;
    z-index: 999;
    background-color: #fff;
}
.forwardText {
    padding: 10px 10px;
    margin-left: 5px;
    height: 40px;
    overflow: hidden;
    background-color: rgb(226, 224, 224);
    border-radius: 5px;
    width: calc(100% - 15px);
}

</style>
