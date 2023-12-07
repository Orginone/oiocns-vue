

<script lang="ts" setup>
import Content from './content/index.vue';
import MainLayout from '@/components/MainLayout/index.vue';
import * as config from "./config/menuOperate";
import useMenuUpdate from '@/hooks/useMenuUpdate'
const {key, rootMenu, selectMenu,onSelectMenu:setSelectMenu} = await useMenuUpdate(config.loadBrowserMenu)

const setting = reactive({
  showMenu: false,
});
setTimeout(async () => {
  nextTick(() => {
    setting.showMenu = true;
  });
}, 2000);
</script>

<template>
  <MainLayout
    v-if="setting.showMenu"
    rightShow
    :previewFlag="'setting'"
    :selectMenu="selectMenu"
    :onSelect="async (data) => setSelectMenu(data)"
    :siderMenuData="rootMenu"
  >
    <Content :key="key" :current="selectMenu.item" />
  </MainLayout>
</template>