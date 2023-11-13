<script setup lang="ts">
import { command } from '@/ts/base'
import orgCtrl from '@/ts/controller'
import EntityIcon from '@/components/Common/GlobalComps/entityIcon/index.vue'
import TypeIcon from '@/components/Common/GlobalComps/typeIcon.vue'

export interface IMenu {
  label: string
  cmd: string
  icon: any
}
defineProps<{
  menu: IMenu;
}>()

</script>

<template>
  <Button
    class="linkBtn"
    type="button"
    @click="command.emitter('executor', menu.cmd, orgCtrl.user);"
  >
    <TypeIcon :iconType="menu.icon" :size="18" />
    <span style="margin-left: 10px;">{{menu.label}}</span>
  </Button>
</template>

<style lang="scss" scoped>
.linkBtn {
  height: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  padding: 8px 30px;
  background-color: #f5f5f5;
  border: 0;
  cursor: pointer;
  border-radius: 6px;
  &:hover {
    // TODO:
    // background: @active-background;
    background-color: #e6f1ff;
  }
}
</style>
