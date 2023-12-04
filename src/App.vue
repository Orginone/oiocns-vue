<template>
  <el-config-provider :locale="EPlocale">
    <Suspense>
      <template #default>
          <div class="pages" >
            <router-view />
          </div>
      </template>
      <template #fallback>
        <div class="pages" v-loading></div>
      </template>
    </Suspense>
  </el-config-provider>
  <!-- 语音播放器 -->
  <audio ref="audio" />
</template>

<script lang="ts" setup>

import { ElConfigProvider,ElMessage } from 'element-plus'
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import moment from 'moment'
import 'moment/locale/zh-cn'
import orgCtrl from '@/ts/controller'
import config from 'devextreme/core/config'
import { loadMessages, locale } from 'devextreme/localization'
import zhMessage from 'devextreme/localization/messages/zh.json'
import { LoggerLevel, logger } from '@/ts/base/common'
import { useMediaControls } from '@vueuse/core'

moment.locale('zh-cn')
config({ defaultCurrency: 'zh' })
loadMessages(zhMessage)
locale('zh')

const EPlocale = ref(zhCn)
const audio = ref(null)
const { playing } = useMediaControls(audio,{
  src: '/media/bone.mp3',
})

logger.onLogger = (level, msg) => {
  switch (level) {
    case LoggerLevel.msg:
      playing.value = true
      ElMessage.info(msg);
      break;
    case LoggerLevel.info:
      ElMessage.info(msg);
      break;
    case LoggerLevel.warn:
      ElMessage.warning(msg);
      break;
    case LoggerLevel.error:
      ElMessage.error(msg);
      break;
    case LoggerLevel.unauth:
      ElMessage.error(msg);
      orgCtrl.exit();
      window.location.reload();
      break;
    case LoggerLevel.qrauthed:
      ElMessage.info(msg);
      window.location.href = '/#/home';
      window.location.reload();
      break;
  }
}

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
