<template>
  <div class="cohort-wrap">
    <el-aside class="custom-group-silder-menu" width="300px">
      <GroupSideBarVue
        @clearHistoryMsg="clearHistoryMsg"
        :chatRef="chatRef"
        v-model:imgKey="imgKey"
        @openChanged="openChanged"
      />
    </el-aside>
    <!-- 右侧展示主体 -->
    <div v-if="chatRef.chat" class="chart-page">
      <!-- 头部 -->
      <GroupHeaderVue
        :chatRef="chatRef"
        :imgKey="imgKey"
        @viewDetail="handleViewDetail"
      />
      <!-- 聊天区域 -->
      <GroupContent
        class="chart-content"
        ref="contentWrapRef"
        :chatRef="chatRef"
        @handleReWrite="reWrite"
      />
      <!-- 输入区域 -->
      <GroupInputBox
        ref="inputBox"
        class="chart-input"
        :chatRef="chatRef"
        @initContentScroll="openChanged"
      />
    </div>
    <!-- 详情 -->
    <GroupDetail v-if="isShowDetail" :chatRef="chatRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import GroupSideBarVue from "./components/groupSideBar.vue";
import GroupHeaderVue from "./components/groupHeader.vue";
import GroupInputBox from "./components/groupInputBox.vue";
import GroupContent from "./components/groupContent.vue";
import GroupDetail from "./components/groupDetail.vue";
import { chatCtrl } from "@/ts/coreIndex";
const isShowDetail = ref<boolean>(false);

/**
 * 获取 chatController 实例化对象
 */
const chatRef = ref<any>({});

setTimeout(() => {
  chatRef.value = new chatCtrl(true);
}, 600);

watch(
  () => chatRef.value,
  (val: any) => {
    console.log(88888888888);
    
    if (val.chat) {
      val.chat.messages.forEach((item: any) => {
        if (item.msgType === "图片") {
          item.link = JSON.parse(item.showTxt).thumbnail;
        }
      });
    }
  },
  { deep: true }
);

const imgKey = ref<number>(0);

//内容展示 dom节点
const contentWrapRef = ref(null);
const inputBox = ref(null);

const openChanged = () => {
  contentWrapRef.value.goPageEnd();
};

const reWrite = (str: string) => {
  inputBox.value.reWrite(str);
};

// 展示详情页
const handleViewDetail = () => {
  isShowDetail.value = !isShowDetail.value;
};

//清空历史记录
const clearHistoryMsg = () => {
  //TODO
};
</script>

<style lang="scss">
@import "./components/qqface.scss";

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
