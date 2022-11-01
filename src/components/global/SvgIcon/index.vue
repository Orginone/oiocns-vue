<template>
  <svg :class="['svg-icon', className]" aria-hidden="true">
    <use :xlink:href="'#icon-' + iconName" />
  </svg>
</template>

<script lang="ts" setup>
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  className: {
    type: [String, Array],
    default: ''
  }
})
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: -0.15em;
  overflow: hidden;
  position: relative;
}
</style>
