<template>
  <div class="main">
    <el-tree
      ref="treeRef"
      :data="props.menuList"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="nodeClick"
      @node-expand="nodeExpand"
    />
  </div>
</template>

<script lang="ts" setup>
  import type Node from 'element-plus/es/components/tree/src/model/node'
  import { ref, onMounted, watch } from 'vue'
  import Bucket from '@/module/cloud/bucket'
  import { encodeURIString } from '../conversion'
  interface Tree {
    label: string
    children?: Tree[]
    level?: number
  }
  const props = defineProps({
    menuList: {
      type: Array
    }
  })
  const treeRef = ref(null)
  const emit = defineEmits(['changeCurrentLocation'])

  defineExpose({ treeRef })

  const defaultProps = {
    children: 'children',
    label: 'Name'
  }
  const nodeClick = (data: Tree, item: any, treenode: any, event: any) => {
    data.level = item.level
    emit('changeCurrentLocation', data)
  }
  const nodeExpand = async (data: any, node: any, nodeData: any) => {
    data.children = await Bucket.GetLeftTree(data.Key)
    console.log('dianji', data)
  }
</script>
<style lang="scss">
  .main {
    .cloud-true {
      width: 100%;
      height: 100vh;
      overflow-y: auto;
    }
  }
</style>

<style lang="scss" scoped>
  .main {
    width: 300px;
    height: 100%;
    background-color: #fff;
    .tree-head {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tree-text {
        font-size: 14px;
      }
    }
  }
</style>
