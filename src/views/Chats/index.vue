<script setup lang="ts">
import Content from './content/index.vue';
// import * as config from './config/menuOperate';
// import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Search } from '@element-plus/icons-vue';
import { ISession } from '@/ts/core';
import { command } from '@/ts/base';

import headContent from '../Layout/components/headContent.vue';
import RouterContent from '../Layout/components/routerContent.vue';

// 顶部右侧搜索相关
const filter = ref<string>('')

</script>

<template>
  <headContent />
  <!-- 头部右侧的搜索栏 -->
  <ElInput 
    v-model="filter"
    style="height: 30px; font-size: 15px;"
    placeholder="搜索"
    clearable
    :prefix-icon="Search"
  />
  <RouterContent />
</template>

<style lang="scss" scoped></style>

