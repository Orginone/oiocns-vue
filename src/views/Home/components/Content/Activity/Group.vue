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
    <div class="groupCtx">
      <!-- 左侧 -->
      <DxResizable 
        v-if="size.width.value>1000 && !isLoading"
        handles = 'right'
        style="width:800px"
      >
        <div class="groupList">
          <div :class="`groupList-${item.id === current.id ? 'selected' : 'item'}`"
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
      </DxResizable>
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
  </div>
</template>

<style lang="less" scoped>
/**
  ActivityContent
*/

.activityContent {
  .loadContext {
    height: 100%;
    width: 100%;
    // .ogo-card-body {
    //   background-color: rgba(0,0,0,0)
    // }
    // .ogo-list-item {
    //   border-bottom: 1px solid @border-color-base;
    //   margin: 8px 0;
    // }
  }
  .groupCtx {
    width: 100%;
    // height: calc(100vh - 300px);
    box-sizing: border-box;
    padding: 12px;
    display: flex;
    gap: 6px;
    .groupList {
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      height: calc(100vh - 30px);
      border-radius: 4px;
      padding: 8px;
      min-width: 500px;
      background: @component-background;
      &-selected {
        cursor: pointer;
        border: 1px solid @border-color;
        background-color: @active-background;
      }

      &-item {
        cursor: pointer;
        border-radius: 6px;
        border-bottom: 1px solid @border-color-base;
        &:hover {
          background-color: @active-background;
        }
      }
    }
  }
}
</style>
