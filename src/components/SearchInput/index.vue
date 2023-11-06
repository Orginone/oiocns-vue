<script setup lang="ts">
import { Component } from 'vue';
import {Search} from '@element-plus/icons-vue'
import { ElRow } from 'element-plus';

const props = defineProps<{
  extra?: string | Component; // 组件右侧自定义
  value?: string; // 搜索框的值
  placeholder?: string; // 搜索框的值
  // onChange: React.ChangeEventHandler<HTMLInputElement> | undefined; // 值发生改变的监听事件
  onChange?: (value: string) => void;
}>()

const { extra, placeholder, onChange, value } = props
const modelValue = ref<string>(value)
</script>

<template>

<ElRow :gutter="16" align="middle">
  <ElCol :span="extra ? 16 : 24">
    <div class="search-input">
      <ElInput
        v-model="modelValue"
        :prefix-icon="Search"
        :placeholder="placeholder || '请输入'"
        :input-style="{border: 0}"
        @change="onChange(modelValue)"
      />
    </div>
  </ElCol>
  <ElCol v-if="extra" :span="8" style="text-align: right;">
    {{extra}}
  </ElCol>
</ElRow>
</template>

<style lang="scss" scoped>
// @import (reference) '~antd/es/style/themes/variable';

.search-input {
  // background-color: @item-hover-bg;
  // padding: 0 @padding-xxs;
  // height: @height-base;
  // line-height: @height-base;
  // width: 300px;
  // border-radius: 20px;
  input {
    // background-color: @item-hover-bg;
  }
  
  .icon {
    // font-size: 18px;
    // color: @input-placeholder-color;
  }

  :deep(.el-input__wrapper) {
    align-items: center;
    box-shadow: none;
    background-color: #f2f4f9;
    padding: 0 4px;
    height: 32px;
    line-height: 32px;
    border-radius: 20px;

  }
}
</style>
