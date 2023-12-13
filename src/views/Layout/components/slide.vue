<script lang="ts" setup>
import orgIcons from "@/components/Common/GlobalComps/orgIcons.vue"
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import orgCtrl from '@/ts/controller'
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
import { kernel, model, schema } from '@/ts/base'
import navItem from './navItem.vue'

const workCount = ref(0)
const msgCount = ref(0)
const onlineVisible = ref(false)

useFlagCmdEmitter('session', () => {
  let noReadCount = 0;
  for (const item of orgCtrl.chats) {
    if (item.isMyChat) {
      noReadCount += item.badgeCount;
    }
  }
  msgCount.value = noReadCount
})

const workId = orgCtrl.work.notity.subscribe(async () => {
  workCount.value = orgCtrl.work.todos.length
})
onBeforeUnmount(() => {
  orgCtrl.work.notity.unsubscribe(workId)
})
const actions = ref([
  {
    text: '门户',
    icon: 'home',
    path: '/home',
    count: 0,
  },
  {
    text: '沟通',
    icon: 'chat',
    path: '/chat',
    count: msgCount,
  },
  {
    text: '办事',
    icon: 'work',
    path: '/work',
    count: workCount,
  },
  {
    text: '数据',
    icon: 'store',
    path: '/store',
    count: 0,
  },
  {
    text: '关系',
    icon: 'relation',
    path: '/relation',
    count: 0,
  },
])

</script>

<template>
  <div class="nav">
    <div class="nav-top">
      <div class="avatar">
        <!-- <ElBadge :value="online" :hidden="!(online>0)"> -->
          <EntityIcon :entityId="orgCtrl.user.id" :size="35" />
        <!-- </ElBadge> -->
      </div>
      <div class="navList">
        <navItem v-for="item in actions" :key="item.path" :item = "item" />
      </div>
      <!-- TODO: 待删除：在线信息 -->
      <!-- <OnlineInfo v-if="onlineVisible" :onClose="() => onlineVisible = false" /> -->
    </div>
    <div class="nav-bottom">
      <RouterLink to="/login" class="exit">
        <orgIcons :size="20" exit selected />
        <div>退出</div>
      </RouterLink>
      
    </div>
  </div>
</template>



<style lang="scss" scoped>  
.nav{
  width: 60px;
  height: 100%; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  padding: 13px 5px;
  // TODO: color/brand/Light
  background-color: #F2F3FF;
  .nav-top{
    display: flex;
    flex-direction: column;
    gap: 32px;
    .avatar {
      margin: auto;
    }
    .navList {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  
  }
  .nav-bottom {
    border-radius: 8px;
    opacity: 60%;
    .exit {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
