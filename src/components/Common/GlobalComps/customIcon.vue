<script setup lang="ts">

const props = defineProps<{
  type: 'left' | 'right';
  size: number;
  width: number;
  selected: boolean;
}>()

</script>

<template>
  <div
    :style="{
      width: size+'px',
      height: (size + 2)+'px',
      border: '2px solid #3838b9',
      borderRadius: '4px',
      cursor: 'pointer',
    }"
  >
    <div v-if="selected"
      :style="{
        float: type==='left'?'none':'right',
        height: (size - 2)+'px',
        width: width+'px',
        background: '#3838b9',
      }"></div>
    <div v-else
      :style="{
        float: type==='left'?'none':'right',
        height: (size - 2)+'px',
        width: width+'px',
        borderLeft: '2px solid #3838b9',
      }"></div>
  </div>
</template>

