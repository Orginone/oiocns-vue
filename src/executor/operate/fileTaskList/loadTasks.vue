<script setup lang='ts'>
import TypeIcon from '@/components/Common/GlobalComps/typeIcon.vue'
import { TaskModel } from '@/ts/base/model'

const props = defineProps<{
  tasks: TaskModel[]
}>()

/** 获取进度 */
const getProcess = (f: number, s: number) => {
  s = s == 0 ? 1 : s
  return parseInt(((f * 10000.0) / s).toFixed(0)) / 100
}

</script>

<template>
  <div class="task-list">
    <div class="task-list-item" v-for="item in tasks">
      <div class="task-list-item-meta">
        <div class="task-list-item-meta-avatar">
          <TypeIcon iconType='文件' :size="50" />
        </div>
        <div class="task-list-item-meta-content">
          <strong class="name">{{item.name}}</strong>
          <ElProgress
            :status="item.finished === -1 ? 'exception' : 'success'"
            :percentage="getProcess(item.finished, item.size)"
          />
        </div>
       
      </div>
      <div class="task-list-item-process">
        {{getProcess(item.finished, item.size)}}%
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.task-list {
  .task-list-item {
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .task-list-item-meta {
    flex: 1;
    display: flex;
    align-items: center;
    .task-list-item-meta-avatar {
      margin-right: 26px;
    }
    .task-list-item-meta-content {
      flex: 1;
      .name {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  .task-list-item-process {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    margin-left: 48px;
    padding: 0;
  }
}
</style>