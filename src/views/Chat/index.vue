<template>
  <div class="cohort-wrap">
    <el-aside class="custom-group-silder-menu" width="300px">
      <GroupSideBarVue :clearHistoryMsg="clearHistoryMsg" @openChanged="openChanged" />
    </el-aside>
    <!-- 右侧展示主体 -->
    <div class="chart-page">
      <!-- 头部 -->
      <GroupHeaderVue v-if="chat.curChat.value !== null" @viewDetail="handleViewDetail" />
      <!-- 聊天区域 -->
      <GroupContent class="chart-content" ref="contentWrapRef" @handleReWrite="reWrite"
        v-show="chat.curChat.value != null" />
      <!-- 输入区域 -->
      <GroupInputBox ref="inputBox" class="chart-input" v-show="chat.curChat.value != null" />
    </div>
    <!-- 详情 -->
    <GroupDetail v-if="isShowDetail" :clearHistoryMsg="clearHistoryMsg" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
import GroupSideBarVue from './components/groupSideBar.vue'
import GroupHeaderVue from './components/groupHeader.vue'
import GroupInputBox from './components/groupInputBox.vue'
import GroupContent from './components/groupContent.vue'
import GroupDetail from './components/groupDetail.vue'
import { chat } from '@/module/chat/orgchat'
const isShowDetail = ref<boolean>(false)

//内容展示 dom节点
const contentWrapRef = ref(null)
const inputBox = ref(null)

onMounted(() => {
  chat.onMessage((data: any) => {
    contentWrapRef.value.goPageEnd()
  })
})

const openChanged = (item: any) => {
  contentWrapRef.value.goPageEnd()
}

const reWrite = (str: string) => {
  inputBox.value.reWrite(str)
}

onBeforeUnmount(() => {
  // 离开页面关闭链接
  chat.onMessage(null)
})
// 展示详情页
const handleViewDetail = () => {
  isShowDetail.value = !isShowDetail.value
}

//清空历史记录
const clearHistoryMsg = () => {
  //TODO
}
</script>

<style lang="scss">
@import './components/qqface.scss';

.custom-group-silder-menu.el-aside {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.cohort-wrap {
  width: 100%;
  height: calc(100vh - 60px);
  display: flex;
  justify-content: space-between;
  // background-color: #fff;

  .chart-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    overflow: hidden;

    .chart-content {
      flex-grow: 1;
      overflow-y: auto;
    }

    .chart-input {
      height: max-content;
      min-height: 180px;
      border-top: 1px solid var(--el-border-color); // #ccc;

      .el-textarea__inner {
        color: #fff;
      }
    }
  }
}
</style>
