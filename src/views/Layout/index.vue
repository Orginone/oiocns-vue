<template>
  <el-container class="pages home-wrap">
    <!-- 头 -->
    <el-header class="page-header">
      <CustomHeadr />
    </el-header>
    <el-container>
      <!-- 主导航 -->
      <div class="menu-list" v-if="router.currentRoute.value.path !='/workHome'">
        <MenuNav :data="menuArr" ></MenuNav>
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
  import { chat } from '@/module/chat/orgchat'
  let router = useRouter()

console.log('router',);

  const menuArr = reactive( [
        {
          name: "平台待办",
          structure: false,
          children: [
            {
              name: "好友申请",
              type:'1',
              uid:'1-1',
              // components:'Videoitem',
              children: [],
            },
            {
              name: "单位审核",
              type:'2',
              uid:'1-2',
              // components:'Videoitem',
              children: [],
            },
            {
              name: "商店审核",
              type:'3',
              uid:'1-3',
              // components:'Videoitem',
              children: [],
            },
            {
              name: "订单审核",
              type:'4',
              uid:'1-4',
              // components:'Videoitem',
              children: [],
            },
          ],
        },
        {
          label: "应用待办",
          structure: true,
          isPenultimate: true,
          children: [
            {
              label: "公益仓",
              isPenultimate: true,
              id: '0',
              children: [{
              label: "公益仓2",
              id: '3',
              children: [],
            },],
            },
            {
              label: "办公OA",
              id: '1',
              children: [],
            },
            {
              label: "资产管理",
              id: '2',
              children: [],
            },
          ],
        },
        {
          label: "应用待办111",
          structure: true,
          isPenultimate: true,
          children: [
            {
              label: "公益仓",
              children: [],
            },
            {
              label: "办公OA",
              children: [],
            },
            {
              label: "资产管理",
              children: [],
            },
          ],
        },
    ])
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
    width: 200px;
    padding-right: 10px;
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
