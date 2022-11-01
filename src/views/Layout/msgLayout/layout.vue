<template>
  <!--    主体-->
  <div style="display: flex; height: 100%;">
    <!--      侧边栏-->
    <userAside />
    <transition name="fade">
    <!--      内容区域home-->
    <router-view style="flex: 1" />
  </transition>
  </div>
</template>

<script setup lang="ts">
import userAside from './userAside.vue'
</script>

<style scoped>
</style>
