//必须放在入口第一行，用于引入polyfill
import "core-js"

import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from '@/router'
import './router/router.interceptor'
import { setGlobalProperties } from '@/services'
import setupGlobalComponent from '@/components/global'
import setupSvgIcon from '@/icons'
import { createPinia } from 'pinia'

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import mitt from 'mitt'

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import config from 'devextreme/core/config';
import { loadMessages, locale } from 'devextreme/localization';
import zhMessage from 'devextreme/localization/messages/zh.json';
config({ defaultCurrency: 'zh' });
locale('zh');
loadMessages(zhMessage);

const Mit = mitt()
declare module "vue" {
  export interface ComponentCustomProperties {
      $Bus: typeof Mit
  }
}

// // 夜间模式 
// import '@/assets/style/element.dark.scss'
// import 'element-plus/theme-chalk/dark/css-vars.css'

import '@/assets/style/app.scss'
import "element-plus/theme-chalk/src/loading.scss";
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/src/notification.scss";
import "element-plus/theme-chalk/src/message-box.scss";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import VueGridLayout from 'vue-grid-layout'

// @ts-ignore
import VForm3 from '@/../lib/vform/designer.umd.js'
import '../lib/vform/designer.style.css'
import 'element-plus/dist/index.css'


// 下面是我们安装的固化插件。
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()

const app = createApp(App)
// 图标引入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
setupGlobalComponent(app)
setGlobalProperties(app)
setupSvgIcon(app)
pinia.use(piniaPersist)
app.use(pinia)
app.use(VueGridLayout)
setupRouter(app)
app.use(ElementPlus)
app.use(VForm3)
// app.use(ElementPlus, {locale}) //国内
// await router.isReady()
import orgIcons from './components/Common/GlobalComps/orgIcons.vue';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

app.use(ContextMenu)     

app.component('orgIcons', orgIcons);

import Prism from 'prismjs';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
app.config.globalProperties.$Bus = Mit

app.use(VueMarkdownEditor);
app.mount('#app')

