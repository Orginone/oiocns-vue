<script setup lang='ts'>

const props = defineProps<{
  isDesign: boolean
  style: any
  children: any
  ctx: any
}>()

</script>
<template>
  <div
    :class="['element-layout-flex', isDesign ? 'is-design' : ''].join(' ')"
    :style="style"
  >
    <component
      v-for="c in children" :key="c.id"
     :is="ctx.view.components.getComponentRender(c.kind, ctx.view.mode)"
     :element="c"
    />
  </div>
</template>

<style lang='scss' scoped>
.element-layout-flex {
  display: flex;
  min-height: 100px;
  position: relative;
}

.element-wrapper.is-current {
  > .element-layout-flex.is-design {
    background-color: rgb(195, 222, 183);
    > * {
      background-color: white;
    }
  }
}
</style>