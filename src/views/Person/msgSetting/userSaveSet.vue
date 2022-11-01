<template>
  <div class="userSaveSet">
    <div class="pageHeader">
      <div class="title">安全设置</div>
    </div>
    <div class="body">
      <Save />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ArrowLeft } from '@element-plus/icons-vue'
  import Save from '../components/save.vue'
  import { reactive, ref } from 'vue'
  const formLabelAlign = reactive({
    dd: ''
  })
</script>
<style lang="scss" scoped>
  .userSaveSet {
    height: 100%;
    // background-color: #eff0f4;
    display: flex;
    flex-direction: column;
    .pageHeader {
      width: 100%;
      // height: 60px;
      background-color: var(--el-bg-color);
     
      .title {
        padding-top: 30px;
        padding-left: 30px;
        // padding-bottom: 30px;
        font-size: 20px;
        font-weight: 600;
      }
    }
    .body {
      // height: 60%;
      flex: 1;
      // width: 100%;
      background-color: var(--el-bg-color);
      padding:  24px 30px;
      // border-left: 10px solid #eff0f4;
      // border-top: 16px solid #eff0f4;
      // border-right: 16px solid #eff0f4;
    }
  }
</style>
