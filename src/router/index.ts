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
    component: () => import('@/views/Relation/index.vue'),
    name: 'relation',
    path: '/relation',
    meta: {
      keepAlive: false,
      title: '关系',
      id: "relation"
    }
  },
  {
    component: () => import('@/views/Work/index.vue'),
    name: 'work',
    path: '/work',
    meta: {
      keepAlive: false,
      title: '存储',
      id: "work"
    }
  },
  {
    component: () => import('@/views/store/index.vue'),
    name: 'store',
    path: '/store',
    meta: {
      keepAlive: false,
      title: '数据',
      id: "store"
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
