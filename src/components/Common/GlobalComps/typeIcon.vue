<template>
  
</template>

<script setup lang="ts">
import { TargetType } from '@/ts/core';

// 接收参数
const props = defineProps<{
  avatar?: boolean;
  size?: number;
  iconType: string;
}>()

const iconSize = props.size || 12;

</script>

<style lang="scss" scoped>

</style>
