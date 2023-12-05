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
    <ElButton link 
      @click="copy(item.msgBody) && ElMessage.success('复制成功')"
      :icon="CopyDocument"
    />
  </ElTooltip>
  <ElTooltip content="引用" placement="top">
    <ElButton link @click="citeText(item)" :icon="ChatDotRound"/>
  </ElTooltip>
  <ElTooltip content="转发" placement="top" >
    <ElButton link @click="forward(item)" :icon="Promotion"/>
  </ElTooltip>
  <ElTooltip v-if="item.isMySend && item.allowRecall" content="撤回" placement="top">
    <ElButton link @click="async () => await props.chat.recallMessage(item.id)" :icon="Back"/>
  </ElTooltip>
  <ElTooltip content="更多" placement="top">
    <div>
      <ElPopover
        placement="bottom-end"
        trigger="click"
        :show-arrow="false"
        popper-class="moreAction"
      >                           
        <template #reference>
          <ElButton :icon="MoreFilled" link/>                
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
              <ElIcon :size="16" class="actionIconStyl"><Delete/></ElIcon>
              <span class="moreActionTxt">删除</span>
            </ElButton>
            <!-- 多选 -->
            <ElButton class="multiBtn" type="text" @click="multiSelectFn(true)">
              <ElIcon :size="16" class="actionIconStyl"><Check/></ElIcon>
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
              <ElIcon :size="16" class="actionIconStyl"><Download/></ElIcon>
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
  margin: 0 4px;
}

.moreActionWrap {
  display: flex;
  flex-direction: column;
  .multiBtn {
    display: flex;
    align-items: center;
    padding: 6px;
    margin-left: 0 !important;
    color: rgba(0, 0, 0, 0.85);
  }
  .moreActionTxt {
    font-size: 12px;
    margin-left: 0;
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
