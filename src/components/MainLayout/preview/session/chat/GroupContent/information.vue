<script setup lang="ts">
import { IMessage, IMessageLabel } from '@/ts/core'
import TeamIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import { showChatTime } from '@/utils/tools'

const props = defineProps<{ 
  msg: IMessage; 
}>()
const emits=defineEmits(['close'])

const isShow = ref(true)
watch(() => props.msg, (n) => {
  if(n){isShow.value = true}
})

const activeName = ref('unRead')
</script>

<template>
<ElDrawer  title="消息接收人列表"  v-model="isShow" @close="emits('close')">
  <ElTabs v-model="activeName">
    <!-- 未读 -->
    <el-tab-pane :label="`未读(${msg.unreadInfo.length})`" name="unRead">
      <div class="demo-loadmore-list">
        <!-- 可以提取成组件 -->
        <template v-for="item in msg?.unreadInfo">
          <div class="list-item" style="cursor: pointer;padding: 6px;">
            <div class="meta">
              <ElAvatar><TeamIcon :entityId="item.userId" :size="42" /></ElAvatar>
              <strong>{{item.labeler.name}}</strong>
              <span class="description">{{item.label}}</span>
            </div>
            <div class="actions">
              <div v-if="item.time.length > 0">{{showChatTime(item.time)}}</div>
            </div>
          </div>
        </template>
      </div>
    </el-tab-pane>
    <!-- 已读 -->
    <el-tab-pane :label="`已读(${props.msg?.readedIds?.length})`" name="read">
      <div class="demo-loadmore-list">
        <!-- 可以提取成组件 -->
        <template v-for="item in msg?.labels">
          <div class="list-item" style="cursor: pointer;padding: 6px;">
            <div class="meta">
              <ElAvatar><TeamIcon :entityId="item.userId" :size="42" /></ElAvatar>
              <strong>{{item.labeler.name}}</strong>
              <span class="description">{{item.label}}</span>
            </div>
            <div class="actions">
              <div v-if="item.time?.length > 0">{{showChatTime(item.time)}}</div>
            </div>
          </div>
        </template>
      </div>
    </el-tab-pane>
  </ElTabs>
</ElDrawer>
</template>

<style lang="scss" scoped>

</style>
