<!-- 消息popover菜单的内容 -->
<script setup lang="ts">
import { IMessage, ISession } from '@/ts/core'
import { ElMessage } from 'element-plus'
import copy from "copy-to-clipboard"
import { CopyDocument,ChatDotRound,Promotion,MoreFilled,Back,Delete,Check,Download} from '@element-plus/icons-vue'
import { parseAvatar } from '@/ts/base'
import { showChatTime, downloadByUrl, shareOpenLink } from '@/utils/tools'

const props = defineProps<{
  item: IMessage
  citeText: any
  chat: ISession
  forward: any
  multiSelectFn: (multi: boolean) => void
}>()

</script>

<template>
<div class="msgAction">
  <ElTooltip content="复制" placement="top">
    <ElIcon :size="19" class="actionIconStyl" 
      @click="copy(item.msgBody) && ElMessage.success('复制成功')"
    >
      <CopyDocument/>
    </ElIcon>
  </ElTooltip>
  <ElTooltip content="引用" placement="top">
    <ElIcon :size="19" class="actionIconStyl" @click="citeText(item)">
      <ChatDotRound/>
    </ElIcon>
  </ElTooltip>
  <ElTooltip content="转发" placement="top" >
    <ElIcon :size="19" class="actionIconStyl" @click="forward(item)">
      <Promotion/>
    </ElIcon>
  </ElTooltip>
  <ElTooltip v-if="item.isMySend && item.allowRecall" content="撤回" placement="top">
    <ElIcon :size="19" class="actionIconStyl" @click="async () => await props.chat.recallMessage(item.id)">
      <Back/>
    </ElIcon>
  </ElTooltip>
  <ElTooltip content="更多" placement="top">
    <div>
      <ElPopover
        placement="bottom-end"
        trigger="click"
        :show-arrow="false"
      >                           
        <template #reference>
          <ElIcon :size="19" class="actionIconStyl"><MoreFilled/></ElIcon>                   
        </template>
        <!-- 更多气泡展示的内容 -->
        <template #default>
          <div class="moreActionWrap">
            <!-- 删除 -->
            <ElButton
              v-if="chat.canDeleteMessage"
              type="text"
              class="multiBtn"
              @click="async () => {
                if (await props.chat.deleteMessage(item.id)) {
                  ElMessage.success('删除成功')
                }
              }"
            >
              <ElIcon :size="19" class="actionIconStyl"><Delete/></ElIcon>
              <span class="moreActionTxt">删除</span>
            </ElButton>
            <!-- 多选 -->
            <ElButton class="multiBtn" type="text" @click="multiSelectFn(true)">
              <ElIcon :size="19" class="actionIconStyl"><Check/></ElIcon>
              <span class="moreActionTxt">多选</span>
            </ElButton>
            <!-- 下载 -->
            <ElButton
              v-if="['文件', '视频', '图片'].includes(item.msgType) && item.forward?.length < 1"
              type="text"
              class="multiBtn"
              @click="() => {
                const url = parseAvatar(item.msgBody).shareLink
                downloadByUrl(shareOpenLink(url, true))
              }">
              <ElIcon :size="19" class="actionIconStyl"><Download/></ElIcon>
              <span class="moreActionTxt">下载</span>
            </ElButton>
          </div>
        </template>
      </ElPopover>
    </div>
  </ElTooltip>
</div>
</template>

<style lang="scss" scoped>
.msgAction {
  display: flex;
  width: 100%;
  justify-content: space-around;
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
</style>
