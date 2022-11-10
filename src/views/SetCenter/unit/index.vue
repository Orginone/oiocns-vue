<template>
    <div class="main">
      <div class="container mainBox" ref="container">
        <div class="content">
          <div class="info" ref="infoWrap">
            <Info ref="info" />
          </div>
          <!-- 卡片组件测试 -->
          <!-- <divcard>
            <template #dropdown>
              <el-dropdown placement="bottom-start">
                <span class="el-dropdown-link"> ··· </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>详情</el-dropdown-item>
                    <el-dropdown-item>管理</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </divcard> -->
        </div>
      </div>
    </div>
  </template>
  <script lang="ts" setup>
    import Info from './components/info.vue'
    import { ref } from 'vue'
    import divcard from "@/components/divCard/index.vue";
  
    const info = ref(null)
    const container = ref(null)
    const infoWrap = ref(null)

  </script>
  <style lang="scss" scoped>
    /*拖拽区鼠标悬停样式*/
    :deep(.el-select) {
      width: 100%;
    }
    .main {
      width: 100%;
      height: 100%;
    }
    .container {
      width: 100%;
      height: 100%;
      background: #f0f2f5;
      padding: 3px 0;
      box-sizing: border-box;
  
      .content {
        height: 100%;
        background-color: var(--el-bg-color-overlay);
        box-sizing: border-box;
        overflow: hidden;
        .info {
          padding: 0 0 3px 0;
          box-sizing: border-box;
        }
      }
    }
  </style>
  