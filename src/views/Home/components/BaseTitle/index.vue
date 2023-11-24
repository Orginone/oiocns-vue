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
    <h4 class="basicTitle_title">{{title}}</h4>
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
  align-items: center;
  .basicTitle_title {
    color: rgba(0,0,0,.85);
    font-weight: 600;
    font-size: 20px;
    margin: 0;
  }
}

</style>
