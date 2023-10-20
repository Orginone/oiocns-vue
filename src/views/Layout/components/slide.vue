<template>
  <div class="nav">
    
    <div class="slide">
      <div class="user">
        <!-- TODO:改用entityicon -->
        <img src="/svg/home.svg" alt="" />
      </div>
      <RouterLink 
        :to="item.path"
        class="item" 
        v-for="(item, index) in actions" :key="index"
        @click=""
      >
        <orgIcons :url="item.icon"></orgIcons>
        <div class="item-text">{{ item.text }}</div>
      </RouterLink>
    </div>
    <div class="exit" url="exit">
      <orgIcons :url="'exit'"></orgIcons>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, onMounted } from "vue";
import orgIcons from "@/components/Common/GlobalComps/orgIcons.vue";
const { proxy } = getCurrentInstance();
const msgCount: Number = 0;
const workCount: Number = 0;
const actions = [
  {
    text: "门户",
    icon: "home",
    path: "/home",
    count: 0,
  },
  {
    text: "沟通",
    icon: "chat",
    path: "/chat",
    count: msgCount,
  },
  {
    text: "办事",
    icon: "work",
    path: "/work",
    count: workCount,
  },
  {
    text: "存储",
    icon: "store",
    path: "/store",
    count: 0,
  },
  {
    text: "设置",
    icon: "setting",
    path: "/setting",
    count: 0,
  },
];
</script>

<style lang="scss" scoped>  
.nav{
  width: 60px;
  height: 100%;
  background-color: #fafafa;
  border-right: rgba(227,226,226,.8) solid 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .slide{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .user{
    margin: 10px 0;
    img{
      width: 45px;
      height: 45px;
    }
  }
  .exit{
    margin-bottom: 10px;
  }
}
.item {
  padding: 10px 0;
  img {
    width: 26px;
    height: 26px;
  }
  .item-text {
    font-size: 12px;
    line-height: 18px;
    color: #888;
  }
}
</style>
