<script setup lang="ts">
import Content from './content/index.vue'
import * as config from './config/menuOperate'
import MainLayout from '@/components/MainLayout/index.vue'
import useMenuUpdate from '@/hooks/useMenuUpdate'
import { Search } from '@element-plus/icons-vue'
import { ISession } from '@/ts/core'
import { command } from '@/ts/base'
import { MenuItemType } from '@/typings/globelType'

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
    <MainLayout
      preview-flag="chat"
      :selectMenu="selectMenu"
      :onSelect="async (data) => setSelectMenu(data)"
      :siderMenuData="rootMenu"
      right-show
    >
      <!-- 头部右侧的搜索栏 -->
      <template #rightBar>
        <ElInput 
          v-model="filter"
          style="height: 30px; font-size: 15px;"
          placeholder="搜索"
          clearable
          :prefix-icon="Search"
        />        
      </template>
      <!-- 通讯录 -->
      <Content :key="key" :chats="selectMenu.item" :filter="filter" />
    </MainLayout>
  </template>
</template>

<style lang="scss" scoped></style>

