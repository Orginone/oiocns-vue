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
        path: "/mine/Certificate",
        name: "certificate",
        meta: {
          keepAlive: false,
          title: "证书管理",
        },
      },
    ],
  },
];

export default Mine;
