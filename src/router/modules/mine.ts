import { RouteRecordRaw } from "vue-router";

const Mine: RouteRecordRaw[] = [
  {
    // 我的
    component: () => import("@/views/Mine/index.vue"),
    path: "/mine",
    redirect: "/mine/mine",
    children: [
      {
        component: () => import("@/views/Mine/Mine/index.vue"),
        path: "/mine/mine",
        name: "mine",
        meta: {
          keepAlive: false,
          title: "我的",
        },
      },
      {
        component: () => import("@/views/Mine/Certificate/index.vue"),
        path: "/mine/certificate",
        name: "certificate",
        meta: {
          keepAlive: false,
          title: "证书管理",
        },
      },
      {
        component: () => import("@/views/Mine/Test/index.vue"),
        path: "/mine/test",
        name: "sdk",
        meta: {
          keepAlive: false,
          title: "sdk测试",
        },
      },
    ],
  },
];

export default Mine;
