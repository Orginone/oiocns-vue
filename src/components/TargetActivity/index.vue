<!-- 右侧动态列表组件 -->
<script setup lang="ts">
import { IActivity,IActivityMessage } from '@/ts/core'
import { command } from '@/ts/base'
import { DxScrollView } from 'devextreme-vue'
import type {ReachBottomEvent} from 'devextreme/ui/scroll_view'
import ActivityItem from './ActivityMessage/index.vue'

const props = defineProps<{
  height: string,
  activity: IActivity,
  title?: string
}>()

const actionList = ref<IActivityMessage[]>(props.activity.activityList)

// 订阅变更
const id = props.activity.subscribe(() => {
  actionList.value = [...props.activity.activityList]
})
// 取消订阅
onBeforeUnmount(() => props.activity.unsubscribe(id))

// 加载更多
const loadMoreActivity = async(e:ReachBottomEvent) => {
  const component = e.component
  const news = await props.activity.load(10);
  if (news.length > 0) {
    props.activity.changCallback();
  }
  if (component) {
    await component.release(news.length < 10);
  }
}
</script>

<template>
  <div class="activity-page">
    <DxScrollView
      :key="activity.key"
      bounceEnabled
      :width="'100%'"
      :height="height"
      reachBottomText="加载更多..."
      :onReachBottom="loadMoreActivity"
      :onInitialized="loadMoreActivity"
    >
      <div class="actionList">
        <template v-if="actionList?.length">
          <ActivityItem
            v-for="actionItem in actionList" :key="actionItem.key"
            :item="(actionItem as IActivityMessage)"
            :activity="(actionItem.activity as IActivity)"
          />
        </template>
        <!-- 空数据 -->
        <div v-else class="emptyList">
          <ElEmpty/>
        </div>
      </div>
    </DxScrollView>
  </div>

</template>

<style lang="scss" scoped>
.activity-page {
  height: 100%;
  padding: 24px 24px 0 24px;
  .actionList {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;   
    
    margin-bottom: 24px;
  }
  .emptyList {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}



</style>
