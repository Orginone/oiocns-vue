<template>
  <el-container class="pages home-wrap">
    <!-- 头 -->
    <el-header class="page-header" >
      <CustomHeadr />
    </el-header>
    <el-container>
      <!-- 主导航 -->
      <div class="menu-list" v-show="showMenu">
        <MenuNav :data="menuArr.state" :titleData="titleArr.state" :btnType="btnType"></MenuNav>
      </div>
      <div class="layout-main" >
          <!-- 面包屑 -->
        <div class="breadcrumb-box" v-show="showMenu">
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
      <el-dialog
        v-model="addMenuDialog"
        append-to-body
        title="新增分类"
        width="60%"
      >
      <el-input v-model="menuText"  placeholder="请输入" />
      <div class="foot" style="margin-top:20px;display:flex;">
        <el-button  @click="addMenuDialog = false">取消</el-button>
        <el-button type="primary" @click="addMenu">确定</el-button>
      </div>
    </el-dialog>
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
  import { onBeforeMount, onBeforeUnmount,reactive,watch,ref,nextTick,getCurrentInstance} from 'vue'
  import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router';
  import storeJson from './json/store.json';
  // import settingJosn from './json/setting.json';
  import setTree from './json/setTree.json';
  import serviceJson from './json/service.json';
  // import userJosn from './json/user.json';
  import { chat } from '@/module/chat/orgchat'
  import marketServices from "@/module/store/market"

  import { createAllMenuTree, MenuDataItem, findMenu } from "./json/MenuData";
  import { getAllNodes } from '@/utils/tree'
  import { anystore } from '@/hubs/anystore'
  // import {MarketModel} from "@/ts/market";
  import marketCtrl from '@/ts/controller/store/marketCtrl';
  import thingCtrl from '@/ts/controller/thing'
  import {INullSpeciesItem} from "@/ts/core";

  const { proxy } = getCurrentInstance()
  const store = useUserStore()

  const btnType = ref<string>('');
  const addMenuDialog = ref<boolean>(false);
  const menuText = ref<string>('')
  const menuTree = ref(createAllMenuTree());
  const allMenuItems = ref(getAllNodes(menuTree.value));
  
  // 路由控制，单独匹配的话需要增加 showMenu.value = true;
  function getNavData2() { 
    btnType.value='';//默认为空
    if(router.currentRoute.value.path.indexOf('setCenter') != -1){
      if (router.currentRoute.value.name === 'department') {
          titleArr.state= {icon: 'User',title: '部门设置',"backFlag": true}
          setCenterStore().GetDepartmentInfo().then((treeData)=> {
            let newData: any = [
              {
                label: '部门管理',
                structure: true,
                id: 1,
                query: true,
                isPenultimate: true,
                btns:[{
                  name: '新增部门',
                  id: '2203'
                }],
                children: treeData
              }
            ]
            menuArr.state = newData
          })
          showMenu.value = true;
          return;
      } else if (router.currentRoute.value.name === 'post') {
          titleArr.state= {icon: 'User',title: '岗位设置',"backFlag": true}
          setCenterStore().GetIdentities().then((treeData)=> {
            let newData: any = [
              {
                label: '岗位管理',
                structure: true,
                id: 1,
                query: true,
                isPenultimate: true,
                btns:[{
                  name: '新增岗位',
                  id: '2008'
                }],
                children: treeData
              }
            ]
            menuArr.state = newData
          })
          showMenu.value = true;
          return;
      }else if (router.currentRoute.value.name === 'group') {
        showMenu.value = false;
        return;
      }else if (router.currentRoute.value.name !== 'unit') {
        let currentRouteName: any = router.currentRoute.value.name
        const jsonData: any = setTree
        if (['unit', 'group', 'data' , 'resource' , 'authority'].includes(currentRouteName)) {
          titleArr.state= jsonData[currentRouteName][0]
          menuArr.state = jsonData[currentRouteName]
          showMenu.value = true;
          return;
        }
      }
    }
    // start-文档相关
    if (router.currentRoute.value.name === 'cloud') {
      showMenu.value = false;
      return;
    }
    // end-文档相关

    // start-标准设置相关
    if (router.currentRoute.value.path.indexOf('setCenter/standard') != -1) {
      titleArr.state = {icon: 'PriceTag',title: '标准设置', "backFlag": true}
      getStandardSpecies()
      showMenu.value = true;
      return;
    }
    // end-标准设置相关

    if(router.currentRoute.value.path.indexOf('store/shop') != -1){
      getShopList();
      showMenu.value = true;
      console.log('a')

      return
    }

    if(router.currentRoute.value.path.indexOf('store/appManagement') != -1){
      titleArr.state = storeJson[0]
      menuArr.state = storeJson
      showMenu.value = true;
      return
    }
    if(router.currentRoute.value.path.indexOf('store') != -1){
      showMenu.value = true;
      getMenu()
      return
    }
    
    if(router.currentRoute.value.path.indexOf('service') != -1){
      serviceJson[1].children.forEach((element:any,index:any) => {
        // element?.num = index
      });
      showMenu.value = true;
      titleArr.state = serviceJson[0]
     
      menuArr.state = serviceJson
      return
    }
    const ret = findMenu(router.currentRoute.value, allMenuItems.value);
    if (!ret) {
      showMenu.value = false;
      return;
    }
    titleArr.state = ret.top;
    menuArr.state = ret.top.children;
    showMenu.value = true;
  }
  let router = useRouter()
  console.log(router.currentRoute.value.path);

  let titleArr = reactive<any>({state:{btnList:[]}});
  let menuArr = reactive({
    state:[]
  });
  const showMenu = ref<boolean>(true);
  // 商店分类数据
  const menuData = reactive({
    data:[]
  });

  //数据过滤
  const dataFilter = (data:any)=>{
    if(data.length>0){
      data.forEach((element:any) => {
        element.isStoreMenu = true;
        element.label = element.title
        if(element.children.length>0){
          dataFilter(element.children)
        }
      });
    }else{
      return data;
    }
  };
  // 获取商店分类
  const getMenu = () => {
    anystore.subscribed('STORE_MENU'+store.workspaceData.id, 'user', (data) => {
      let newJSON = JSON.parse(JSON.stringify(storeJson))
      console.log('newJSON',newJSON)
        if(data?.data?.species.length>0){
          menuData.data = data.data.species;          
          dataFilter(menuData.data)
          newJSON[2].children = menuData.data;
        }
        titleArr.state = newJSON[0]
        menuArr.state = newJSON
        btnType.value = 'STORE_USER_MENU'
    })
  }

  function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
  const flagId = ref<string>('');
  proxy?.$Bus.on('storeBus', (id:any) => {
    let str:string = id;
    let arr = str.split('_')
    if(arr[0] == '1'){
      addMenuDialog.value = true;
      flagId.value = arr[1];
    }else{
      flagId.value = arr[1];
      deleteMenu();
    }
  })
  proxy?.$Bus.on("clickBus", (num) => {
    if(num ==1050){ //刷新导航
      getShopList();
    }
  });
  const idFindItem = (obj:any,data:any) => {
    if(data?.length){
      data.forEach((element:any) => {
        if(element.id == flagId.value){
          element.children.push(obj)
          setMenu();
        }else{
          idFindItem(obj,element.children)
        }
      });
    }
  };
  const deleteFindItem = (data:any) => {
    if(data?.length){
      data.forEach((element:any,index:number) => {
        if(element.id == flagId.value){
          data = data.splice(index, 1);
          setMenu();
        }else{
          deleteFindItem(element.children)
        }
      });
    }
  };
  const addMenu = ()=>{
    let id = getUuid();
    let obj = {
      children:[] as [],
      id:id,
      key:Date.now(),
      label:menuText.value,
      title:menuText.value,
      url:'store?id='+id
    }
    if(flagId.value != 'undefined'){
      idFindItem(obj,menuData.data);
    } else{
      menuData.data.push(obj)
      setMenu();
    }
  }
  const deleteMenu = ()=>{
    deleteFindItem(menuData.data)
  }
  const setMenu = ()=>{
    anystore.set(`selfAppMenu`,{
      operation:'replaceAll',
      data:{
        data:menuData.data
      }
    },'user');
    menuText.value = '';
    addMenuDialog.value = false;
  }

  // 获取数据标准分类
  interface SpeciesObject extends INullSpeciesItem {
    structure: boolean
    label: string
  }
  const getStandardSpecies = ()=>{
    const teamSpecies: SpeciesObject = thingCtrl.teamSpecies as SpeciesObject
    if(teamSpecies) {
      teamSpecies.structure = true
      const treeData = [teamSpecies]
      treeLabel(treeData)
      menuArr.state = treeData
      function treeLabel(arr: any[]) {
        arr.forEach((el) => {
          el.label = el.name
          delete el.parent
          treeLabel(el.children || [])
        })
      }
    } else {
      menuArr.state = []
    }
  }
  
  // 获取我的商店列表
  const getShopList = async ()=>{
    let myList:any = []
    marketCtrl.Market.getJoinMarkets().then((res)=>{
      res.forEach(element => {
          let obj:any= {
            ...element.market,
            label:element.market.name,
            url:'/store/shop?id='+element.market.id,
            btns:[{  "name":"删除商店", "id":"1021" },{  "name":"用户管理",  "id":"1022"}]
          }
          myList.push(obj)
      })
      let newObj:any =  {
        label: "商店分类",
        structure: true,
        isPenultimate: true,
        btns:[{
          "name":"创建商店",
          "id":"1020"
        },{
            "name":"加入商店",
            "id":"1025"
        }],
        "children": myList
    }
    let shopstoreJson = JSON.parse(JSON.stringify(storeJson))
    showMenu.value = true;
    shopstoreJson[2] = newObj
    titleArr.state = {icon: 'User',title: '商店', "backFlag": true}
    menuArr.state = shopstoreJson
    })
    
  }
  // const getNav = ()=>{
  //     if(router.currentRoute.value.path.indexOf('store') != -1){    
  //       storeFun()
  //     }else if(router.currentRoute.value.path.indexOf('setCenter') != -1){
  //       showMenu.value = true;
  //       if (router.currentRoute.value.name === 'department') {
  //           titleArr.state= {icon: 'User',title: '部门设置',"backFlag": true}
  //           setCenterStore().GetDepartmentInfo().then((treeData)=> {
  //             menuArr.state = treeData
  //           })
  //       } else if (router.currentRoute.value.name === 'unit') {
  //         titleArr.state= settingJosn[0]
  //         menuArr.state = settingJosn
  //       } else if (router.currentRoute.value.name === 'post') {
  //         titleArr.state= {icon: 'User',title: '岗位设置',"backFlag": true}
  //         setCenterStore().GetIdentities().then((treeData)=> {
  //           menuArr.state = treeData
  //         })
  //       } else {
  //         let currentRouteName: any = router.currentRoute.value.name
  //         const jsonData: any = setTree
  //         if (['unit', 'group', 'data' , 'resource' , 'standard', 'authority'].includes(currentRouteName)) {
  //           titleArr.state= jsonData[currentRouteName][0]
  //           menuArr.state = jsonData[currentRouteName]
  //         } else {
  //           titleArr.state= settingJosn[0]
  //           menuArr.state = settingJosn
  //         }
  //       }
        
  //     } else if (router.currentRoute.value.path.indexOf('mine') != -1) {
  //       showMenu.value = true;
  //       titleArr.state = userJosn[0]
  //       menuArr.state = userJosn
        
  //     } else if (router.currentRoute.value.path.indexOf('service') != -1){
  //       showMenu.value = true;
  //       titleArr.state = detailJosn[0]
  //       menuArr.state = detailJosn
  //     } else {
  //       showMenu.value = false;
  //     }
  // }
  // getNav();
  getNavData2();

  watch(() => router.currentRoute.value.path, () => {
    // nextTick(() => {
      // getNav();
      getNavData2();
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
  
  const instance = getCurrentInstance();
  instance?.proxy?.$Bus.on('refreshNav', () => { getNavData2() })
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
