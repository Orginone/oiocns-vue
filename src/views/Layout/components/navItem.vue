<script setup lang='ts'>
import orgCtrl from '@/ts/controller'
import OrgIcons from "@/components/Common/GlobalComps/orgIcons.vue"
import { useRoute } from 'vue-router';
const route = useRoute()


const props = defineProps<{item:any}>()

const selected = ref(false)
watch(route,()=>{
  selected.value = (route.path===props.item.path)
},{immediate:true})

</script>
<template>
  <RouterLink
    :to="item.path"
    @click="orgCtrl.currentKey = '';orgCtrl.changCallback()"
  >
    <ElBadge :value="item.count" :hidden="!(item.count>0)">
      <OrgIcons :size="26" :type="item.icon" notAvatar :selected="selected" :key="selected.toString()"/>
    </ElBadge>
    <div :class = "selected ? 'title_selected' : 'title'">{{item.text}}</div>
  </RouterLink>
</template>

<style lang='scss' scoped>
.title_selected {
  color: #366ef4;
}
</style>