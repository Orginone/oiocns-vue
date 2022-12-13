<template>
  <div class="main" :class="{autoWidth: props.onlySelect}">
    <div class="contentTile" v-if="!props.onlySelect">
      <el-icon class="back" title="返回" @click="goBack"><ArrowLeft/></el-icon>
      <el-icon class="doc"><Document/></el-icon>
      <b>文档</b>
    </div>
    <el-tree
      ref="treeRef"
      :props="defaultProps"
      :node-key="'key'"
      :expand-on-click-node="true"
      :highlight-current="true"
      :lazy="true"
      :load="loadNode"
      accordion
      @node-click="nodeClick"
    >
      <template #default="{ node, data }">
        <div class="folder-node">
          <div class="node-label">
            <el-icon><FolderOpened v-if="node.expanded"/><Folder v-else/></el-icon>
            <span>{{ doZipFileName(node.label) }}</span>
          </div>
          <el-icon class="node-dots" @click.stop="showNodeBtns" v-if="!props.onlySelect"><MoreFilled /></el-icon>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
  import type Node from 'element-plus/es/components/tree/src/model/node'
  import { ref, onMounted, watch, reactive, nextTick } from 'vue'
  import Bucket from '@/module/cloud/bucket'
  import { zipFileName } from '@/utils'
  import { useRouter } from "vue-router";

  const router = useRouter()
  const props = defineProps({
    onlySelect: {
      type: Boolean,
      default: false
    }
  })
  const treeRef = ref(null)
  const emit = defineEmits(['clickFileFromTree', 'selectTreeNode'])

  const defaultProps = {
    children: 'dirChildren',
    label: 'name',
    isLeaf: 'isLeaf'
  }

  // 返回到仓库
  const goBack = () => {
    router.push({ path: '/store' })
  }

  // 动态加载子目录
  const loadNode = async (node: Node, resolve: (data: any[]) => void) => {
    if(node.level == 0) {
      resolve([Bucket.DocModel.root])
    } else {
      await Bucket.GetLeftTree(node.data)
      resolve(node.data.dirChildren)
    }
  }

  // 点击节点目录
  const nodeClick = (data: any, item: any, treenode: any, event: any) => {
    if(props.onlySelect) {
      emit('selectTreeNode', data)
    } else {
      emit('clickFileFromTree', data)
    }
  }

  // 文本展示工具函数
  const doZipFileName = (name: string) => {
    return zipFileName(name, 15, 5, 6)
  }

  // 选中某个节点
  const checkedNode = (data: any) => {
    nextTick(() => {
      treeRef.value.setCurrentKey(data.key, true)
      const node = treeRef.value.getNode(data.key)
      if(node && !node.expanded) {
        node.expand()
      }
      node && node.childNodes && node.childNodes.map((child: any) => {
        if(child.expanded){
          child.collapse()
        }
      })
    })
  }

  // 添加节点
  const appendNode = (data: any, parent: any) => {
    nextTick(() => {
      data.isLeaf = true
      treeRef.value.append(data, parent.key || parent)
    })
  }

  // 删除节点
  const removeNode = (data: any) => {
    nextTick(() => {
      treeRef.value.remove(data.key)
    })
  }

  // 显示节点操作
  const showNodeBtns = () => {
    console.log('点击显示节点操作栏')
  }

  defineExpose({ checkedNode, removeNode, appendNode })

  onMounted(async () => {
    if(props.onlySelect) {
      checkedNode(Bucket.DocModel.root)
      emit('selectTreeNode', Bucket.DocModel.root)
    }
  })
</script>
<style lang="scss">
  .el-tree-node__label {
    width: 100%;
  }
</style>
<style lang="scss" scoped>
  .main {
    width: 300px;
    height: 100%;
    background-color: #fff;
    margin-right: 3px;

    &.autoWidth {
      width: 100%;
    }

    .contentTile{
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      background-color: #f9fbfe;
      font-size: 16px;
      margin-bottom: 10px;
      .back {
        width: 16px;
        height: 16px;
        cursor: pointer;
        position: absolute;
        left: 20px;
      }
      .doc {
        width: 16px;
        height: 16px;
        color:#154ad8;
        margin-right: 10px;
      }
      b {
        font-size: 14px;
      }
    }

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
      padding-right: 10px;
      justify-content: space-between;
      .node-label {
        display: flex;
        align-items: center;
        span {
          margin-left: 5px;
        }
      }
      .node-dots {
        display: none;
      }
      &:hover {
        .node-dots {
          display: block;
        }
      }
    }
  }
</style>
