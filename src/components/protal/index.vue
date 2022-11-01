<template>
  <div class="base">
    <div class="baseCover" v-if="cover"></div>
    <AppCommon v-if="containLink == 'appcommon'"></AppCommon>
    <AppMarket v-if="containLink == 'appMarket'"></AppMarket>
    <Head v-if="containLink == 'head'"></Head>
    <Invitate v-if="containLink == 'invitate'"></Invitate>
    <ManageSystem v-if="containLink == 'manageSystem'"></ManageSystem>
    <Organization v-if="containLink == 'organization'"></Organization>
  </div>
</template>

<script setup lang="ts">
  import AppCommon from './components/appCommon.vue'
  import AppMarket from './components/appMarket.vue'
  import Head from './components/head.vue'
  import Invitate from './components/invitate.vue'
  import ManageSystem from './components/manageSystem.vue'
  import Organization from './components/organization.vue'
  const props = defineProps({
    cover: {
      type: Boolean,
      required: false
    },
    containLink: {
      type: String,
      default: ''
    }
  })
</script>

<style lang="scss" scoped>
  .base {
    width: 100%;
    height: 100%;
  }
  .baseCover {
    position: absolute;
    width: 96%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0);
    // background: red;
    z-index: 99999;
  }
</style>
