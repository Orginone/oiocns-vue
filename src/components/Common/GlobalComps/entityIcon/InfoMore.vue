<script setup lang="ts">
import {Info} from '@/icons/im'
import { command } from '@/ts/base'

defineProps<{entity: any,size: number}>()
</script>

<template>
<span v-if="entity && size>18" class="infoMore" 
  :style="{ '--size': `${-size+6}px` }"
  @click="command.emitter('executor', 'open', entity, 'preview')"
>
  <ElIcon color="#abc"><Info/></ElIcon>
</span>
</template>

<style lang="scss" scoped>
.infoMore {
  position: absolute;
  z-index: 101;
  font-size: 12px;
  top: 0;
  left: 0;
  transform: translate(-10px,-10px);
  width: 4px;
}
</style>
