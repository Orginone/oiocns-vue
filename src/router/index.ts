import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'

let resultRouter: RouteRecordRaw[] = []

//固定路由
const constantRoutes: RouteRecordRaw[] = [
  {
    component: () => import('@/views/Login/index.vue'),
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    }
  },
  {
    component: () => import('@/views/Others/404.vue'),
    name: '404',
    path: '/404'
  },
  // {
  //   component: () => import('@/views/Test/index.vue'),
  //   name: 'test',
  //   path: '/test'
  // }
]

// 主要业务页面路由
const mainRouter: RouteRecordRaw[] = [
  {
    component: () => import('@/views/Home/index.vue'),
    name: 'home',
    path: '/home',
    meta: {
      keepAlive: false,
      title: '首页',
      id: "home"
    }
  },
  {
    component: () => import('@/views/Chats/index.vue'),
    name: 'chat',
    path: '/chat',
    meta: {
      keepAlive: false,
      title: '消息',
      id: "chat"
    }
  },
  {
    component: () => import('@/views/Setting/index.vue'),
    name: 'setting',
    path: '/setting',
    meta: {
      keepAlive: false,
      title: '设置',
      id: "setting"
    }
  },
  {
    component: () => import('@/views/Portal/home.vue'),
    name: 'workHome',
    path: '/workHome',
    meta: {
      keepAlive: false,
      title: '工作组',
      id: "workHome"
    }
  }, 
  {
    component: () => import('@/views/Portal/index.vue'),
    name: 'work',
    path: '/work',
    meta: {
      keepAlive: false,
      title: '自定义首页',
      id: "workindex"
    }
  },
  {
    path: '/todo',
    component: () => import('@/views/todo/index.vue'),
    meta: {
      keepAlive: false,
      title: '办事',
      id: "todo"
    },
  },
  {
    path: '/setCenter',
    component: () => import('@/views/SetCenter/index.vue'),
    meta: {
      keepAlive: false,
      title: '设置',
      id: "setCenter"
    },
    children: [
      {
        path: '/setCenter',
        name: 'unit',
        component: () => import('@/views/SetCenter/unit/index.vue'),
        meta: {
          title: '单位设置',
          icon: 'OfficeBuilding',
          searchType: '1',
          id: "setCenter.unit"
        }
      },
      {
        path: '/setCenter/department',
        name: 'department',
        component: () => import('@/views/SetCenter/department/index.vue'),
        meta: {
          title: '部门设置',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.department"
        }
      },
      {
        path: '/setCenter/group',
        name: 'group',
        component: () => import('@/views/SetCenter/group/index.vue'),
        meta: {
          title: '集团设置',
          icon: 'Postcard',
          searchType: '1',
          id: "setCenter.group"
        }
      },
      {
        path: '/setCenter/post',
        name: 'post',
        component: () => import('@/views/SetCenter/post/index.vue'),
        meta: {
          title: '岗位设置',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.post"
        }
      },
      {
        path: '/setCenter/help',
        name: 'help',
        component: () => import('@/views/SetCenter/help/index.vue'),
        meta: {
          title: '帮助中心',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.help"
        }
      },
      {
        path: '/setCenter/unitMain',
        name: 'unitMain',
        component: () => import('@/views/SetCenter/unitMain/index.vue'),
        meta: {
          title: '单位首页',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.unitMain"
        }
      },
      {
        path: '/setCenter/resource',
        name: 'resource',
        component: () => import('@/views/SetCenter/resource/index.vue'),
        meta: {
          title: '资源设置',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.resource"
        }
      },
      {
        path: '/setCenter/use',
        name: 'use',
        component: () => import('@/views/SetCenter/use/index.vue'),
        meta: {
          title: '应用设置',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.use"
        }
      },
      {
        path: '/setCenter/flow',
        name: 'flow',
        component: () => import('@/views/SetCenter/flow/index.vue'),
        meta: {
          title: '流程设置',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.flow"
        }
      },
      {
        path: '/setCenter/standard',
        name: 'standard',
        component: () => import('@/views/SetCenter/standard/index.vue'),
        meta: {
          title: '标准设置',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.standard"
        }
      },
      {
        path: '/setCenter/authority',
        name: 'authority',
        component: () => import('@/views/SetCenter/authority/index.vue'),
        meta: {
          title: '权限设置',
          icon: 'Postcard',
          searchType: '2',
          id: "setCenter.authority"
        }
      },
    ]
  },
  {
    component: () => import('@/views/Portal/process.vue'),
    name: '/work/process',
    path: '/work/process',
    meta: {
      keepAlive: false,
      title: '待办详情',
      id: "work-process"
    }
  },
  {
    component: () => import('@/views/ForeignApp/index.vue'),
    name: 'ForeignApp',
    path: '/online',
    meta: {
      keepAlive: false,
      title: '外部应用',
      id: "foreignApp"
    }
  },
  {
    component: () => import('@/views/Cloud/index.vue'),
    name: 'cloud',
    path: '/cloud',
    meta: {
      keepAlive: false,
      title: '云盘',
      id: "cloud"
    }
  },
  {
    name: 'store',
    path: '/store',
    meta: {
      keepAlive: false,
      title: '仓库',
      id: "store"
    },
    children: [
      {
        path: '/store',
        name: 'store',
        component: () => import('@/views/Store/index.vue'),
        meta: {
          title: '仓库',
          id: "store.index"
        }
      },
      {
        path: '/store/appDetails',
        name: 'storeAppDetails',
        component: () => import('@/views/Store/appDetails/index.vue'),
        meta: {
          title: '应用详情',
          id: "store.appDetails"
        }
      },
      {
        path: '/store/appManagement',
        name: 'storeAppManagement',
        component: () => import('@/views/Store/appManagement/index.vue'),
        meta: {
          title: '应用详情',
          id: "store.storeAppManagement"
        }
      },
      {
        path: '/store/shop',
        name: 'storeShop',
        component: () => import('@/views/Store/shop/index.vue'),
        meta: {
          title: '应用商店',
          id: "store.shop"
        }
      },
      {
        path: '/store/putShelves',
        name: 'storePutShelves',
        component: () => import('@/views/Store/putShelves/index.vue'),
        meta: {
          title: '应用上架',
          id: "store.put-shelves"
        }
      },
      {
        path: '/store/payOrder',
        name: 'storePayOrder',
        component: () => import('@/views/Store/payOrder/index.vue'),
        meta: {
          title: '采购订单',
          id: "store.order-pay"
        }
      },
      {
        path: '/store/sellOrder',
        name: 'storeSellOrder',
        component: () => import('@/views/Store/sellOrder/index.vue'),
        meta: {
          title: '售卖订单',
          id: "store.order-cell"
        }
      },
      {
        path: '/store/appList',
        name: 'storeAppList',
        component: () => import('@/views/Store/appList/index.vue'),
        meta: {
          title: '应用列表',
          id: "store.appList"
        }
      },
      {
        path: '/store/public',
        name: 'storeAppPublic',
        component: () => import('@/views/Store/public/index.vue'),
        meta: {
          title: '应用详情',
          id: "store.appPublic"
        }
      },
    ]
  },
  {
    component: () => import('@/views/Thing/index.vue'),
    name: 'thing',
    path: '/thing',
    meta: {
      keepAlive: false,
      title: '物',
      id: "thing"
    }
  },
]

// 整合路由
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workHome',
    component: Layout,
    children: mainRouter
  },
  ...constantRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 处理业务路由为一级
function handleMainRouter(routerArr: RouteRecordRaw[], path?: string) {
  routerArr.forEach((item: RouteRecordRaw) => {
    if (item?.children) {
      handleMainRouter(item.children, item.path)
    } else {
      let obj = { ...item }
      if (path) {
        obj.path = `${path}${item.path}`
      }
      resultRouter.push(obj)
    }
  })
  return resultRouter
}

function setRouterPath(routerArr: any, pathStr = '') {
  return routerArr.map((item: any) => {
    let obj: { index: string; name: string; children?: any[] } = {
      index: `${pathStr}${item.path}`,
      name: item.meta?.title ?? item.path
    }
    if (item?.children) {
      obj.children = setPath(item.children, item.path)
    }
    return obj
  })
}

// 处理导航展示所需信息
function setPath(routerArr: any[], pathStr = '') {
  return routerArr.map((item) => {
    let obj: { index: string; name: string; children?: any[] } = {
      index: `${pathStr}${item.path}`,
      name: item.meta?.title ?? item.path
    }
    if (item?.children) {
      obj.children = setPath(item.children, item.path)
    }
    return obj
  })
}

//市场面包屑路由
function breadcrumbPath(mainRouter: any[]) {
  for (let i = 0; i < mainRouter.length; i++) {
    if (mainRouter[i].path == '/market') {
      return mainRouter[i].children.map(
        (item: { path: string; meta: { title: string }; index: string }) => {
          let obj: { path: string; name: string; index: string } = {
            path: item.path,
            name: item.meta.title,
            index: item.path
              .split('/')
              .filter((item) => item && item.trim())
              .at(-1)
          }
          return obj
        }
      )
    }
  }
}
// console.log('ly',breadcrumbPath(mainRouter));

// 根据业务路由导出菜单列表用于渲染导航
export const menuList: any = setPath(mainRouter)
export const marketPathList: any = breadcrumbPath(mainRouter)
export function setupRouter(app: App<Element>) {
  app.use(router)
}

export default router
