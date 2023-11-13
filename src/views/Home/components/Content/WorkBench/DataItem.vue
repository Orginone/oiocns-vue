<!-- 渲染数据项 -->
<script setup lang="ts">

import { formatSize } from '@/ts/base/common'

const props = defineProps<{
  title: string,
  number: string | number,
  size?: number,
  info?: string,
}>()

</script>

<template>
<div class="dataItem">
  <div class="dataItemTitle">{{title}}</div>
  <div class="dataItemNumber">{{number}}</div>
  <div v-if="size&&size>0" class="dataItemTitle">大小:{{formatSize(size)}}</div>
  <div v-if="info && info.length > 0" class="dataItemTitle">{{info}}</div>
</div>
</template>

<style lang="scss" scoped>
  .dataItem {
    min-width: 120px;
    padding: 16px;
    text-align: center;
    &Title{
      color: #686868;
      font-size: 14px;
      margin-bottom: 10px;
    }
    &Number{
      font-weight: bold;
      color: #313131;
      font-size: 28px;
    }
    &:hover {
      border-radius: 10px;
      // TODO:
      // background: @active-background;
      background-color: #e6f1ff;
    }
  }
</style>

