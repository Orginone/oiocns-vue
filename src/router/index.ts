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
  {
    component: () => import('@/views/Test2/index.vue'),
    name: 'test',
    path: '/test',
    meta: {
      keepAlive: false,
      title: '首页'
    }
  }
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
      title: '首页'
    }
  },
  {
    component: () => import('@/views/Thing/index.vue'),
    name: 'Thing',
    path: '/Thing',
    meta: {
      keepAlive: false,
      title: '元数据'
    }
  },
  {
    component: () => import('@/views/Chat/index.vue'),
    name: 'chat',
    path: '/chat',
    meta: {
      keepAlive: false,
      title: '消息'
    }
  },
  {
    path: '/relation',
    component: () => import('@/views/Relation/index.vue'),
    meta: {
      keepAlive: false,
      title: '关系'
    },
    children: [
      {
        path: '/relation/department',
        name: 'department',
        component: () => import('@/views/Relation/department/index.vue'),
        meta: {
          title: '部门维护'
        }
      },
      {
        path: '/relation/group',
        name: 'group1',
        component: () => import('@/views/Relation/group/index.vue'),
        meta: {
          title: '集团维护'
        }
      },
      {
        path: '/relation/cohort',
        name: 'cohort1',
        component: () => import('@/views/Relation/cohort/index.vue'),
        meta: {
          title: '单位群组'
        }
      },
      {
        path: '/relation/friend',
        name: 'friend1',
        component: () => import('@/views/Relation/friend/index.vue'),
        meta: {
          title: '我的好友'
        }
      },
      {
        path: '/relation/org',
        name: 'org',
        component: () => import('@/views/Relation/org/index.vue'),
        meta: {
          title: '单位维护'
        }
      },
      {
        path: '/relation/authority',
        name: 'authority',
        component: () => import('@/views/Relation/authority/index.vue'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/relation/identity',
        name: 'identity',
        component: () => import('@/views/Relation/identity/index.vue'),
        meta: {
          title: '岗位管理'
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
      title: '工作组'
    }
  },
  {
    component: () => import('@/views/Work/index.vue'),
    name: 'work',
    path: '/work',
    meta: {
      keepAlive: false,
      title: '自定义首页'
    }
  },
  {
    component: () => import('@/views/Work/cardDetail.vue'),
    name: 'cardDetail',
    path: '/cardDetail',
    meta: {
      keepAlive: false,
      title: '待办详情'
    }
  },
  {
    component: () => import('@/views/Work/process.vue'),
    name: '/work/process',
    path: '/work/process',
    meta: {
      keepAlive: false,
      title: '待办详情'
    }
  },
  {
    component: () => import('@/views/Person/application/index.vue'),
    name: 'application',
    path: '/application',
    meta: {
      keepAlive: false,
      title: '我的申请'
    }
  },
  //个人中心信息设置路由
  {
    path: '/user',
    component: () => import('@/views/Layout/msgLayout/layout.vue'),
    redirect: '/user/userMsg',
    children: [
      {
        path: '/user/userMsg',
        name: 'userMsg',
        component: () => import('@/views/Person/msgSetting/userMsg.vue'),
        meta: {
          title: '个人信息'
        }
      },
      {
        path: '/user/userUnit',
        name: 'userUnit',
        component: () => import('@/views/Person/msgSetting/userUnit.vue'),
        meta: {
          title: '我的单位'
        }
      },
      {
        path: '/user/userAccountBind',
        name: 'userAccountBind',
        component: () => import('@/views/Person/msgSetting/userAccountBind.vue'),
        meta: {
          title: '账号绑定'
        }
      },
      {
        path: '/user/userSaveSet',
        name: 'userSaveSet',
        component: () => import('@/views/Person/msgSetting/userSaveSet.vue'),
        meta: {
          title: '安全设置'
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
      title: '外部应用'
    }
  },
  // 应用市场 路由信息
  {
    path: '/market',
    meta: {
      keepAlive: false,
      title: '我的应用'
    },
    // component: () => import('@/views/Layout/msgLayout/layout.vue'),
    children: [
      {
        path: '/market',
        name: 'market',
        component: () => import('@/views/Market/index.vue'),
        meta: {
          title: '应用中心'
        }
      },
      {
        path: '/market/group',
        name: 'marketGroup',
        component: () => import('@/views/Market/AppShare/group.vue'),
        meta: {
          title: '共享集团'
        }
      },
      {
        path: '/market/unit',
        name: 'marketUnit',
        component: () => import('@/views/Market/AppShare/unit.vue'),
        meta: {
          title: '共享单位'
        }
      },
      {
        path: '/market/marketList',
        name: 'marketList',
        component: () => import('@/views/Market/MarketList/index.vue'),
        meta: {
          title: '商店列表'
        }
      },
      {
        path: '/market/appList',
        name: 'marketAppList',
        component: () => import('@/views/Market/MarketList/appList.vue'),
        meta: {
          title: '应用列表'
        }
      },
      {
        path: '/market/register',
        name: 'marketAppRegister',
        component: () => import('@/views/Market/AppRegister/index.vue'),
        meta: {
          title: '应用注册'
        }
      },
      // 可使用应用 信息展示页面
      {
        path: '/market/detail/:id',
        name: 'marketAppDetail',
        component: () => import('@/views/Market/AppInfo/index.vue'),
        meta: {
          title: '应用信息'
        }
      },
      {
        path: '/market/softShare',
        name: 'softShare',
        component: () => import('@/views/Market/SoftShare/index.vue'),
        meta: {
          title: '开放市场'
        }
      },
      {
        path: '/market/userManage',
        name: 'marketUserManage',
        component: () => import('@/views/Market/MarketList/userManage.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/market/order/buy',
        name: 'marketOrderBuy',
        component: () => import('@/views/Market/Order/index.vue'),
        meta: {
          title: '采购订单'
        }
      },
      {
        path: '/market/order/sell',
        name: 'marketOrderSell',
        component: () => import('@/views/Market/Order/index.vue'),
        meta: {
          title: '售卖订单'
        }
      },
      {
        path: '/market/shopCar',
        name: 'userShopCar',
        component: () => import('@/views/Market/ShopCar/index.vue'),
        meta: {
          title: '购物车'
        }
      },
      {
        path: '/market/userApply',
        name: 'userApply',
        component: () => import('@/views/Market/JoinMarketApproval/starter.vue'),
        meta: {
          title: '加入商店申请列表'
        }
      },
      {
        path: '/market/appApply',
        name: 'appApply',
        component: () => import('@/views/Market/AppShelves/apply.vue'),
        meta: {
          title: '应用上架申请列表'
        }
      },
      {
        path: '/market/appDetail',
        name: 'appDetail',
        component: () => import('@/views/Market/AppDetail/index.vue'),
        meta: {
          title: '应用详情'
        }
      },
      {
        path: '/market/publishList',
        name: 'publishList',
        component: () => import('@/views/Market/AppDetail/publishList.vue'),
        meta: {
          title: '应用上架列表'
        }
      },
      {
        path: '/market/merchandiseDetail',
        name: 'merchandiseDetail',
        component: () => import('@/views/Market/MerchandiseDetail/index.vue'),
        meta: {
          title: '商品详情'
        }
      },
      {
        path: '/market/marketDetail',
        name: 'marketDetail',
        component: () => import('@/views/Market/MarketDetail/index.vue'),
        meta: {
          title: '商店详情'
        }
      },
      {
        path: '/market/managerApply',
        name: 'managerApply',
        component: () => import('@/views/Market/JoinMarketApproval/manager.vue'),
        meta: {
          title: '加入商店审批列表'
        }
      },
      {
        path: '/market/managerApproval',
        name: 'managerApproval',
        component: () => import('@/views/Market/JoinMarketApproval/index.vue'),
        meta: {
          title: '申请审批'
        }
      },
      {
        path: '/market/appShelvesApproval',
        name: 'appShelvesApproval',
        component: () => import('@/views/Market/AppShelves/approval.vue'),
        meta: {
          title: '应用上架审批列表'
        }
      }
    ]
  },
  {
    path: '/company',
    redirect: '/company/unitMsg',
    component: () => import('@/views/Layout/msgLayout/layout.vue'),
    children: [
      {
        path: '/company/unitMsg',
        name: 'unitMsg',
        component: () => import('@/views/Person/msgSetting/unitMsg.vue'),
        meta: {
          title: '单位信息'
        }
      },
      {
        path: '/company/affiliatedGroups',
        name: 'affiliatedGroups',
        component: () => import('@/views/Person/msgSetting/affiliatedGroups.vue'),
        meta: {
          title: '关联集团'
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
      title: '云盘'
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
