<template>
  <!-- 主体 -->
  <div class="organization-layout-wrap" style="display: flex; height: 100%;">
    <!-- 侧边栏-->
    <!-- <teleport v-if="isShowMenu" to="#menu-teleport-target"> -->
      <div class="menu-tab">
        <el-menu router :default-active="currentRouter" class="orgnization-navbar" mode="vertical">
          <el-menu-item v-if="!isMySpace" index="/relation/department">部门维护</el-menu-item>
          <el-menu-item v-if="!isMySpace" index="/relation/group">集团维护</el-menu-item>
          <el-menu-item index="/relation/cohort">群组维护</el-menu-item>
          <el-menu-item index="/relation/friend">好友维护</el-menu-item>
        </el-menu>
      </div>
    <!-- </teleport> -->
    <!-- 内容区域home -->
    <router-view />
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'

  const store = useUserStore()
  const router = useRouter()
  const { workspaceData,queryInfo } = storeToRefs(store)

  const isMySpace = ref<boolean>(workspaceData.value.id == queryInfo.value.id)
  // const isMySpace = ref<boolean>(true)
  const isShowMenu = ref<boolean>(false)
  
  const currentRouter = ref<string>(router.currentRoute.value.fullPath)
 
  if(workspaceData.value.id == queryInfo.value.id){
    currentRouter.value = "/relation/cohort"
  }else{
    currentRouter.value = "/relation/department"
  }
  router.push(currentRouter.value)

  onMounted(() => {
    isShowMenu.value = true
  })
</script>

<style lang="scss" scoped>
  .organization-wrap {
    // .el-menu--horizontal > .el-menu-item {
    //   font-size: 18px;
    //   &:hover,
    //   &.is-active {
    //     background-color: none !important;
    //     color: $mainColor !important;
    //   }
    //   &.is-active {
    //     border-bottom: 2px solid $mainColor;
    //   }
    // }
    // .el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
    // .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    //   background: none !important;
    // }
    display: flex;
    flex-direction: column;
  }
  .menu-tab {
    width: 140px;
    // height: calc(100% - 15px);
    // background: #fff;
    // border-right: solid 1px var(--el-menu-border-color);
    background-color: var(--el-bg-color-overlay);
    .orgnization-navbar  {
      height: 100%;
    }
    // .is-active{
      // background-color: #f4f4f4;
    // }

    // .el-menu {
    //   border: none;
    // }
  }
  .resize {
    cursor: col-resize;
    float: left;
    position: relative;
    left: 2px;
    top: 45%;
    background-color: #d6d6d6;
    border-radius: 5px;
    width: 4px;
    height: 50px;
    background-size: cover;
    background-position: center;
    /*z-index: 99999;*/
    font-size: 12px;
    padding-top: 6px;
    padding-left: 1px;
    color: white;
  }
  /*拖拽区鼠标悬停样式*/
  .resize:hover {
    color: #444444;
  }
  :deep(.el-select) {
    width: 100%;
  }
</style>
