<script setup lang='ts'>
const props = defineProps<{
  name: string
}>()
</script>

<template>
  <div>
    <ElResult icon="error" :title="`元素 '${name}' 未注册组件`" />
  </div>
</template>

<style lang='scss' scoped>

</style>