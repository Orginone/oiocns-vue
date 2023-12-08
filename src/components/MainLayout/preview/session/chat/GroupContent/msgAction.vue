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
  <ElTooltip content="多选" placement="top">
    <div class="msgAction-btn"   @click="multiSelectFn(true)">
      <ElButton :icon="Check" link/>
    </div>
  </ElTooltip>
  <ElTooltip content="转发" placement="top" >
    <div class="msgAction-btn" @click="forward(item)">
      <ElButton :icon="Promotion" link/>
    </div>
  </ElTooltip>  
  <ElTooltip content="引用" placement="top">
    <div class="msgAction-btn" @click="citeText(item)">
      <ElButton :icon="ChatDotRound" link/>
    </div>
  </ElTooltip>
  <ElTooltip content="复制" placement="top">
    <div class="msgAction-btn"  @click="copy(item.msgBody) && ElMessage.success('复制成功')">
      <ElButton :icon="CopyDocument" link/>
    </div>
  </ElTooltip>
  <ElTooltip content="撤回" v-if="item.isMySend && item.allowRecall"  placement="top">
    <div class="msgAction-btn" @click="async () => await props.chat.recallMessage(item.id)">
      <ElButton :icon="Back" link/>
    </div>
  </ElTooltip>
  <ElTooltip content="删除" v-if="chat.canDeleteMessage"  placement="top">
    <div class="msgAction-btn" @click="async () => await props.chat.deleteMessage(item.id)">
      <ElButton :icon="Delete" link/>
    </div>
  </ElTooltip>  
  <ElTooltip content="下载" v-if="['文件', '视频', '图片'].includes(item.msgType) && item.forward?.length < 1"  placement="top">
    <div class="msgAction-btn" @click="() => downloadByUrl(shareOpenLink(parseAvatar(item.msgBody).shareLink, true))">
      <ElButton :icon="Download" link/>
    </div>
  </ElTooltip>
</div>
</template>

<style lang="scss" scoped>
.msgAction {
  width: 100%;
  display: flex;
  .msgAction-btn {
    // TODO: color/surface/分割线
    border-right: 1px solid #E7E8EB;
    padding: 4px;
    &:last-child {
      border-right: 0;
    }
  }
}

</style>

<style>
.el-popover.el-popper.moreAction {
  border: 0 !important;
  padding: 2px 3px !important;
  width: fit-content !important;
  min-width: 50px !important;
}
</style>
