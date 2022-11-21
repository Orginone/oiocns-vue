<template>
  <div class="container mainBox" ref="container">
    <div class="content mid box">
      <div class="info" ref="infoWrap">
        <admin-table />
      </div>
      <div class="body" ref="bodyWrap">
        <post-table />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import adminTable from './components/adminTable.vue'
  import postTable from './components/postTable.vue'
  import { getCurrentInstance } from "vue";

  const { proxy } = getCurrentInstance()

  proxy?.$Bus.on('clickBus', (id) => {
    console.log(id);
  })

</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    padding: 3px 0;
    box-sizing: border-box;
    display: flex;
    .content {
      width: 100%;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      overflow: hidden;
      .info {
        height: calc(50%);
        padding: 0 0 3px 0;
        box-sizing: border-box;
      }
      .body {
        height: calc(50%);
      }
    }
  }
</style>
