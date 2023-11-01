<script setup lang="ts">
import { command } from '@/ts/base';
import orgCtrl from '@/ts/controller';
export interface IMenu {
  label: string;
  cmd: string;
}
defineProps<{
  menu: IMenu;
}>()

</script>

<template>
  <ElButton
    class="linkBtn"
    text
    @click="command.emitter('executor', menu.cmd, orgCtrl.user);"
  >
    {{menu.label}}
  </ElButton>
</template>

<style lang="scss" scoped>
.linkBtn {
  margin: 10px;
  height: 35px;
  width: 90px;
  background-color: #f5f5f5;
  &:hover {
    // TODO:
    // background: @active-background;
    background-color: red;
  }
}
</style>
