<!-- 群动态 -->
<script setup lang="ts">
import { IActivity,IActivityMessage } from '@/ts/core'
import useCtrlUpdate from '@/hooks/useCtrlUpdate'
// import useAsyncLoad from '@/hooks/useAsyncLoad'
import { useWindowSize } from '@vueuse/core'
import { DxResizable } from 'devextreme-vue/resizable'
import ActivityItem from '@/components/TargetActivity/ActivityMessage/index.vue'
import Activity from '@/components/TargetActivity/index.vue'

// 接收参数
const props = defineProps<{
  activity: IActivity
}>()
// 有动态的群列表
const activitys = ref<IActivity[]>([])
// 加载标识量
const isLoading = ref(true)
// 窗口尺寸
const size = useWindowSize()
// 当前动态对象
const current =ref<IActivity>(props.activity as IActivity)
// 初始化加载数据
onMounted(async() => {
  await props.activity.load(10)
  activitys.value = props.activity.activitys.filter((i) => i.activityList.length>0)
  isLoading.value = false
})
// 订阅动态监听
const [key] = useCtrlUpdate(props.activity)
</script>

<template>
  <div class="activityContent" 
    v-loading="isLoading" 
    element-loading-text="加载中,请稍后..."
  >
    <!-- 左侧 -->
    <div class="group-list">
      <div class="group-list-item" :class="{'group-list-item-selected':item.id === current.id}"
        v-for="item in activitys.filter((i) => i.activityList.length>0)" :key="item.key"
        @click="current = item"
      >
        <ActivityItem
          :item = "(item.activityList[0] as IActivityMessage)"
          :activity="(item as IActivity)"
          :hideResource="true"
        />
      </div>
    </div>
    <!-- 右侧 -->
    <div class="loadContext">
      <Activity v-if="!isLoading && current"
        height="calc(100vh - 110px)"
        :title="current.name + '动态'"
        :activity="(current as IActivity)"
        :key="current.key"
      >
      </Activity>
    </div>
  </div>
</template>

<style lang="less" scoped>
/**
  ActivityContent
*/

.activityContent {
  display: flex;
  padding-bottom: 413px;
  gap: 16px;
  .group-list {
    width: 336px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .loadContext {
    width: 0;
    flex: 1;
    border-radius: 6px;
    overflow: hidden;
  }
}
</style>
