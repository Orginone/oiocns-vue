<template>
  <div class="main">
    <div class="contentTile">
      <el-icon class="back" title="返回" @click="goBack"><ArrowLeft/></el-icon>
      <el-icon class="doc"><Document/></el-icon>
      <b>{{docsCtrl.tabIndex=='1'?'创建':'获取'}}</b>
    </div>
    <el-tree
      v-if="props.NavData != [null]"
      ref="treeRef"
      :data="props.NavData || []"
      :props="defaultProps"
      :node-key="'key'"
      :expand-on-click-node="true"
      :highlight-current="true"
      @node-click="nodeClick"
      show-checkbox
      @check-change="handleCheckChange"
    >
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { ref} from 'vue'
import {docsCtrl,INullSpeciesItem} from '@/ts/coreIndex';
import { useRouter } from "vue-router";

const props = defineProps({
  NavData:{
    type: Array,
    default: false
  }
})

const router = useRouter()

const treeRef = ref(null)
const emit = defineEmits(['clickFileFromTree'])

const defaultProps = {
  children: 'children',
  label: 'name',
  isLeaf: 'isRoot'
}

// 返回到仓库
const goBack = () => {
  router.push({ path: '/store' })
}

const handleCheckChange = (data:INullSpeciesItem, checked:any, indeterminate:any) => {
  if(checked){
    emit('clickFileFromTree', data)
  }
}

// 点击节点目录
// const nodeClick = (data: INullSpeciesItem, item: any, treenode: any, event: any) => {
//   emit('clickFileFromTree', data)
// }
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
      .node-btns{
        background: transparent;
        border-radius: none;
        border:none;
        height: auto;
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
