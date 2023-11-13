<!-- 通讯录 -->
<script setup lang="ts">
  import orgCtrl from '@/ts/controller'
  import { ISession } from '@/ts/core'
  import DirectoryViewer from '@/components/Directory/views/index.vue';
  import { command } from '@/ts/base'
  import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
  import { loadChatOperation } from './common'

  const props = defineProps<{
    chats: ISession[];
    filter: string;
  }>()

  // 选中的会话
  const focusFile=ref<ISession>()
  // 监听变更
  const {loaded, key:msgKey} = useFlagCmdEmitter('session')

  // 经过搜索关键词筛选排序后的所有会话列表
  const filteredChats = computed(()=>{
    // 没有选中的沟通，则获取所有与我相关沟通
    const chats = props.chats ?? orgCtrl.chats.filter((i) => i.isMyChat)
      return chats
      .filter( 
        (a) =>
          a.chatdata.chatName.includes(props.filter) ||
          a.chatdata.chatRemark.includes(props.filter) ||
          a.metadata.belong.name.includes(props.filter) ||
          a.chatdata.labels.filter((l) => l.includes(props.filter)).length > 0,
      )
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
  })

  /** 生成右键菜单内容 */
  const contextMenu = (session: ISession | undefined) => {
    return loadChatOperation(session) || []
  }

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

</script>

<template>
  <div class="book" v-loading="!loaded" element-loading-text="加载中...">
    <DirectoryViewer
      :key="msgKey"
      extraTags
      :initTags="['全部', '@我', '未读', '置顶', '好友']"
      :excludeTags="['本人', '同事']"
      :selectFiles="[]"
      :focusFile="focusFile"
      :content="filteredChats"
      :badgeCount="(tag) => {
        let count = 0;
        filteredChats
          .filter((i) => tag === '全部' || i.groupTags.includes(tag))
          .forEach((i) => {
            count += i.badgeCount;
          });
        return count;
      }"
      :fileOpen="(entity) => sessionOpen(entity as ISession)"
      :contextMenu="(entity) => contextMenu(entity as ISession)"
    />   
  </div>
</template>

<style lang="scss" scoped>
.book {
  height: 100%;
}
</style>
