<template>
  <el-container class="pages home-wrap">
    <!-- 头 -->
    <el-header class="page-header">
      <CustomHeadr />
    </el-header>
    <el-container>
      <!-- 主导航 -->
      <div class="menu-list" v-if="showMenu">
        <MenuNav :data="menuArr.state" :titleData="titleArr.state"></MenuNav>
      </div>
      <div class="layout-main" >
          <!-- 面包屑 -->
        <div class="breadcrumb-box" v-if="showMenu">
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
  import { setCenterStore } from '@/store/setting'
  import authority from '@/utils/authority'
  import { onBeforeMount, onBeforeUnmount,reactive,watch,ref,nextTick} from 'vue'
  import { useRouter } from 'vue-router';
  import storeJosn from './json/store.json';
  import settingJosn from './json/setting.json';
  import setTree from './json/setTree.json';
  import detailJosn from './json/detail.json';
  import userJosn from './json/user.json';
  import { chat } from '@/module/chat/orgchat'
  import marketServices from "@/module/store/market"

  let router = useRouter()
  console.log(router.currentRoute.value.path);

  let titleArr = reactive<any>({state:{btnList:[]}});
  let menuArr = reactive({
    state:[]
  });
  const showMenu = ref<boolean>(true);
  // 获取我的商店列表
  const getShopList = async ()=>{
    await marketServices.getMarketList({
      offset: 0,
      limit: 10,
      filter: ""
    });
    let myList:any = []
    let addList:any = []
    marketServices.marketList.forEach(element => {
      if(element.belongId){
        myList.push({...element,label:element.name,url:'/store/shop?id='+element.id,btns:[{
            "name":"创建",
            "id":"101"
        }]})
      }else{
        // TODO 暂时文字匹配开放市场，不显示在商店加入列表里
        if(element.name !='开放市场'){
          addList.push({...element,label:element.name,url:'/store/shop?id='+element.id,btns:[{
              "name":"创建",
              "id":"101"
          }]})
        }
      }
    });
    let newObj:any =  {
        label: "商城",
        structure: true,
        "isPenultimate": true,
        "btns":[] as string[],
        "children": [
          {
            "label": "开放市场",
            "isPenultimate": true,
            "url":'/store/shop',
            "id": ""
          },
          {
            "label": "商店(自建)",
            "isPenultimate": true,
            "id": "",
            "children": myList
          },
          {
            "label": "商店(加入)",
            "id": "1",
            "children":addList
          },
        ]
    }
    let shopStoreJosn = JSON.parse(JSON.stringify(storeJosn))
    showMenu.value = true;
    shopStoreJosn[2] = newObj
    titleArr.state = shopStoreJosn[0]
    menuArr.state = shopStoreJosn
    
  }
  // store 路由设置
  const storeFun =()=>{
    if(router.currentRoute.value.path.indexOf('store/shop') != -1){
      console.log('1')
      getShopList();
    }else{
      console.log('2')
      showMenu.value = true;
      titleArr.state = storeJosn[0]
      menuArr.state = storeJosn
    }
  }
  const getNav = ()=>{
      if(router.currentRoute.value.path.indexOf('store') != -1){    
        storeFun()
      }else if(router.currentRoute.value.path.indexOf('setCenter') != -1){
        showMenu.value = true;
        if (router.currentRoute.value.name === 'department') {
            titleArr.state= {icon: 'User',title: '部门设置',"backFlag": true}
            menuArr.state = setCenterStore().departmentInfo
        } else if (router.currentRoute.value.name === 'unit') {
          titleArr.state= settingJosn[0]
          menuArr.state = settingJosn
        } else {
          let currentRouteName: any = router.currentRoute.value.name
          const jsonData: any = setTree
          if (['unit', 'post', 'group', 'data' , 'resource' , 'standard', 'authority'].includes(currentRouteName)) {
            titleArr.state= jsonData[currentRouteName][0]
            menuArr.state = jsonData[currentRouteName]
          } else {
            titleArr.state= settingJosn[0]
            menuArr.state = settingJosn
          }
        }
        
      } else if (router.currentRoute.value.path.indexOf('mine') != -1) {
        showMenu.value = true;
        titleArr.state = userJosn[0]
        menuArr.state = userJosn
        
      } else if (router.currentRoute.value.path.indexOf('service') != -1){
        showMenu.value = true;
        titleArr.state = detailJosn[0]
        menuArr.state = detailJosn
      } else {
        showMenu.value = false;
      }
  }
  getNav();
  
  watch(() => router.currentRoute.value.path, () => {
    // nextTick(() => {
      getNav();
    // })
  })

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
