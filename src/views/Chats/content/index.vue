<!-- 通讯录 -->
<script setup lang="ts">
  import orgCtrl from '@/ts/controller'
  import { ISession } from '@/ts/core'
  import DirectoryViewer from '@/components/Directory/views/index.vue'
  import { command } from '@/ts/base'
  import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
  import { loadChatOperation } from './common'

  const props = defineProps<{
    filter: string
  }>()

  // 选中的会话
  const focusFile=ref<ISession>()
  // 监听变更
  const {loaded, key:msgKey} = useFlagCmdEmitter('session')

  // 会话列表(关键词筛选+置顶排序)
  // const contents = computed(()=>{
  //   let contents: ISession[] = [...orgCtrl.chats.filter((i) => i.isMyChat)]
  //   // 关键词筛选
  //   contents = contents.filter(item=>
  //       item.chatdata.chatName.includes(props.filter) ||
  //       item.chatdata.chatRemark.includes(props.filter) ||
  //       item.groupTags.filter((l) => l.includes(props.filter)).length > 0
  //   )
  //   // 排序（是否置顶）
  //   contents =  contents.sort((a, b) => {
  //     var num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0)
  //     if (num === 0) {
  //       if (b.chatdata.lastMsgTime == a.chatdata.lastMsgTime) {
  //         num = b.isBelongPerson ? 1 : -1
  //       } else {
  //         num = b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 5 : -5
  //       }
  //     }
  //     return num;
  //   }) 
  //   return contents
  // })
  const contents = ref<ISession[]>()
  watch(msgKey,()=>{
    contents.value = [...orgCtrl.chats.filter((i) => i.isMyChat)]
    // 关键词筛选
    contents.value = contents.value.filter(item=>
      item.chatdata.chatName.includes(props.filter) ||
      item.chatdata.chatRemark.includes(props.filter) ||
      item.groupTags.filter((l) => l.includes(props.filter)).length > 0
    )
    // 排序（是否置顶）
    contents.value =  contents.value.sort((a, b) => {
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
      v-if="contents"
      :key="msgKey"
      extraTags
      :initTags="['全部', '@我', '未读', '置顶', '好友']"
      :excludeTags="['本人', '同事']"
      :selectFiles="[focusFile] || []"
      :focusFile="focusFile"
      :content="contents"
      :badgeCount="(tag) => {
        let count = 0;
        contents
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
