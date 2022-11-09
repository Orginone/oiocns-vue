<template>
  <div class="titleBox">
    <p class="title">当前用户</p>
    <div class="btns">
      <span
        v-for="item in btns"
        :key="item.name"
        class="titlebtn"
        @click="item.event"
      >
        {{ item.name }}
      </span>
      <!-- <span class="titlebtn" @click="resetPass">重置密码</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  btns: {
    name: string;
    event: () => void;
  }[];
  line?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
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
  }

  .titlebtn {
    font-size: 14px;
    line-height: 18px;
    color: #154ad8;
    cursor: pointer;
    user-select: none;
    margin: 0 16px;
  }
}
</style>
