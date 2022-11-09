<template>
  <!-- 主体 -->
  <div class="organization-layout-wrap" style="display: flex; height: 100%;">
    <!-- 侧边栏-->
      <!-- <div class="menu-tab" v-if="currentRouter === '/setCenter/unit'">
        <el-menu router :default-active="currentRouter" class="orgnization-navbar" mode="vertical">
          <el-menu-item index="/setCenter/unit">单位设置</el-menu-item>
          <el-menu-item index="/setCenter/department">部门设置</el-menu-item>
          <el-menu-item index="/setCenter/group">集团设置</el-menu-item>
          <el-menu-item index="/setCenter/post">岗位设置</el-menu-item>
        </el-menu>
      </div> -->
      <!-- 内容区域home -->
      <router-view />
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import { ref, computed } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'

  // 菜单数据
  const menuDataList = ref([
    {
      name: '组织设置',
      children: [
        { index: '/setCenter/unit', name: '单位设置' },
        { index: '/setCenter/department', name: '部门设置' },
        { index: '/setCenter/group', name: '集团设置' },
        { index: '/setCenter/post', name: '岗位设置' },
      ]
    },
    {
      name: '配置中心',
      children: [
        { index: '/setCenter/unit', name: '单位首页' },
        { index: '/setCenter/department', name: '数据设置' },
        { index: '/setCenter/group', name: '资源设置' },
        { index: '/setCenter/post', name: '应用设置' },
        { index: '/setCenter/post', name: '流程设置' },
        { index: '/setCenter/post', name: '标准设置' },
        { index: '/setCenter/post', name: '权限设置' }
      ]
    }
  ])

  const store = useUserStore()
  const router = useRouter()
  const { workspaceData,queryInfo } = storeToRefs(store)

  const isMySpace = ref<boolean>(workspaceData.value.id == queryInfo.value.id)
  // 当前路由
  const currentRouter = computed(()=> router.currentRoute.value.fullPath)
 
  router.push(currentRouter.value)

</script>

<style lang="scss" scoped>
  .organization-wrap {
    display: flex;
    flex-direction: column;
  }
  .menu-tab {
    width: 140px;
    background-color: var(--el-bg-color-overlay);
    .orgnization-navbar  {
      height: 100%;
    }
  }
  :deep(.el-select) {
    width: 100%;
  }
</style>
