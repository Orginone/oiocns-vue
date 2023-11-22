<script setup lang='ts'>
import { IEntity } from '@/ts/core'
import {schema} from '@/ts/base'
import QrCode from 'qrcode.vue'

const props = defineProps<{
  entity: IEntity<schema.XEntity>
}>()

const locationOrigin = ref(location.origin)

</script>

<template>
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
</template>

<style lang='scss' scoped>
.qr-code-container {
  text-align: center;
  position: relative;
  margin: 30px 30px 0 30px;
}
.entity-qr-code-img {
  position: absolute;
  top:150px;
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