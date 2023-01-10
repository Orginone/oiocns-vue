<template>
  <div class="main">
    <div class="container mainBox">
      <div class="content">
        <div class="info">
          <Info ref="info" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Info from './components/info.vue'
  // import User from './components/User.vue'
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  import { ElMessage } from 'element-plus'
  import { setCenterStore } from '@/store/setting'
  const settingStore = setCenterStore()

  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)

  const info = ref(null)
  const user = ref(null)
  // 给相应组件传值
  const nodeClick = (selectItem: any) => {
    settingStore.unitInfo = selectItem
    info.value.selectItemChange(selectItem)
    user.value?.selectItemChange(selectItem)
  }
  //获取部门信息
  onMounted(() => {
    if(store?.workspaceData?.name == '个人空间') {
      ElMessage({
        message: '当前处于个人空间',
        type: 'warning'
      })
    }
  })


</script>
<style lang="scss" scoped>
  /*拖拽区鼠标悬停样式*/
  :deep(.el-select) {
    width: 100%;
  }
  .main {
    width: 100%;
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .content {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 3px 0;
      .info {
        padding: 0 0 3px 0;
        height: 100%;
        box-sizing: border-box;
      }
      .body {
        height: 100%;
        background: #fff;
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    }
  }
</style>
