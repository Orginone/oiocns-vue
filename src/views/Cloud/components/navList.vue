<template>
  <div class="main">
    <el-tree
      ref="treeRef"
      :props="defaultProps"
      :node-key="'Key'"
      :expand-on-click-node="true"
      :default-expanded-keys="['']"
      :highlight-current="true"
      :lazy="true"
      :load="loadNode"
      accordion
      @node-click="nodeClick"
    >
      <template #default="{ node, data }">
        <div class="folder-node">
          <el-icon><FolderOpened v-if="node.expanded"/><Folder v-else/></el-icon>
          <span>{{ doZipFileName(node.label) }}</span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
  import type Node from 'element-plus/es/components/tree/src/model/node'
  import { ref, onMounted, watch, reactive, nextTick } from 'vue'
  import Bucket from '@/module/cloud/bucket'
  import ObjectLay from "@/module/cloud/objectlay";
  import { zipFileName } from '@/utils'
  interface Tree {
    label: string
    children?: Tree[]
  }
  const state = reactive({
    treeData: null
  })
  const props = defineProps({})
  const treeRef = ref(null)
  const emit = defineEmits(['clickFileFromTree'])

  const defaultProps = {
    children: 'dirChildren',
    label: 'Name',
    isLeaf: 'isLeaf'
  }

  // 动态加载子目录
  const loadNode = async (node: Node, resolve: (data: any[]) => void) => {
    if(node.level == 0) {
      resolve([Bucket.Root])
    } else {
      await Bucket.GetLeftTree(node.data)
      resolve(node.data.dirChildren)
    }
  }

  // 点击节点目录
  const nodeClick = (data: ObjectLay, item: any, treenode: any, event: any) => {
    emit('clickFileFromTree', data)
  }

  // 文本展示工具函数
  const doZipFileName = (name: string) => {
    return zipFileName(name, 15, 5, 6)
  }

  // 选中某个节点
  const checkedNode = (data: ObjectLay) => {
    nextTick(() => {
      treeRef.value.setCurrentKey(data.Key, true)
      const node = treeRef.value.getNode(data.Key)
      if(!node.expanded) {
        node.expand()
      }
      node.childNodes.map((child: any) => {
        if(child.expanded){
          child.collapse()
        }
      })
    })
  }

  defineExpose({ checkedNode })

  onMounted(async () => {

  })
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
