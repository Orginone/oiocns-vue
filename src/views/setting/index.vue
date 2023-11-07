<template>
    <headContent ></headContent>
    <RouterContent v-if="setting.showMenu" :menuList="setting.menuList"></RouterContent>
    <!-- 多级菜单组件抽取 -->
</template>
  
<script lang="ts" setup>
import headContent from '../Layout/components/headContent.vue';
import RouterContent from '../Layout/components/routerContent.vue';
import * as config from './config/menuOperate';
const activeIndex='';
const setting = reactive<any>({
    menuList:{},
    showMenu:false,
})
setting.menuList = await config.loadBrowserMenu();
setTimeout(async () => {
    setting.menuList = await config.loadBrowserMenu();
    nextTick(()=>{
        setting.showMenu = true;
    })
}, 1000);
watch(
  ()=>setting.menuList,
  (val,newval)=>{
    //   console.log("setting",val,newval)
  },
  {
      immediate:true,
      deep:true,
  }
)
</script>
<style>

</style>
  