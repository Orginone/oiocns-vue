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
let id = ''
onMounted(() => {
  const id = props.activity.subscribe(() => {
    actionList.value = [...props.activity.activityList]
  })
})
// 取消订阅
onBeforeUnmount(() => {
  props.activity.unsubscribe(id);
})

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
  <ElCard
    v-if="actionList"
    body-style="
      border: 0;
      width:100%;
      height: calc(100% - 56px);
    "
    shadow="never"
  >
    <!-- 动态卡片——header -->
    <template #header>
      <div class="card-header" style="display: flex;justify-content: space-between;">
        <span>{{title || '动态'}}</span>
        <el-button 
          v-if="activity.allPublish"
          class="button" 
          link
          @click="command.emitter('executor','pubActivity', activity)"
        >
          发布动态
        </el-button>
      </div>
    </template>
    <!-- 动态卡片——滚动区域 -->
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
            v-for="actionItem in actionList"
            :key="actionItem.key"
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
  </ElCard>
</template>

<style lang="scss" scoped>
.el-card {
  height: 100%;
}
.emptyList {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.actionList {
  width: 100%;
  display: inline-block;
}

</style>
