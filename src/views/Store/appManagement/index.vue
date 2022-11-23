<template>
  <div class="main">
      <detail :info="info"></detail>
      <management></management>
  </div>
</template>
  
  <script setup lang="ts">
    import detail from './components/detail.vue'
    import management from './components/management.vue'
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { appstore, Application } from '@/module/store/app'
    import { useRouter, useRoute } from 'vue-router'
    const router = useRouter()
    const info = ref<Object>();
    const getInfo = async () =>{
      console.log('router.currentRoute.value.query.id',router.currentRoute.value.query.id)
      const id:string= router.currentRoute.value.query.id.toString();
      info.value = await appstore.queryInfo(id)
      console.log('data',info)
    }
    onMounted(() => {
      getInfo();
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
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
      border-top: 3px solid #f0f4f8;
    }
  </style>
  