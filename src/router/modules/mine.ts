import { RouteRecordRaw } from "vue-router";

const Mine: RouteRecordRaw[] = [
  {
    // 我的
    component: () => import("@/views/Mine/index.vue"),
    path: "/mine",
    meta: {
      title: "我的",
      id: "mine"
    },
    children: [
      {
        component: () => import("@/views/Mine/Relation/index.vue"),
        path: "",
        name: "mine",
        meta: {
          keepAlive: false,
          title: "个人信息",
          id: "mine.index"
        },
      },
      {
        component: () => import("@/views/Mine/Certificate/index.vue"),
        path: "/mine/certificate",
        name: "my-certificate",
        meta: {
          keepAlive: false,
          title: "证书管理",
          id: "mine.my-certificate"
        },
      },
      {
        component: () => import("@/views/Mine/unit.vue"),
        path: "/mine/unit",
        name: "my-unit",
        meta: {
          keepAlive: false,
          title: "我的单位",
          id: "mine.my-unit"
        },
      },
      {
        path: '/mine/cohort',
        name: 'cohort1',
        component: () => import('@/views/Relation/cohort/index.vue'),
        meta: {
          title: '单位群组',
          id: "mine.my-cohort"
        }
      },
      {
        path: '/mine/friend',
        name: 'friend1',
        component: () => import('@/views/Relation/friend/index.vue'),
        meta: {
          title: '我的好友',
          id: "mine.my-friend"
        }
      },
    ],
  },
];

export default Mine;
