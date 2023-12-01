<script setup lang='ts'>
import { generateUuid } from '@/ts/base/common'
import { DesignContext, PageContext} from '../PageContext'
import { PageElement } from '../../core/PageElement'
import ErrorBoundary from '../ErrorBoundary.vue'
const props = defineProps<{
  element: any,
}>()

const ctx = inject<PageContext>('PageContext') as DesignContext
const key = ref(generateUuid())
const element = ref<PageElement | null>(ctx.view.currentElement)

/** */
const handleClick = ((e: MouseEvent) => {
  e.stopPropagation();
  ctx.view.currentElement = props.element
})

ctx.view.subscribe((type, cmd, args) => {
  if (type == 'props' && cmd == 'change' && args == props.element.id) {
    key.value = generateUuid()
  } else if (type == 'current' && cmd == 'change') {
    element.value = ctx.view.currentElement
  }
})

</script>
<template>
  <!--TODO: <ErrorBoundary> -->
    <div
      :key="key"
      :class="[
        'element-wrapper',
        element?.id == props.element.id ? 'is-current' : '',
      ].join(' ')"
      @click="handleClick"
    >
      <component :is="element" v-bind="mergeProps(element, ctx.view.treeManager.factory, props.slotParams)"/>
    </div>
  <!-- </ErrorBoundary> -->
</template>

<style lang='scss' scoped>

</style>