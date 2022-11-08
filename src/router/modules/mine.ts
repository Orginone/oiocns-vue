export default [
  {
    // 我的
    component: () => import("@/views/Mine/Mine/index.vue"),
    name: "mine",
    path: "/mine",
    meta: {
      keepAlive: false,
      title: "我的",
    },
  },
];
