<template>
  <div class="userAccountBind">
    <div class="pageHeader">
      <div class="title">账号绑定</div>
    </div>
    <div class="body">
      <Account />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ArrowLeft } from '@element-plus/icons-vue'
  import Account from '../components/account.vue'
  import { reactive, ref } from 'vue'
  const formLabelAlign = reactive({
    dd: ''
  })
</script>
<style lang="scss" scoped>
  .userAccountBind {
    height: 100%;
    background-color: #eff0f4;

    .pageHeader {
      width: 100%;
      height: 70px;
      background-color: #fff;
      .header {
        margin-top: 20px;
        margin-left: 30px;
      }
      .title {
        padding-top: 20px;
        margin-left: 30px;
        font-size: 20px;
        font-weight: 600;
      }
    }
    .body {
      height: 60%;
      width: 100%;
      background-color: #fff;
      border-left: 10px solid #eff0f4;
      border-top: 16px solid #eff0f4;
      border-right: 16px solid #eff0f4;
      display: flex;
    }
    .bottom {
      height: calc(100vh - 760px);
      background-color: #eff0f4;
      display: flex;
      .content {
        margin: auto;
        color: #aaa;
      }
    }
  }
</style>
