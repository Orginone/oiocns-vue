import { RouteRecordRaw } from "vue-router";

const Setting: RouteRecordRaw[] = [
  {
    // 我的
    component: () => import("@/views/Setting/index.vue"),
    path: "/setting",
    meta: {
      title: "我的",
      id: "setting"
    },
    children: [
      {
        component: () => import("@/views/Setting/Relation/index.vue"),
        path: "",
        name: "setting",
        meta: {
          keepAlive: false,
          title: "个人信息",
          id: "setting.index"
        },
      },
      {
        component: () => import("@/views/Setting/unit.vue"),
        path: "/setting/unit",
        name: "my-unit",
        meta: {
          keepAlive: false,
          title: "我的单位",
          id: "setting.my-unit"
        },
      },
      {
        path: '/setting/cohort',
        name: 'cohort1',
        component: () => import('@/views/Setting/cohort/index.vue'),
        meta: {
          title: '单位群组',
          id: "setting.my-cohort"
        }
      },
      {
        path: '/setting/friend',
        name: 'friend1',
        component: () => import('@/views/setting/friend/index.vue'),
        meta: {
          title: '我的好友',
          id: "setting.my-friend"
        }
      },
    ],
  },
];

export default Setting;
