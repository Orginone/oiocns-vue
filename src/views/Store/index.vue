<script lang="ts" setup>
import Content from './content/index.vue';
import MainLayout from '@/components/MainLayout/index.vue';
import AppLayout from '@/components/MainLayout/appLayout.vue';
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
  <AppLayout :previewFlag='"store"'>
    <template v-slot:content>
      <Content :selectMenu="selectMenu"/>
    </template>
  </AppLayout>
</template>