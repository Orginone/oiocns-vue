<script setup lang="ts">
import Content from './content/index.vue'
import * as config from './config/menuOperate'
import MainLayout from '@/components/MainLayout/index.vue'
import useMenuUpdate from '@/hooks/useMenuUpdate'
import { Search } from '@element-plus/icons-vue'
import { command } from '@/ts/base'

// 搜索关键词
const filter = ref<string>('')
const {key, rootMenu, selectMenu,onSelectMenu:setSelectMenu} = useMenuUpdate(config.loadChatMenu)

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
      <Content :filter="filter" />
    </MainLayout>
  </template>
</template>

<style lang="scss" scoped></style>

