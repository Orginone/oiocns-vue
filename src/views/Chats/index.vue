<script setup lang="ts">
import appLayout from '@/components/MainLayout/appLayout.vue'
import orgCtrl from '@/ts/controller'
import { ISession } from '@/ts/core'
import DirectoryViewer from '@/components/Directory/views/index.vue'
import { command } from '@/ts/base'
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
import { cleanMenus } from '@/utils/tools'
import { loadFileMenus } from '@/executor/fileOperate'

/** 打开会话 */
const sessionOpen = (session: ISession | undefined) => {
  if (session?.key === focusFile.value?.key) {
    focusFile.value = undefined
    command.emitter('preview', 'chat');
  } else {
    focusFile.value = session
    command.emitter('preview', 'chat', session);
  }
}
// 监听并执行打开会话命令
const id = command.subscribe((type, cmd, ...args: any[]) => {
  if (type != 'session' || args.length < 1) return;
  switch (cmd) {
    case 'open':
      sessionOpen(args[0]);
      break;
  }
})
onBeforeUnmount(() => command.unsubscribe(id))

// 会话列表
const chats = ref<ISession[]>()
chats.value = []
// 实时刷新会话列表
useFlagCmdEmitter('session', () => {
  const temps = [...orgCtrl.chats.filter((i) => i.isMyChat)]  
    // 是否为最近消息
    .filter((i) => i.chatdata.lastMessage || i.chatdata.recently)
    // 排序（是否置顶）
    .sort((a, b) => {
      var num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0)
      if (num === 0) {
        if (b.chatdata.lastMsgTime == a.chatdata.lastMsgTime) {
          num = b.isBelongPerson ? 1 : -1
        } else {
          num = b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 5 : -5
        }
      }
      return num;
    }) 
  chats.value = temps
})


// 选中的会话
const focusFile=ref<ISession>()
// 监听变更
const {loaded, key:msgKey} = useFlagCmdEmitter('session')

/** 未读消息计算 */
const getBadgeCount = (tag: string) => {
  return chats.value
    .filter((i) => tag === '最近' || i.groupTags.includes(tag))
    .reduce((count,item)=>count+item.badgeCount,0)
}

/** 生成右键菜单内容 */
const contextMenu = (session: ISession | undefined) => {
  return {
    items: cleanMenus(loadFileMenus(session)) || [],
    onClick: ({ key }: { key: string }) => {
      command.emitter('executor', key, session);
    },
  }
}

</script>

<template>
  <appLayout preview-flag="chat">
    <div class="chat-content" v-loading="!loaded" element-loading-text="加载中...">
      <div class="title">
        <OrgIcons chat selected /> 沟通
      </div>
      <div class="content">
        <div class="content-main">
          <DirectoryViewer :key="msgKey"
            :initTags="['最近', '常用', '@我', '未读', '好友', '同事', '群聊']"
            :selectFiles="[]"
            :focusFile="focusFile"
            :content="chats"
            :badgeCount="getBadgeCount"
            :fileOpen="(entity) => sessionOpen(entity as ISession)"
            :contextMenu="contextMenu"
            :showFooter="false"
            listType="list"
          >
            <!-- 加号按钮 -->
            <template #rightBar>
              <div class="addBtn" @click="command.emitter('executor', 'link', '/relation')">
                +
              </div>
            </template>
          </DirectoryViewer>
        </div>
      </div>
    </div>
  </appLayout>
</template>

<style lang="scss" scoped>
.chat-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  .title {
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 16px;
    // TODO: color/text & icon/text - color-1
    color: #15181D;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .content {
    height: 0;
    flex:1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    .addBtn {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      // TODO: color/surface/次要容器背景
      background-color: #F7F8FA;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        // TODO:
        background-color: #E6F7FF;
      }
    }
    .content-main {
      height: 0;
      flex:1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>

