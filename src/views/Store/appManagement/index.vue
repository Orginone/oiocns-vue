<template>
  <div class="main">
      <detail ></detail>
      <!-- <management></management> -->
  </div>
</template>
  
  <script setup lang="ts">
    import detail from './components/detail.vue'
    import management from './components/management.vue'
    import { ref, onMounted, } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import {appCtrl} from '@/ts/coreIndex'
    const router = useRouter()
    onMounted(() => {
      if(!appCtrl.curProduct){
        router.go(-1)
      }
    })
    
  </script>
  <style lang="scss">
    .el-dropdown-link{
      padding: 2px 10px;
      cursor: pointer;
      border-radius: 10px;
    }
    .el-dropdown-link:hover{
      background:#1642cb;
      color: #fff;
    }
  </style>
  <style lang="scss" scoped>
    .main{
      width: 100%;
      height: calc(100% - 60px);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;
      border-top: 3px solid #f0f4f8;
    }
  </style>
  