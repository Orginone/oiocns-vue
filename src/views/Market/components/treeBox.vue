<template>
  <div class="treeLayout" v-if="isShow">
    <div class="leftTreeBox">
      <el-tree
        ref="leftTree"
        node-key="id"
        :props="prop"
        :load="loadNode"
        lazy
        @node-click="handleNodeClick"
      />
    </div>
    <div class="centerTreeBox">
      <el-tree
        ref="centerTree"
        :data="state.centerTreeData"
        show-checkbox
        node-key="id"
        :props="prop"
        @check-change="handleCheckChange"
      />
    </div>
    <div class="rightTreeBox">
      <div class="rightTreeBox-row" v-for="item in state.rightTreeData" :key="item.id">
        <div>{{ item.groupName }}</div>
        <div>{{ item.name }}</div>
        <el-icon @click="delRightTreeData(item)"><CircleClose /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { log } from 'console'
  import type Node from 'element-plus/es/components/tree/src/model/node'
  import { ref, reactive, onMounted, nextTick, watch } from 'vue'
  interface Tree {
    id: string
    level: number
    name: string
    groupId?: string
    leaf?: boolean
  }
  const prop = {
    label: 'name',
    children: 'children',
    isLeaf: 'leaf'
  }
  const leftTree = ref(null)
  const centerTree = ref(null)
  const state = reactive({
    leftTreeData: [],
    centerTreeData: [],
    rightTreeData: [],
    groupId: ''
  })
  const isShow = ref<boolean>(false)
  const props = defineProps({
    leftTableData: {
      type: Object,
      default: () => {}
    },
    isLazy: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits(['getLeftData', 'getLoadNode', 'handleLeftClick'])

  onMounted(() => {
    getLeftData()
  })

  const getLeftData = () => {
    emit('getLeftData', (res: any) => {
      state.leftTreeData = res
      isShow.value = true
    })
  }

  const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
    if (node.level === 0) {
      state.leftTreeData.forEach((el) => {
        el.level = node.level
      })
      return resolve(state.leftTreeData)
    }
    if (node.level >= 1) {
      emit('getLoadNode', node.data.id, (res: any) => {
        if (res) {
          resolve(res)
        } else {
          resolve([])
        }
      })
    }
  }

  const handleCheckChange = (data: Tree, check: boolean) => {
    console.log(data)

    if (state.groupId == data.groupId) {
      if (check) {
        state.rightTreeData.push(data)
      } else {
        state.rightTreeData.splice(state.rightTreeData.indexOf(data), 1)
      }
    }
  }

  const delRightTreeData = (data: any) => {
    // state.rightTreeData.splice(state.rightTreeData.indexOf(data), 1)
    centerTree.value.setChecked(data.id, false)
  }

  const handleNodeClick = (data: Tree) => {
    state.groupId = data.id
    emit('handleLeftClick', data, (res: any) => {
      if (res.length > 0) {
        res.forEach((el: any) => {
          el.groupName = data.name
          el.groupId = data.id
        })
      }
      state.centerTreeData = res
      if (state.rightTreeData.length > 0) {
        let arr: any[] = []
        state.rightTreeData.forEach((el) => {
          if (el.groupId == data.id) {
            arr.push(el.id)
          }
        })
        centerTree.value.setCheckedKeys(arr)
      }
      console.log('=========', state.rightTreeData)
    })
  }
</script>

<style lang="scss" scoped>
  .treeLayout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  .leftTreeBox {
    width: 32%;
    border: 1px solid rgb(240, 242, 245);
    height: 100%;
    overflow: auto;
  }
  .centerTreeBox {
    width: 32%;
    border: 1px solid rgb(240, 242, 245);
    height: 100%;
    overflow: auto;
  }
  .rightTreeBox {
    width: 32%;
    border: 1px solid rgb(240, 242, 245);
    height: 100%;
    overflow: auto;
    &-row {
      justify-content: space-between;
      display: flex;
      margin: 5px;
      .el-icon {
        cursor: pointer;
      }
    }
  }
</style>
