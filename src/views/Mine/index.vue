<template>
  <div class="user-page--index">
    <UserInfo />
    <router-view />
  </div>      

</template>
<script setup lang="ts">
import UserInfo from "./components/UserInfo.vue";
</script>
<style lang="scss">
.user-page--index {
  display: flex;
  flex-direction: column;
  height: 100%;
  > :last-child {
    flex: 1;
  }
}
</style>
