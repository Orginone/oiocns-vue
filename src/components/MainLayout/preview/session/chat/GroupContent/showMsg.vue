<script setup lang="ts">
import { IMessage } from '@/ts/core'
import { parseForwardMsg,parseMsg } from '@/views/Chats/components/parseMsg'

const props = defineProps<{item: IMessage;viewForward: (item: IMessage[]) => void}>()


</script>

<template>
  <!-- 合并转发 -->
  <template v-if="item.forward && item.forward.length">
    <parseForwardMsg :item="item.forward" :viewForward="viewForward"/>
  </template>
  <!-- 默认 -->
  <template v-else>
    <parseMsg :item="item" />
  </template>
</template>

<style lang="scss" scoped>

</style>
