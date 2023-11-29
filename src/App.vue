<template>
  <Suspense>
    <template #default>
      <el-config-provider :locale="locale">
        <div class="pages" >
          <router-view />
        </div>
      </el-config-provider>
    </template>
    <template #fallback>
      <div class="pages" v-loading></div>
    </template>
  </Suspense>
</template>

<script lang="ts" setup>

import { defineComponent } from 'vue'
import { ElConfigProvider,ElMessage } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { logger,LoggerLevel } from '@/ts/coreIndex'

// TODO:
// import moment from 'moment'
// import 'moment/locale/zh-cn'
// import config from 'devextreme/core/config'
// import { loadMessages, locale } from 'devextreme/localization'
// import zhMessage from 'devextreme/localization/messages/zh.json'

// moment.locale('zh-cn')
// config({ defaultCurrency: 'zh' })
// loadMessages(zhMessage)
// locale('zh')

const locale = ref(zhCn)

// TODO:
// logger.onLogger = (level:LoggerLevel, msg:any) => {
//   switch (level) {
//     case LoggerLevel.info:
//       ElMessage({
//         message: msg,
//         type: 'info'
//       })
//       break;
//     case LoggerLevel.warn:
//       ElMessage({
//         message: msg,
//         type: 'warning'
//       })
//       break;
//     case LoggerLevel.error:
//       ElMessage({
//         message: msg,
//         type: 'error'
//       })
//       break;
//     case LoggerLevel.unauth:
//         ElMessage({
//         message: msg,
//         type: 'error'
//       })
//       // return r.push('/login');
//   }
// }

</script>

<style lang="scss">

.mx-context-menu{
  border-radius: 0 !important;
}
.el-dialog>.el-dialog__header ,.el-drawer >.el-drawer__header {
  background-color: var(--el-fill-color-light) !important;
  margin-right: 0 !important;
}
.el-drawer >.el-drawer__header  {
  padding-bottom: 20px !important;
}
// 文字提示添加customized主题
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: var(--el-color-primary-light-9);
}

.el-popper.is-customized .el-popper__arrow::before {
  background: var(--el-color-primary-light-9);
  right: 0;
}
</style>
