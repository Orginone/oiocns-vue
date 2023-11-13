<template>
  <div class="router">
    <div class="menu">
      <div class="menu-head">
        <orgIcons :url="'setting'"></orgIcons>
        <div>管理</div>
      </div>
      <!-- --{{menuList}}-- -->
      <div class="meni-common">
        <!-- <MenuList :items="menuList" @select="changeActive" :active-index="data.key"/> -->
        <el-tree :data="data.newMenuList" :props="defaultProps" @node-click="handleNodeClick" />

      </div>
    </div>
    <div class="active">
      <div class="view-nav">
        <div class="view-nav-item" @click="changeNav('全部')">
          <span :class="showType =='全部'?'view-nav-item-active':''">全部</span> 
        </div>
        <div class="view-nav-item" @click="changeNav('群组')">
          <span :class="showType =='群组'?'view-nav-item-active':''">群组</span> 
        </div>
        <div class="view-nav-item" @click="changeNav('部门')">
          <span :class="showType =='部门'?'view-nav-item-active':''">部门</span> 
        </div>
      </div>
      <listContent></listContent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import listContent from './listContent.vue';
import { findMenuItemByKey } from "@/utils/tools";
import orgCtrl from "@/ts/controller";
import * as config from "@/views/setting/config/menuOperate";
import { setCenterStore } from "@/store/setting";
const store= setCenterStore();
const ctrl = orgCtrl;
const data = reactive<any>({
  key:"",
  newMenuList:[]
})
const defaultProps = {
  children: 'children',
  label: 'label',
}
const props = defineProps({
  menuList: {
    type:Object
  },
})
// const emit = defineEmits(['select'])
watch(
  ()=>props.menuList,
  (val,preVal)=>{
      //val为修改后的值,preVal为修改前的值
      // console.log("message",val)
      data.newMenuList.push(props.menuList)
  },
  {
      immediate:true,
      deep:true,
  }
)
const handleNodeClick = async (item: any) => {
  ctrl.currentKey = item.key;
  let newMenus = await config.loadBrowserMenu();
  var item:any = findMenuItemByKey(newMenus, ctrl.currentKey);
  if (item?.beforeLoad) {
    await item.beforeLoad();
  }
  store.setCurrItem(item);
  if (item === undefined) {
    item = newMenus;
  }
}
console.log('ac',props);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const showType = ref('');
const changeNav = (name:string)=>{
  showType.value = name
}
const changeActive = (key:any)=>{
    // data.key = obj.key
}
</script>

<style lang="scss" scoped>
  .router {
    display: flex;
    height: calc(100% - 65px);
    width: 100%;
    .menu {
      width: 250px;
      background-color: #fafafa;
      border-right: 1px solid #efefef;
      .menu-head {
        height: 50px;
        border-bottom: 1px solid #efefef;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .active {
      flex: 1;
      box-sizing: border-box;
      padding: 12px;
      width: 100%;
      .view-nav {
        height: 35px;
        border-bottom: 1px solid #efefef;
        display: flex;
        font-size: 12px;
        .view-nav-item {
          margin-right: 10px;
          height: 20px;
          border-right: 1px solid #efefef;
          padding-right: 10px;
          box-sizing: content-box;
          span{
            padding:4px 16px;
          }
        }
        
        .view-nav-item:last-child{
          border-right: 0;
        }
        .view-nav-item-active{
          
          background: #3838b9;
          border-radius: 20px;
          color: #fff;
        }
      }
    }
  }
</style>
