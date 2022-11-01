<template>
  <SandBox :appInfo="commonStore.appInfo" :containLink="commonStore.iframeLink" :appId="commonStore.iframeID" :key="commonStore.iframeLink" />
</template>
<script lang="ts" setup>
  import SandBox from '@/components/sandBox/index.vue'
  import { useCommonStore } from '@store/common'
  const commonStore= useCommonStore()
</script>

<style lang="scss" scoped>

</style>
