<script setup lang='ts'>
import { kernel, schema } from '@/ts/base'
import DesignEntities from './DesignEntities.vue'
import ViewEntities from './ViewEntities.vue'
import { Context } from '../../../render/PageContext'
import { SEntity } from '../../../design/config/FileProp'
import { VNode } from 'vue';
const props = defineProps<{
  id: string
  className: string
  ctx: Context
  size: number
  span: number
  forms: SEntity[]
  props: any
  content?: (params: { data: schema.XThing }) => VNode | VNode[]
  banner?: (params: Object) => VNode | VNode[]
  leftTree?: (params: Object) => VNode | VNode[]
  topDicts?: (params: Object) => VNode | VNode[]
  topForm?: (params: Object) => VNode | VNode[]
  badge?: (params: Object) => VNode | VNode[]
  car?: (params: Object) => VNode | VNode[]
}>()
</script>
<template>
<div class="layout">
  <component class="banner" :is="banner?.({})" />
  <div class="body">
    <div class="species">
      <!-- TODO: -->
      <!-- <component :is="leftTree?.({})" /> -->
    </div>
    <!-- TODO: -->
    <!-- <div class="content">
      <div>{{topDicts?.({})}}</div>
      <div>{{topForm?.({ forms })}}</div>
      <div class="entities">
        <DesignEntities v-if="ctx.view.mode == 'design'" :ctx="ctx" v-bind="props" />
        <ViewEntities v-else :ctx="ctx" v-bind="props" />
      </div>
    </div> -->
  </div>
  TODO: transaction-shoppingBtn
  <!-- <div class="shoppingBtn">
    {{badge?.({})}}
    {{car?.({})}}
  </div> -->
</div>
</template>

<style lang='scss' scoped>
.layout {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.body {
  width: 100%;
  height: 1px;
  flex: auto;
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.species {
  height: 100%;
  overflow-y: scroll;
}

.content {
  width: 1px;
  flex: auto;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.contentCard {
  text-align: center;
}

.shoppingBtn {
  position: absolute;
  bottom: 40px;
  right: 40px;
  z-index: 999;
}

.box {
  text-align: center;
}
</style>