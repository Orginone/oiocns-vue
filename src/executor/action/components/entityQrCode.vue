<script setup lang='ts'>
import { IEntity } from '@/ts/core'
import {schema} from '@/ts/base'
import QrCode from 'qrcode.vue';
import { resetContent } from '@/executor/config';

const props = defineProps<{
  entity: IEntity<schema.XEntity>
  isShow: boolean
}>()

const isShow = ref(true)
const locationOrigin = ref(location.origin)

</script>
<template>
  <ElDialog v-model="isShow" @close="resetContent" :show-close="false" destroy-on-close>
    <div class="qr-code-container">
      <QrCode
        level="H"
        :size="300"
        foreground='#204040'
        :value="`${locationOrigin}/${entity.id}`"
      />
      <dic class="entity-qr-code-img">
        <img :src="`${entity.share.avatar?.thumbnail ?? ''}`" alt="">
      </dic>
      <div class="entity-qr-code-txt">
        {{entity.name}}
      </div>
    </div>
    <template #footer>
      <ElButton type="primary" @click="isShow = false">关闭</ElButton>
    </template>
  </ElDialog>
</template>

<style lang='scss' scoped>
.qr-code-container {
  text-align: center;
  position: relative;
}
.entity-qr-code-img {
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  >img {
    width: 85px;
    height: 85px;;
  }
}
.entity-qr-code-txt {
  font-size: 22px;
  margin-top: 10px;
}
</style>