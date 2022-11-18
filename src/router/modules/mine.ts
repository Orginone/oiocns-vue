import { RouteRecordRaw } from "vue-router";

const Mine: RouteRecordRaw[] = [
  {
    // 我的
    component: () => import("@/views/Mine/index.vue"),
    path: "/mine",
    children: [
      {
        component: () => import("@/views/Mine/Certificate/index.vue"),
        path: "",
        name: "mine",
        meta: {
          keepAlive: false,
          title: "个人信息",
        },
      },
      {
        component: () => import("@/views/Mine/Relation/index.vue"),
        path: "/mine/relation",
        name: "my-relation",
        meta: {
          keepAlive: false,
          title: "人员设置",
        },
      },
      {
        component: () => import("@/views/Mine/unit.vue"),
        path: "/mine/unit",
        name: "my-unit",
        meta: {
          keepAlive: false,
          title: "我的单位",
        },
      },
    ],
  },
];

export default Mine;
