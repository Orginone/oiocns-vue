<template>
  <div class="container">
    <el-tabs v-model="activeName" class="tabs" ref="tabs"  @tab-click="handleClick">
      <el-tab-pane label="人员列表" name="user">
      </el-tab-pane>
      <User :tabHeight="props.tabHeight" :selectItem="selectItem"></User>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import User from './User.vue'
const props = defineProps<{
  tabHeight: any,     // 高度数据
}>()

const activeName = ref('user')
let selectItem = ref<any>({})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
defineExpose({ selectItemChange });
</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  padding: 3px;
}
.tabs {
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background-color: #fff;
  padding: 18px;
  :deep(.el-tabs__content){
    height: calc(100% - 55px);
  }
}

</style>
