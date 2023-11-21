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
const current =ref<IActivity>(props.activity)
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
  <div class="content" v-loading="isLoading" element-loading-text="加载中,请稍后...">
    <div class="groupCtx">
      <!-- 左侧列表 -->
      <DxResizable 
        v-if="size.width.value>1000 && !isLoading"
        :handles = "'right'"
        style="width:800px"
      >
        <div class="groupList" :key="key">
          <div class="groupListItem" :class="{'groupListItemSelected':current.key===item.key}"
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
      <!-- 右侧列表 -->
      <div :style="{ height: '100%', width: '100%', zIndex: 100 }">
        <Activity
          v-if="!isLoading && current"
          :title="current.name + '动态'"
          :activity="current"
          :key="current.key"
        >
        </Activity>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  // TODO:
  width: 100%;
  background-color: #f1f1f1;
  background: linear-gradient(#f5f5f5ee, #f1f1f1);
  .groupCtx {
    width: 100%;
    // height: calc(100vh - 200px);
    height: 100vh;
    box-sizing: border-box;
    padding: 12px;
    display: flex;
    .groupList {
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      height: 100%;
      border-radius: 4px;
      padding: 8px;
      min-width: 500px;
      // background: @component-background;
      background-color: #fafafa;
      box-shadow: 0 0 2px 2px #ededed;

      &Item {
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        // border-bottom: 1px solid @border-color-base;
        border-bottom: 1px solid #e6f1ff;
        &Selected {
          // background: @active-background;
          background-color: #e6f1ff;
        }
      }
    }
  }
}
</style>
