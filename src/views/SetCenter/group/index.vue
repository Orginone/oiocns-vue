<template>
  <div class="container mainBox" ref="container">
    <div class="content mid box">
      <div class="info" ref="infoWrap">
        <Info ref="info" />
      </div>
      <div class="body" ref="bodyWrap">
        <Body ref="body" :tabHeight="tabHeight" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import Info from './components/info.vue'
  import Body from './components/body.vue'
  import { ref, onMounted } from 'vue'

  const info = ref(null)
  const body = ref(null)
  const unitTree = ref(null)

  const dataSource = ref<Tree[]>([
  {
    id: 1,
    label: '浙江省财产年报集团',
    children: [
      {
        id: 5,
        label: '集团子节点',
      },
      {
        id: 6,
        label: '集团子节点',
      },
    ],
  },
  {
    id: 2,
    label: '浙江省资产年报集团',
    children: [
      {
        id: 5,
        label: '集团子节点',
      },
      {
        id: 6,
        label: '集团子节点',
      },
    ],
  },
  {
    id: 3,
    label: '浙江省资产年报集团',
    children: [
      {
        id: 5,
        label: '集团子节点',
      },
      {
        id: 6,
        label: '集团子节点',
      },
    ],
  },
])

</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    padding: 3px 0;
    box-sizing: border-box;
    display: flex;

    .content {
      width: 100%;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      overflow: hidden;
      .info {
        padding: 0 0 3px 0;
        box-sizing: border-box;
      }
      .body {
        height: 100%;
      }
    }
  }
</style>
