
<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
  import { getCurrentInstance } from 'vue'

  const instance = getCurrentInstance()
  instance?.proxy?.$Bus.on('clickBus', (num) => {
    if(num === '301') {
      console.log('发起业务')
    }else if(num === '302') {
      console.log('重命名')
    }else if(num === '303') {
      console.log('删除应用')
    }
  })
</script>


<style lang="scss" scoped>
  
</style>
