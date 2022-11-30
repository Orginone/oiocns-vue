<template>
  <div class="main">
    <el-tree
      ref="treeRef"
      :data="props.menuList"
      :props="defaultProps"
      :expand-on-click-node="false"
      accordion
      @node-click="nodeClick"
      @node-expand="nodeExpand"
    >
      <template #default="{ node, data }">
        <div class="folder-node">
          <el-icon><FolderOpened v-if="node.expanded"/><Folder v-else/></el-icon>
          <span>{{ node.label }}</span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
  import type Node from 'element-plus/es/components/tree/src/model/node'
  import { ref, onMounted, watch } from 'vue'
  import Bucket from '@/module/cloud/bucket'
  import { encodeURIString } from '../conversion'
  import ObjectLay from "@/module/cloud/objectlay";
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
  const emit = defineEmits(['changeCurrentLocation', 'gotoBTM'])

  defineExpose({ treeRef })

  const defaultProps = {
    children: 'children',
    label: 'Name',
  }
  const nodeClick = (data: ObjectLay, item: any, treenode: any, event: any) => {
    //data.Meta.level = item.level || 0
    console.log(data, item, treenode)
    if(item.level == 1) {
      emit('gotoBTM')
    } else {
      emit('changeCurrentLocation', data.Meta)
    }
  }
  const nodeExpand = async (data: any, node: any, nodeData: any) => {
    data.children = await Bucket.GetLeftTree(data)
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
    .folder-node {
      display: flex;
      flex-direction: row;
      align-items: center;
      span {
        margin-left: 5px;
      }
    }
  }
</style>
