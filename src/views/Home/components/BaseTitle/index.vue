<script setup lang="ts">
import { VueElement } from 'vue';
defineProps<{
  title: string;
  more?: string;
  left?: VueElement;
  onClick?: Function;
}>()
</script>

<template>
  <div class="basicTitle">
    <h4>{{title}}</h4>
    <a v-if="more" @click="onClick?.apply(this, [])">
      更多
    </a>
    {{left}}
  </div>
</template>

<style lang="scss" scoped>
.basicTitle {
  width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}

</style>
