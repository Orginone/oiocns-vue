<template>
  <el-container class="pages home-wrap">
    <!-- 头 -->
    <el-header class="page-header">
      <CustomHeadr />
    </el-header>
    <el-container>
      <!-- 主导航 -->
      <div class="menu-list" v-if="router.currentRoute.value.path !='/workHome'">
        <MenuNav :data="menuArr" :titleData="titleArr"></MenuNav>
      </div>
      <div class="layout-main">
          <!-- 面包屑 -->
        <div class="breadcrumb-box"  v-if="router.currentRoute.value.path !='/workHome'">
          <Breadcrumb></Breadcrumb>
        </div>
        <!-- main -->
        <el-main class="main-wrap">
          <Suspense>
            <template #default>
              <router-view v-slot="{ Component }">
                <!-- <transition name="fade-transform"> -->
                <keep-alive v-if="$route.meta.keepAlive">
                  <component :is="Component" />
                </keep-alive>
                <component v-else :is="Component" />
                <!-- </transition> -->
              </router-view>
            </template>

            <template #fallback>
              <LoadingVue />
            </template>
          </Suspense>
        </el-main>
      </div>
      <!-- </el-container> -->
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
  import CustomHeadr from './components/customHeader.vue'
  import MenuNav    from '@/components/menuItem/index.vue'
  import Breadcrumb from '@/components/divBreadcrumb/index.vue'
  import LoadingVue from './components/loading.vue'
  import { useUserStore } from '@/store/user'
  import authority from '@/utils/authority'
  import { onBeforeMount, onBeforeUnmount,reactive } from 'vue'
  import { useRouter } from 'vue-router';
  import storeJosn from './json/store.json';
  import { chat } from '@/module/chat/orgchat'
  let router = useRouter()
  console.log(storeJosn);
  
  const titleArr = reactive(storeJosn[0])
  const menuArr = reactive(storeJosn)
  onBeforeMount(async () => {
    await authority.Load()
    chat.start(useUserStore().userToken)
  })

  onBeforeUnmount(() => {
    chat.stop()
    window.removeEventListener('beforeunload', chat.stop)
  })

  // 页面刷新时 关闭握手
  window.addEventListener('beforeunload', chat.stop)
</script>

<style lang="scss" scoped>
  .menu-list{
    width: auto;
    padding-right: 3px;
    background: #eff4f9;
  }
  .el-header {
    --el-header-padding: 0 0 0 16px;
  }

  .el-footer {
    background: rgb(240, 242, 245);
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .home-wrap {
    .page-header {
      background-color: var(--el-bg-color);
      border-bottom: 1px solid #fff0f4;
      z-index: calc(var(--el-index-normal) + 2);
    }

    .main-menu-content {
      width: max-content;
      background-color: var(--el-bg-color);
      z-index: 1;
    }
    .layout-main{
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      width: calc(100%);
    }
    .main-wrap {
      background: var(--el-bg-color-page);
      // width: 100%;
      // height: 100%;
      position: relative;
      padding: 0;

      // overflow-x: hidden;
    }
  }
</style>
