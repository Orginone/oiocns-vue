import { App } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import mine from './modules/mine'

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
    component: () => import('@/views/Thing/index.vue'),
    name: 'Thing',
    path: '/Thing',
    meta: {
      keepAlive: false,
      title: '元数据',
      id: "thing"
    }
  },
  {
    component: () => import('@/views/Chat/index.vue'),
    name: 'chat',
    path: '/chat',
    meta: {
      keepAlive: false,
      title: '消息',
      id: "chat"
    }
  },
  // 我的
  ...mine,
  {
    path: '/relation',
    component: () => import('@/views/Relation/index.vue'),
    meta: {
      keepAlive: false,
      title: '关系',
      id: "relation"
    },
    children: [
      {
        path: '/relation/department',
        name: 'department',
        component: () => import('@/views/Relation/department/index.vue'),
        meta: {
          title: '部门维护',
          id: "relation.department"
        }
      },
      {
        path: '/relation/group',
        name: 'group1',
        component: () => import('@/views/Relation/group/index.vue'),
        meta: {
          title: '集团维护',
          id: "relation.group"
        }
      },
      {
        path: '/relation/org',
        name: 'org',
        component: () => import('@/views/Relation/org/index.vue'),
        meta: {
          title: '单位维护',
          id: "relation.org"
        }
      },
      {
        path: '/relation/authority',
        name: 'authority',
        component: () => import('@/views/Relation/authority/index.vue'),
        meta: {
          title: '角色管理',
          id: "relation.authority"
        }
      },
      {
        path: '/relation/identity',
        name: 'identity',
        component: () => import('@/views/Relation/identity/index.vue'),
        meta: {
          title: '岗位管理',
          id: "relation.identity"
        }
      }
    ]
  },
  {
    component: () => import('@/views/Work/home.vue'),
    name: 'workHome',
    path: '/workHome',
    meta: {
      keepAlive: false,
      title: '工作组',
      id: "workHome"
    }
  },
  {
    component: () => import('@/views/Work/index.vue'),
    name: 'work',
    path: '/work',
    meta: {
      keepAlive: false,
      title: '自定义首页',
      id: "workindex"
    }
  },
  {
    path: '/service',
    component: () => import('@/views/Service/index.vue'),
    meta: {
      keepAlive: false,
      title: '办事',
      id: "service"
    },
    children: [
      {
        path: '/service',
        name: 'friendApply',
        component: () => import('@/views/Service/friendApply/index.vue'),
        meta: {
          title: '好友申请',
          id: "service.friendApply"
        }
      },
      {
        path: '/service/company',
        name: 'company',
        component: () => import('@/views/Service/company/index.vue'),
        meta: {
          title: '单位审核',
          id: "service.company"
        }
      },
      {
        path: '/service/group',
        name: 'group',
        component: () => import('@/views/Service/group/index.vue'),
        meta: {
          title: '集团审核',
          id: "service.group"
        }
      },
      {
        path: '/service/shop',
        name: 'shop',
        component: () => import('@/views/Service/shop/index.vue'),
        meta: {
          title: '商店审核',
          id: "service.shop"
        }
      },
      {
        path: '/service/order',
        name: 'order',
        component: () => import('@/views/Service/order/index.vue'),
        meta: {
          title: '订单审核',
          id: "service.order"
        }
      }
    ]
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
    component: () => import('@/views/Work/process.vue'),
    name: '/work/process',
    path: '/work/process',
    meta: {
      keepAlive: false,
      title: '待办详情',
      id: "work-process"
    }
  },
  {
    component: () => import('@/views/Person/application/index.vue'),
    name: 'application',
    path: '/application',
    meta: {
      keepAlive: false,
      title: '我的申请',
      id: "application"
    }
  },
  //个人中心信息设置路由
  {
    path: '/user',
    component: () => import('@/views/Layout/msgLayout/layout.vue'),
    redirect: '/user/userMsg',
    meta: {
      id: "userold"
    },
    children: [
      {
        path: '/user/userMsg',
        name: 'userMsg',
        component: () => import('@/views/Person/msgSetting/userMsg.vue'),
        meta: {
          title: '个人信息',
          id: "userold.userMsg"
        }
      },
      {
        path: '/user/userUnit',
        name: 'userUnit',
        component: () => import('@/views/Person/msgSetting/userUnit.vue'),
        meta: {
          title: '我的单位',
          id: "userold.userUnit"
        }
      },
      {
        path: '/user/userAccountBind',
        name: 'userAccountBind',
        component: () => import('@/views/Person/msgSetting/userAccountBind.vue'),
        meta: {
          title: '账号绑定',
          id: "userold.userAccountBind"
        }
      },
      {
        path: '/user/userSaveSet',
        name: 'userSaveSet',
        component: () => import('@/views/Person/msgSetting/userSaveSet.vue'),
        meta: {
          title: '安全设置',
          id: "userold.userSaveSet"
        }
      },

    ]
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
  // 应用市场 路由信息
  {
    path: '/market',
    meta: {
      keepAlive: false,
      title: '我的应用',
      id: "marketold"
    },
    // component: () => import('@/views/Layout/msgLayout/layout.vue'),
    children: [
      {
        path: '/market',
        name: 'market',
        component: () => import('@/views/Market/index.vue'),
        meta: {
          title: '应用中心',
          id: "marketold.index"
        }
      },
      {
        path: '/market/group',
        name: 'marketGroup',
        component: () => import('@/views/Market/AppShare/group.vue'),
        meta: {
          title: '共享集团',
          id: "marketold.group"
        }
      },
      {
        path: '/market/unit',
        name: 'marketUnit',
        component: () => import('@/views/Market/AppShare/unit.vue'),
        meta: {
          title: '共享单位',
          id: "marketold.unit"
        }
      },
      {
        path: '/market/marketList',
        name: 'marketList',
        component: () => import('@/views/Market/MarketList/index.vue'),
        meta: {
          title: '商店列表',
          id: "marketold.list"
        }
      },
      {
        path: '/market/appList',
        name: 'marketAppList',
        component: () => import('@/views/Market/MarketList/appList.vue'),
        meta: {
          title: '应用列表',
          id: "marketold.appList"
        }
      },
      {
        path: '/market/register',
        name: 'marketAppRegister',
        component: () => import('@/views/Market/AppRegister/index.vue'),
        meta: {
          title: '应用注册',
          id: "marketold.register"
        }
      },
      // 可使用应用 信息展示页面
      {
        path: '/market/detail/:id',
        name: 'marketAppDetail',
        component: () => import('@/views/Market/AppInfo/index.vue'),
        meta: {
          title: '应用信息',
          id: "marketold.detail"
        }
      },
      {
        path: '/market/softShare',
        name: 'softShare',
        component: () => import('@/views/Market/SoftShare/index.vue'),
        meta: {
          title: '开放市场',
          id: "marketold.share"
        }
      },
      {
        path: '/market/userManage',
        name: 'marketUserManage',
        component: () => import('@/views/Market/MarketList/userManage.vue'),
        meta: {
          title: '用户管理',
          id: "marketold.user"
        }
      },
      {
        path: '/market/order/buy',
        name: 'marketOrderBuy',
        component: () => import('@/views/Market/Order/index.vue'),
        meta: {
          title: '采购订单',
          id: "marketold.order-buy"
        }
      },
      {
        path: '/market/order/sell',
        name: 'marketOrderSell',
        component: () => import('@/views/Market/Order/index.vue'),
        meta: {
          title: '售卖订单',
          id: "marketold.order-sell"
        }
      },
      {
        path: '/market/shopCar',
        name: 'userShopCar',
        component: () => import('@/views/Market/ShopCar/index.vue'),
        meta: {
          title: '购物车',
          id: "marketold.shopCar"
        }
      },
      {
        path: '/market/appApply',
        name: 'appApply',
        component: () => import('@/views/Market/AppShelves/apply.vue'),
        meta: {
          title: '应用上架申请列表',
          id: "marketold.apply-app"
        }
      },
      {
        path: '/market/appDetail',
        name: 'appDetail',
        component: () => import('@/views/Market/AppDetail/index.vue'),
        meta: {
          title: '应用详情',
          id: "marketold.appDetail"
        }
      },
      {
        path: '/market/publishList',
        name: 'publishList',
        component: () => import('@/views/Market/AppDetail/publishList.vue'),
        meta: {
          title: '应用上架列表',
          id: "marketold.publishList"
        }
      },
      {
        path: '/market/merchandiseDetail',
        name: 'merchandiseDetail',
        component: () => import('@/views/Market/MerchandiseDetail/index.vue'),
        meta: {
          title: '商品详情',
          id: "marketold.merchandiseDetail"
        }
      },
      {
        path: '/market/marketDetail',
        name: 'marketDetail',
        component: () => import('@/views/Market/MarketDetail/index.vue'),
        meta: {
          title: '商店详情',
          id: "marketold.marketDetail"
        }
      },
    ]
  },
  {
    path: '/company',
    redirect: '/company/unitMsg',
    component: () => import('@/views/Layout/msgLayout/layout.vue'),
    meta: {
      id: "company"
    },
    children: [
      {
        path: '/company/unitMsg',
        name: 'unitMsg',
        component: () => import('@/views/Person/msgSetting/unitMsg.vue'),
        meta: {
          title: '单位信息',
          id: "company.info"
        }
      },
      {
        path: '/company/affiliatedGroups',
        name: 'affiliatedGroups',
        component: () => import('@/views/Person/msgSetting/affiliatedGroups.vue'),
        meta: {
          title: '关联集团',
          id: "company.group"
        }
      }
    ]
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
        path: '/store/shoppingCar',
        name: 'storeShoppingCar',
        component: () => import('@/views/Store/shoppingCar/index.vue'),
        meta: {
          title: '购物车',
          id: "store.shoppingCar"
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
        path: '/store/appRegister',
        name: 'storeAppRegister',
        component: () => import('@/views/Store/appRegister/index.vue'),
        meta: {
          isHidden: true,
          title: '应用创建'
        }
      },
      {
        path: '/store/userManage',
        name: 'storeUserManage',
        component: () => import('@/views/Store/userManage/index.vue'),
        meta: {
          title: '人员管理',
          id: "store.UserManage"
        }
      },
    ]
  },
  {
    component: () => import('@/views/Test/index.vue'),
    name: 'test',
    path: '/test',
    meta: {
      keepAlive: false,
      title: '仓库'
    }
  }
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
