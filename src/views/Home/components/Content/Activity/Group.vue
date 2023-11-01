<script setup lang="ts">
import { IActivity } from '@/ts/core';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
// import useAsyncLoad from '@/hooks/useAsyncLoad';
import { useWindowSize } from '@vueuse/core';
import { DxResizable } from 'devextreme-vue/resizable';
import ActivityItem from './ActivityItem.vue';
import Activity from './Activity.vue';

// 接收参数
const props = defineProps<{
  activity: IActivity
}>()
// 有动态的群列表
let activitys:IActivity[] = []
// 加载标识量
const isLoading = ref(true)
// 窗口尺寸
const size = useWindowSize()
// 当前动态对象
const current =ref<IActivity>(props.activity)
// 初始化加载数据
onMounted(async() => {
  // TODO:
  const res = await props.activity.load(10)
  console.log('拿到的数据:',props.activity.activitys);///////////////////////////////////
  activitys = props.activity.activitys.filter((i) => i.activityList.length>0)
  isLoading.value = false
  console.log('有效数据:',activitys);//////////////////////////////////////////////////
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
        handles = "right"
        style="overflow: auto;width: 760px;"
      >
        <div :key="key" class="groupList">
          <div
            class="groupListItem"
            v-for="item in activitys"
            :key="item.key"
            @click="current = item"
          >
            <ActivityItem
              :item = "item.activityList[0]"
              :activity="item"
              :hideResource="true"
            />
          </div>
        </div>
      </DxResizable>
      <!-- 右侧列表 -->
      <div :style="{ height: '100%', width: '100%' }">
        <!-- TODO: -->
        <Activity
          v-if="!isLoading && current"
          :height="'calc(100vh - 335px)'"
          :activity="current as IActivity"
          :title="current.name + '动态'"
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
    height: calc(100vh - 200px);
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
      // TODO:background: @component-background;
      background-color: aqua;
      box-shadow: 0 0 2px 2px #ededed;

      &Item {
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        // TODO:border-bottom: 1px solid @border-color-base;
        border-bottom: 1px solid aqua;
        &:hover {
          // background: @active-background;
          background-color: red;
        }
      }
    }
  }
}
</style>
