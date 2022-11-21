<template>
  <div>
    <div class="titleBox">
      <div class="title" v-show="title">
        <p>{{ title }}</p>
        <slot name="titleSuffix"></slot>
      </div>
      <div class="content">
        <div v-show="tabOption.length">
          <el-tabs v-model="activeName" @tab-change="changeTab">
            <el-tab-pane
              v-for="item in tabOption"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="btns" v-show="btns.length">
          <template v-for="i in btns" :key="i.name">
            <p class="titlebtn" @click="i.event">{{ i.name }}</p>
            <div class="btnline" v-show="line"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TabPaneName } from "element-plus";

export interface BtnItem {
  name: string; // 按钮名字
  event: Function; // 按钮事件
}
export interface TabType {
  label: string; // 选项卡标题
  name: string | number; // 对应标识
}
type Props = {
  // 第一层tab切换
  tabOption?: TabType[]; // tab数据
  activeName?: string | number; // 选中值
  // 第二层标题 + 右侧按钮
  title?: string; // 标题
  btns?: BtnItem[]; // 按钮
  line?: boolean; // 按钮是否中间有线
};
const props = withDefaults(defineProps<Props>(), {
  tabOption: () => [],
  activeName: "",
  title: "",
  btns: () => [],
  line: false,
});

const changeTab = (name: TabPaneName) => {
  emit("changeTab", name);
};

const emit = defineEmits(["changeTab"]);
</script>

<style lang="scss" scoped>
.titleBox {
  display: flex;
  justify-content: space-between;
  background: #fff;
  flex-direction: column;
  .title {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #303133;
  }
  .content{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btns {
    display: flex;
    max-height: 18px;
    align-items: center;
    .titlebtn {
      font-size: 14px;
      line-height: 18px;
      color: #154ad8;
      cursor: pointer;
      user-select: none;
      margin: 0 16px;
    }
    .btnline {
      height: 15px;
      width: 1px;
      background: #c0c4cc;
      &:last-child {
        display: none;
      }
    }
  }
}
:deep(.el-tabs__item) {
  padding: 0 10px;
}
:deep(.el-tabs__nav-wrap::after),
:deep(.el-tabs__active-bar) {
  height: 4px;
}
</style>
