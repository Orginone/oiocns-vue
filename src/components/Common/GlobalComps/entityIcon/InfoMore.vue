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
  position: relative;
  z-index: 101;
  font-size: 12px;
  top: var(--size);
  width: 4px;
}
</style>
