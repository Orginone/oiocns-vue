<script setup lang='ts'>

import orgCtrl from '@/ts/controller'
import OrgIcons from "@/components/Common/GlobalComps/orgIcons.vue"
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps<{item:any}>()

const selected = ref(false)

watch(route,()=>{
  selected.value = (route.path===props.item.path)
},{immediate:true})

</script>

<template>
  <RouterLink class="nav-item" :class="{'nav-item-selected':selected}"
    :to="item.path"
    @click="orgCtrl.currentKey = '';orgCtrl.changCallback()"
  >
    <ElBadge :value="item.count" :hidden="!(item.count>0)">
      <OrgIcons :size="20" :type="item.icon" notAvatar :selected="selected" :key="selected.toString()" css="color: #366EF4;"/>
    </ElBadge>
    <div class="title">{{item.text}}</div>
  </RouterLink>
</template>

<style lang='less' scoped>
.nav-item {
  width: 50px;
  height: 55px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title {
    font-family: PingFang SC;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
    color: #888;
  }
}
.nav-item-selected,.nav-item:hover {
  background-color: #FFFFFF;
  .title {
    color: #366EF4;
  }
}
</style>