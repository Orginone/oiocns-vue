<script lang="ts" setup>
import orgIcons from "@/components/Common/GlobalComps/orgIcons.vue"
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import orgCtrl from '@/ts/controller'
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate'
import { kernel, model, schema } from '@/ts/base'
import navItem from './navItem.vue'

const workCount = ref(0)
const msgCount = ref(0)
const online = ref (0)
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
onMounted(() => {
  const workId = orgCtrl.work.notity.subscribe(async () => {
    workCount.value = orgCtrl.work.todos.length
  })
  kernel.onlineNotify.subscribe(() => {
    online.value = kernel.onlineIds.length
  })
  return () => {
    orgCtrl.work.notity.unsubscribe(workId)
  }
})
const actions = [
  {
    text: "门户",
    icon: "home",
    path: "/home",
    count: 0,
  },
  {
    text: "沟通",
    icon: "chat",
    path: "/chat",
    count: msgCount,
  },
  {
    text: "办事",
    icon: "work",
    path: "/work",
    count: workCount,
  },
  {
    text: "存储",
    icon: "store",
    path: "/store",
    count: 0,
  },
  {
    text: "设置",
    icon: "setting",
    path: "/setting",
    count: 0,
  },
]

</script>

<template>
  <div class="nav">
    <div class="slide">
      <div class="user">
        <ElBadge :value="online" :hidden="!(online>0)">
          <EntityIcon :entityId="orgCtrl.user.id" :size="45" />
        </ElBadge>
      </div>
      <ElSpace 
        direction="vertical" 
        wrap 
        alignment="center" 
        :size="25"
        class="nav-bar"
      >
        <navItem v-for="item in actions" :key="item.path"
          :item = "item"
        />
        <!-- 在线信息 -->
        <OnlineInfo v-if="onlineVisible" :onClose="() => onlineVisible = false" />
      </ElSpace>
    </div>
    <div class="exit" url="exit">
      <RouterLink to="/login">
        <orgIcons :size="22" exit selected />
        <div>退出</div>
      </RouterLink>
      
    </div>
  </div>
</template>



<style lang="scss" scoped>  
.nav{
  width: 60px;
  height: 100%;
  background-color: #fafafa;
  border-right: rgba(227,226,226,.8) solid 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .slide{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user{
    margin: 10px 0;
    img{
      width: 45px;
      height: 45px;
    }
  }
  .exit{
    margin-bottom: 10px;
    text-align: center;
    color:#366ef4;
  }
}
.item {
  padding: 10px 0;
  img {
    width: 26px;
    height: 26px;
  }
  .item-text {
    font-size: 12px;
    line-height: 18px;
    color: #888;
  }
}
</style>
