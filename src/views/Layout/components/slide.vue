<template>
    <div class="slide">
        <div class="item" v-for="(item,index) in actions" :key="index">
            <orgIcons :url="item.icon"></orgIcons>
            <div class="item-text">{{item.text}}</div>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
    import { getCurrentInstance, onMounted} from 'vue'
  
    const { proxy } = getCurrentInstance()
    const msgCount:Number = 0;
    const workCount:Number = 0;
    const actions = [
      {
        text: '门户',
        icon: 'home',
        path: '/home',
        count: 0,
      },
      {
        text: '沟通',
        icon: 'chat',
        path: '/chat',
        count: msgCount,
      },
      {
        text: '办事',
        icon: 'work',
        path: '/work',
        count: workCount,
      },
      {
        text: '存储',
        icon: 'store',
        path: '/store',
        count: 0,
      },
      {
        text: '设置',
        icon: 'setting',
        path: '/setting',
        count: 0,
      },
    ];
  </script>
  
  <style lang="scss" scoped>
    .slide{
      width: 60px;
      height: 100%;
      background-color: #fafafa;
      border-right: rgba(227,226,226,.8) solid 1px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .item{
      padding: 10px 0;
      img{
        width: 26px;
        height: 26px;
      }
      .item-text{
        font-size: 12px;
        line-height: 18px;
        color: #888;
      }
    }
  
  </style>
  