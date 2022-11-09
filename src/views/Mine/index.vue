<template>
    <!-- <div class="organization-layout-wrap" style="display: flex; height: 100%;">
        <div class="menu-tab">
          <el-menu router :default-active="currentRouter" class="orgnization-navbar" mode="vertical">
            <el-menu-item index="/mine/mine">个人信息</el-menu-item>
            <el-menu-item index="/mine/Certificate">证书管理</el-menu-item>
          </el-menu>
        </div> -->
        <router-view />
    <!-- </div> -->
  </template>
  <script lang="ts" setup>
    // @ts-nocheck
    import { computed } from 'vue'

    const router = useRouter()
    // 当前路由
    const currentRouter = computed(()=> router.currentRoute.value.fullPath)
   
    router.push(currentRouter.value)
  
  </script>
  
  <style lang="scss" scoped>
    .organization-wrap {
      display: flex;
      flex-direction: column;
    }
    .menu-tab {
      width: 140px;
      background-color: var(--el-bg-color-overlay);
      .orgnization-navbar  {
        height: 100%;
      }
    }
    :deep(.el-select) {
      width: 100%;
    }
  </style>
  