

<script lang="ts" setup>
import Content from './content/index.vue';
import MainLayout from '@/components/MainLayout/index.vue';
import * as config from "./config/menuOperate";
import useMenuUpdate from '@/hooks/useMenuUpdate'
const {key, rootMenu, selectMenu,onSelectMenu} = useMenuUpdate(config.loadBrowserMenu)

const setting = reactive({
  showMenu: false,
  key:key,
  rootMenu:rootMenu,
  selectMenu:selectMenu,
  setSelectMenu:onSelectMenu
});
const mainShow = () => {
  if(setting.selectMenu){
    nextTick(() => { 
      setting.showMenu = true;
    });
  }else{
    setTimeout(()=>{
      mainShow();
    },100)
  }
}
mainShow();
</script>

<template>
  <!-- <MainLayout
    v-if="setting.showMenu"
    rightShow
    :previewFlag="'setting'"
    :selectMenu="setting.selectMenu"
    :onSelect="async (data) => setting.setSelectMenu(data)"
    :siderMenuData="setting.rootMenu"
  >
    <Content :key="setting.key" :current="setting.selectMenu.item" />
  </MainLayout> -->
  <AppLayout :previewFlag='"relation"'>
    <template v-slot:content>
      <Content :selectMenu="selectMenu"/>
    </template>
  </AppLayout>
</template>