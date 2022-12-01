<template>
  <div class="container">
    <el-tabs v-model="activeName" class="tabs"  ref="tabs" @tab-click="handleClick">
      <el-tab-pane label="单位列表" name="companies">
      </el-tab-pane>
      <Companies :tabHeight="props.tabHeight" :selectItem="selectItem"></Companies>

      <!-- <el-tab-pane label="角色体系" name="identity">
        <Authority :selectItem="selectItem"></Authority>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import Companies from './companies.vue';

const activeName = ref('companies')
let selectItem = ref<any>({})
const props = defineProps<{
  tabHeight: any,     // 高度数据
}>()
// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
defineExpose({ selectItemChange });
const tabs = ref(null)
const tabHeight = ref<number>(400)
window.addEventListener('resize', function () {
  if(tabs.value){
    tabHeight.value=tabs.value.clientHeight
  }
})
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(() => {
  if(tabs.value){
    tabHeight.value=tabs.value.clientHeight
  }
})

</script>

<style lang="scss" scoped>
.container{
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  // padding: 3px;
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
