<template>
    <div class="head">
    <div class="router-link">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img src="/svg/home.svg" alt="">门户
          <el-tag class="ml-2" type="success">群组</el-tag>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>列表 1</el-dropdown-item>
            <el-dropdown-item>列表 2</el-dropdown-item>
            <el-dropdown-item>列表 3</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="router-link">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img src="/svg/home.svg" alt="">设置
          <el-tag class="ml-2" type="success">菜单</el-tag>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>列表 1</el-dropdown-item>
            <el-dropdown-item>列表 2</el-dropdown-item>
            <el-dropdown-item>列表 3</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="router-link">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img src="/svg/home.svg" alt="">目录
          <el-tag class="ml-2" type="success">目录</el-tag>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>列表 1</el-dropdown-item>
            <el-dropdown-item>列表 2</el-dropdown-item>
            <el-dropdown-item>列表 3</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { getCurrentInstance, onMounted} from 'vue';
    onMounted(() => {
  
    })
    const handleOpen = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
      console.log(key, keyPath)
    }
  </script>
  
  <style lang="scss" scoped>
      .head{
        height: 65px;
        border-bottom: 2px solid #efefef;
        display: flex;
        .router-link{
          position: relative;
          display: flex;
          min-width: 100px;
          padding: 0 20px;
          margin-right: 10px;
          align-items: center;
          justify-content: center;
          img{
            width: 12px;
            margin-right: 10px;
          }
          .ml-2{
            margin: 0 5px;
          }
        }
        .router-link::after{
          content: '';
          position: absolute;
          color: rgba(0,0,0,.45);
          font-size: 16px;
          right: 0;
          top: 50%;
          margin-top: -6px;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 6px solid #aaa;
        }
        .router-link:last-child::after{
          content: '';
          display: none;
        }
      }

  </style>
  