<template>
  <ul class='qqface-wrap'>
    <li v-for="(key, value ) in qqfaceMap" @click="handleChoose(key, value)" :key="value"
      :class="['qqface', `qqface${value}`, 'small']">
    </li>
  </ul>
</template>
<script lang='ts' setup>
import { qqfaceMap } from './config'

const emit = defineEmits(['chooseFace'])
const handleChoose = (key: any, value: number) => {
  emit('chooseFace', key, value)
}

</script>

<style lang='scss' scoped>
@import "./qqface.scss";

.qqface-wrap {
  .qqface {}
}
</style>
