<script setup lang='ts'>
import { PageElement } from '../core/PageElement'
import SlotProp from '../design/config/SlotProp'
import { PageContext } from './PageContext'
import { Ref } from 'vue'

type SlotProps<S extends Dictionary<any> = Dictionary<any>> = {
  params?: S;
  child: PageElement;
}
const props = defineProps<SlotProps>()
const ctx = inject<PageContext>('PageContext')
const Render = ctx.view.components.getComponentRender(props.child.kind, ctx.view.mode)

</script>
<template>
  <component :is="Render" :element="child" :slotParams="params" />
</template>

<style lang='scss' scoped>

</style>