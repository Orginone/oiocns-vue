<template>
  <div class="router">
    <div class="menu">
      <div class="menu-head">
        <orgIcons :url="'setting'"></orgIcons>
        <div>管理</div>
      </div>
      <div class="meni-common">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon><location /></el-icon>
              <span>目录</span>
            </template>
            
            <el-menu-item index="1-1">目录1</el-menu-item>
            <el-menu-item index="1-2">目录2</el-menu-item>
            <el-menu-item index="1-3">目录3</el-menu-item> 
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon><icon-menu /></el-icon>
            <span>目录2</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <el-icon><document /></el-icon>
            <span>目录</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><setting /></el-icon>
            <span>目录</span>
          </el-menu-item>
        </el-menu>
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
import { getCurrentInstance, onMounted } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
onMounted(() => {});
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const showType = ref('');
const changeNav = (name:string)=>{
 
  showType.value = name
  console.log('name',showType.value)
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
