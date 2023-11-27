<template>
    <headContent ></headContent>
    <routerContent v-if="setting.showMenu" 
        :menuList="setting.menuList"
        :selectMenu="selectMenu" 
        :siderMenuData="rootMenu"
        :onSelect="setSelectMenu"></routerContent>
    <!-- 多级菜单组件抽取 -->
</template>
  
<script lang="ts" setup>
import { watch, onMounted } from 'vue'
import headContent from '../Layout/components/headContent.vue';
import routerContent from '../Layout/components/routerContent.vue';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';

const activeIndex='';
const setting = reactive<any>({
    menuList:{},
    showMenu:false,
})

const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadBrowserMenu,
);

onMounted(()=>{
    setting.menuList = config.loadBrowserMenu()
    if (!selectMenu.value || !rootMenu.value){
        setting.showMenu = false
    }else{
        setting.showMenu = true
    }
})
</script>
<style>

</style>
  