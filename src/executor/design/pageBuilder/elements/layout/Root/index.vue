<script setup lang='ts'>
import  Slot  from '../../../render/Slot.vue'
const props = defineProps<{
  isDesign: boolean
  layoutType: any
  children: any
}>()

</script>
<template>

<div
  style="height: 100%;"
  :class="['element-root', isDesign ? 'is-design' : '', `is-${layoutType.value}`].join(' ')"
>
  <div class="design-tip" v-if="isDesign">
    <div>设计模式</div>
  </div>
  <Slot
    v-for="c in children" :key="c.id" 
    :child="c" 
  />
</div>
    
</template>

<style lang='scss' scoped>

</style>
