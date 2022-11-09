<template>
  <div>
    <div class="titleBox">
      <div class="title" v-show="title">
        <p>{{ title }}</p>
        <slot name="titleSuffix"></slot>
      </div>
      <div class="btns" v-show="btns.length">
        <template v-for="i in btns" :key="i.name">
          <p class="titlebtn" @click="i.event">{{ i.name }}</p>
          <div class="btnline" v-show="line"></div>
        </template>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script setup lang="ts">
export interface BtnItem {
  name: string; // 按钮名字
  event: Function; // 按钮事件
}
type Props = {
  title?: string; // 标题
  btns?: BtnItem[]; // 按钮
  line?: boolean; // 是否中间有线
};
const props = withDefaults(defineProps<Props>(), {
  title: "",
  btns: () => [],
  line: false,
});
console.log(props);
</script>

<style lang="scss" scoped>
.titleBox {
  display: flex;
  justify-content: space-between;
  background: #fff;
  .title {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #303133;
    margin-bottom: 14px;
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
</style>
