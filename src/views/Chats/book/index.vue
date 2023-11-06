<!-- 通讯录 -->
<script setup lang="ts">
import {IEntity} from '@/ts/core'
import { schema } from '@/ts/base'
import orgCtrl from '@/ts/controller'
import { ISession } from '@/ts/core'
import useStorage from '@/hooks/useStorage'
import IconMode from './views/iconMode.vue'
import ListMode from './views/listMode.vue'
import TableMode from './views/tableMode.vue'
import SegmentContent from '@/components/Common/SegmentContent/index.vue'
import TagsBar from '@/components/Directory/tagsBar/index.vue'
import { command } from '@/ts/base'
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
import { filter } from 'lodash'

const props = defineProps<{
  chats: ISession[];
  filter: string;
}>()

const currentTag=ref('全部');
const select=ref<ISession>();
const {loaded, key:msgKey} = useFlagCmdEmitter('session')
const [segmented, setSegmented] = useStorage('segmented', 'list')


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

//////////////////////////////////////////////
watch(() => props.filter, () => {
  console.log(filteredChats.value);
  
})

// 点击会话回调
const sessionOpen = async (session: ISession | undefined, dblclick: boolean) => {
  if (dblclick && session) {
    command.emitter('preview', 'open', session)
    orgCtrl.currentKey = session.chatdata.fullId
    orgCtrl.changCallback()
  } else if (!dblclick) {
    if (session?.id === select.value?.id) {
      select.value = undefined
      command.emitter('preview', 'open')
    } else {
      select.value = session
      command.emitter('preview', 'open', session)
    }
  }
}

//  根据当前选中标签筛选的会话列表
const getChats = computed(() => {
  const filter = currentTag.value
  return filteredChats.value.filter((i) => filter === '全部' || i.groupTags?.includes(filter)) as ISession[]
})

// 根据标签筛选
const getChatsByTag = (tag: string) => {
  const filter = tag
  return filteredChats.value.filter((i) => filter === '全部' || i.groupTags?.includes(filter)) as ISession[]
}


</script>

<template>
  <!-- 标签栏 -->
  <TagsBar
    :select="currentTag"
    :initTags="['全部', '@我', '未读', '单聊', '群聊']"
    :entitys="filteredChats"
    :selectFiles="[]"
    :badgeCount="(tag) => {
      let count = 0;
      getChatsByTag(tag).forEach((i) => {
        count += i.chatdata.noReadCount;
      });
      return count;
    }"
    :onChanged="(t) => currentTag = t"
  />
  <!-- 文件列表 -->
  <SegmentContent
    :key="msgKey"
    :onSegmentChanged="setSegmented"
    :descriptions="`${getChats.length}个会话`"
  >
    <div v-loading="!loaded" element-loading-text='加载中...'>
      <!-- todo:delay={200} -->
      <TableMode v-if="segmented === 'table'" :chats="getChats" :select="select" :sessionOpen="sessionOpen" />
      <IconMode v-if="segmented === 'icon'" :chats="getChats" :select="select" :sessionOpen="sessionOpen" />
      <ListMode v-else :chats="getChats" :select="select" :sessionOpen="sessionOpen" />
      <ElEmpty v-if="filteredChats.length == 0" description="NO DATA" />
    </div>
  </SegmentContent>
</template>

<style lang="scss" scoped>

</style>
