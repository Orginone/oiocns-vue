// @ts-nocheck
// 这里放置需要全局注册的组件
export default function setupGlobalComponent(app:any) {
  // 自动加载 global 目录下的 .vue 结尾的文件
  const componentsContext = import.meta.globEager('/src/components/global/**/*.vue');

  for (const componentConfig in componentsContext) {
    if (componentsContext.hasOwnProperty(componentConfig)) {
      const ctrl = componentsContext[componentConfig].default || componentsContext[componentConfig];

      // console.log("ctrl====", ctrl);

      app.component(ctrl.name, ctrl);
    }
  }
}
