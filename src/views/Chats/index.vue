<script setup lang="ts">
import Content from './content/index.vue'
import * as config from './config/menuOperate'
// import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Search } from '@element-plus/icons-vue';
import { ISession } from '@/ts/core';
import { command } from '@/ts/base';
import { MenuItemType } from '@/typings/globelType';
import Book from './book/index.vue'
import SessionBody from './temporary/SessionBody.vue'
import orgCtrl from '@/ts/controller'

import headContent from '../Layout/components/headContent.vue';
import RouterContent from '../Layout/components/routerContent.vue';

// 搜索关键词
const filter = ref<string>('')
const [key, rootMenu, selectMenu,setSelectMenu] = useMenuUpdate(config.loadChatMenu)

// 菜单点击回调
const onMenuClick = async (data:MenuItemType, key:string) => {
  const chat = data.item as ISession;
  switch (key) {
    case '清空消息':
      await chat.clearMessage();
      break;
    case '标记为未读':
      selectMenu.value = rootMenu.value;
      chat.chatdata.noReadCount += 1;
      command.emitterFlag('session');
      break;
  }
}


</script>

<template>
  <template v-if="selectMenu&&rootMenu">
  <!-- <MainLayout
    :selectMenu="selectMenu"
    :onSelect="async (data) => setSelectMenu(data)"
    :onMenuClick="onMenuClick"
    :siderMenuData="rootMenu"
  > -->
    <!-- TODO:保留：头部右侧的搜索栏 -->
    <ElInput 
      v-model="filter"
      style="height: 30px; font-size: 15px;"
      placeholder="搜索"
      clearable
      :prefix-icon="Search"
    />
    <div style="display: flex;">
      <!-- TODO:保留：沟通—通讯录 -->
      <div style="width: 50%;"><Book :key="key" :chats="selectMenu.item" :filter="filter" /></div>
      <!-- TODO:移到MainLayout/session中去 -->
      <div style="width: 50%;"><SessionBody :target="orgCtrl.chats[3].target" :session="orgCtrl.chats[3]"/></div>
    </div>
  <!-- </MainLayout> -->
  </template>
</template>

<style lang="scss" scoped></style>

