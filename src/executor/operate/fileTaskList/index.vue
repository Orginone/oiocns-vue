<!-- 文件上传记录 -->
<script setup lang='ts'>
import { IDirectory } from '@/ts/core'
import loadTasks from './loadTasks.vue'

const props = defineProps<{
  directory: IDirectory
  finished: () => void
}>()

const isShow = ref(true)
const activeName = ref('uploading')

const taskList= ref(props.directory.taskList)

let id = ''
onMounted(() => {
  id = props.directory.taskEmitter.subscribe(() => {
    taskList.value = [...props.directory.taskList]
  })
})
onBeforeUnmount(()=>{
  props.directory.unsubscribe(id)
  props.finished()
})

</script>

<template>
  <ElDrawer
    title="操作记录"
    v-model="isShow"
    custom-class="file-task-list-drawer"
    destroy-on-close
    @close="finished"
  >
    <ElTabs
      v-model="activeName"
    >
       <ElTabPane name="uploading" label="上传中" >
          <loadTasks :tasks="taskList.filter((i) => i.finished >= 0 && i.finished < i.size)"/>
       </ElTabPane> 
       <ElTabPane name="uploaded" label="已完成">
          <loadTasks :tasks="taskList.filter((i) => i.finished < 0 || i.finished >= i.size)"/>
       </ElTabPane> 
    </ElTabs>
  </ElDrawer>
</template>

<style lang='scss' scoped>

</style>
<style>
.file-task-list-drawer {
  width: 500px !important;
}
</style>