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
          
          <el-dropdown v-if="!props.onlySelect">
            <el-button class="node-btns"><el-icon class="node-dots"><MoreFilled /></el-icon></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click.stop="handleOptions('add',data)">新建文件夹</el-dropdown-item>
                <el-dropdown-item @click.stop="handleOptions('refresh',data)">刷新文件夹</el-dropdown-item>
                <el-dropdown-item >
                  <el-upload class="upload-demo"
                    multiple
                    ref="uploadRef"
                    :show-file-list="false"
                    :limit="3"
                    :data="data"
                    :http-request="customUpload"
                  >
                    上传文件
                  </el-upload>
                </el-dropdown-item>
                <el-dropdown-item v-if="data.key && data.key != '主目录'" @click.stop="handleOptions('edit',data)">重命名</el-dropdown-item>
                <el-dropdown-item v-if="data.key && data.key != '主目录'" @click.stop="handleOptions('copy',data)">复制到</el-dropdown-item>
                <el-dropdown-item v-if="data.key && data.key != '主目录'" @click.stop="handleOptions('move',data)">移动到</el-dropdown-item>
                <el-dropdown-item v-if="data.key && data.key != '主目录'" @click.stop="handleOptions('del',data)" style="color: #f67c80">删除文件</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- <el-icon class="node-dots" @click.stop="showNodeBtns" v-if="!props.onlySelect"><MoreFilled /></el-icon> -->
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
  import type Node from 'element-plus/es/components/tree/src/model/node'
  import {ElMessage, UploadProps, UploadRequestOptions} from "element-plus";
  import { ref, onMounted, watch, reactive, nextTick } from 'vue'
  import Cloud, { FileObject } from '@/ts/cloud'
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
  const emit = defineEmits(['clickFileFromTree', 'selectTreeNode', 'selectOptions'])

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
  const loadNode = async (node: Node, resolve: (data: FileObject[]) => void) => {
    if(node.level == 0) {
      resolve([Cloud.DocModel.root])
    } else {
      await Cloud.GetLeftTree(node.data as FileObject)
      resolve(node.data.dirChildren)
    }
  }

  // 点击节点目录
  const nodeClick = (data: FileObject, item: any, treenode: any, event: any) => {
    if(props.onlySelect) {
      emit('selectTreeNode', data)
    } else {
      emit('clickFileFromTree', data)
    }
  }

  //操作
  const handleOptions = (type:any,data:any) => {
    const json = {type:type,data:data}
    emit('selectOptions', json)
  }

  // 文本展示工具函数
  const doZipFileName = (name: string) => {
    return zipFileName(name, 15, 5, 6)
  }

  // 选中某个节点
  const checkedNode = (data: FileObject) => {
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
  const appendNode = (data: FileObject, parent: FileObject) => {
    nextTick(() => {
      data.isLeaf = true
      treeRef.value.append(data, parent.key || parent)
    })
  }

  // 删除节点
  const removeNode = (data: FileObject) => {
    nextTick(() => {
      treeRef.value.remove(data.key)
    })
  }

    // 自定义文件上传
  const customUpload = async (options: UploadRequestOptions) => {
    const current = options.data as FileObject
    const file = options.file as File
    await current.upload(file.name, file, async (res: any) => {
      if(res > 0) {
        ElMessage.success('上传成功')
        const json = {type:'refresh',data:current}
        emit('selectOptions', json)
      }
    })
  }

  // 显示节点操作
  const showNodeBtns = () => {
    console.log('点击显示节点操作栏')
  }

  defineExpose({ checkedNode, removeNode, appendNode })

  onMounted(async () => {
    if(props.onlySelect) {
      checkedNode(Cloud.DocModel.root)
      emit('selectTreeNode', Cloud.DocModel.root)
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
