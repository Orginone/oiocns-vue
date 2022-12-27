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
    import { useRouter, useRoute } from 'vue-router'
    import {appCtrl} from '@/ts/coreIndex'

    const router = useRouter()
    const info = ref<Object>();
    const getInfo = async () =>{
      console.log('router.currentRoute.value.query.id',router.currentRoute.value.query.id)
      const id:string= router.currentRoute.value.query.id.toString();
      if(!appCtrl.curProduct){
        router.go(-1)
      }else{
        let obj = {
          name: appCtrl.curProduct.prod.name,
          remark: appCtrl.curProduct.prod.remark,
          createUser: appCtrl.curProduct.prod.createUser,
          createTime: appCtrl.curProduct.prod.createTime,          
        }
        info.value = obj;
      }
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
  