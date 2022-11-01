<template>
  <div class="userUnit">
    <div class="title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="first">
        </el-tab-pane>
      </el-tabs>
      <div class="table-wrap">
        <GroupsAdd types="全部" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { TabsPaneContext } from 'element-plus'
  import GroupsAdd from '../components/groups.vue'

  const activeName = ref<string>('first')

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
</script>
<style lang="scss" scoped>
  .userUnit {
    height: 100%;
    .title {
      height: 100%;
      :deep(.el-tabs__item) {
        font-size: 20px !important;
        font-weight: 600;
        margin-left: 30px;

        border-color: #1a5773;
      }
      :deep(.el-tabs__header) {
        margin: 0;
        padding-top: 20px;
        background-color: #fff;

      }
      .table-wrap{
        height: calc(100% - 60px);
        box-sizing: border-box;
        padding: 6px;
      }
    }
  }
</style>
