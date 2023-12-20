

<script lang="ts" setup>
import Content from './content/index.vue';
import MainLayout from '@/components/MainLayout/index.vue';
import * as config from "./config/menuOperate";
import useMenuUpdate from '@/hooks/useMenuUpdate'
const {key, rootMenu, selectMenu,onSelectMenu} = useMenuUpdate(config.loadBrowserMenu)

const store = reactive({
  showMenu: false,
  key:key,
  rootMenu:rootMenu,
  selectMenu:selectMenu,
  setSelectMenu:onSelectMenu
});
const mainShow = () => {
  if(store.selectMenu){
    nextTick(() => { 
      store.showMenu = true;
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
  <MainLayout
    v-if="store.showMenu"
    rightShow
    :previewFlag="'store'"
    :selectMenu="store.selectMenu"
    :onSelect="async (data) => store.setSelectMenu(data)"
    :siderMenuData="store.rootMenu"
  >
    <Content :key="key" :current="store.selectMenu.item" />
  </MainLayout>
</template>