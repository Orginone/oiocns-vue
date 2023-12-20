<template>
  <div class="head">
    <div class="head-left">
      <div class="router-link">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img src="/svg/home.svg" alt="" />设置
            <el-tag class="ml-2" type="success">群组</el-tag>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="router-link">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img src="/svg/home.svg" alt="" />我的
            <el-tag class="ml-2" type="success">菜单</el-tag>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="router-link">
        <el-dropdown>
          <span class="el-dropdown-link">
            <img src="/svg/home.svg" alt="" />目录
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
    <div class="head-right">
        <div class="left-bar" @click="!leftShow">
          <div :class="leftShow?'active':''"></div>
        </div>
        <div class="right-bar" @click="!rightShow">
          <div :class="rightShow?'active':''" ></div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted } from "vue";
const leftShow = ref<boolean>(false)
const rightShow = ref<boolean>(false)

</script>

<style lang="scss" scoped>
.head {
  height: 65px;
  border-bottom: 2px solid #efefef;
  display: flex;
  justify-content: space-between;
  .head-left{
    display: flex;
  }
  .router-link {
    position: relative;
    display: flex;
    min-width: 100px;
    padding: 0 20px;
    margin-right: 10px;
    align-items: center;
    justify-content: center;
    img {
      width: 12px;
      margin-right: 10px;
    }
    .ml-2 {
      margin: 0 5px;
    }
  }
  .head-right{
    display: flex;
    align-items: center;
    .left-bar,.right-bar{
      width: 18px;
      height: 20px;
      border: 2px solid rgb(148, 152, 223);
      border-radius: 4px;
      margin-right: 10px;
    }
    .left-bar{
      div{
        width: 5px;
        height: 100%;
        border-right: 2px solid rgb(148, 152, 223);
     
      }
      .active{
        background: rgb(148, 152, 223);
      }
    }
    .right-bar{
      overflow: hidden;
      div{
        width: 8px;
        background: #fff;
        height: 18px;
        margin-left: 6px;
        border-left: 2px solid rgb(148, 152, 223);
      }
      .active{
        background: rgb(148, 152, 223);
      }
    }
  }
  .router-link::after {
    content: "";
    position: absolute;
    color: rgba(0, 0, 0, 0.45);
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
  .router-link:last-child::after {
    content: "";
    display: none;
  }
}
</style>
