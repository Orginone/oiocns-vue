<template>
  <div style="height: 100%; background: #fff">
    <div class="title"><component :is="titleData.icon" style="width: 16px;height: 16px;color:#154ad8"></component>&nbsp;&nbsp;<span style="font-size: 14px;">{{titleData.title}}</span></div>
    <el-menu v-bind="$attrs">
      <el-sub-menu
        v-for="(item, index) in state.menuData"
        :key="item.uid"
        :index="String(index + 1)"
      >
        <template #title>
          <component :is="item.icon" style="width: 16px;height: 16px;"></component>&nbsp;
          <span style="font-size: 12px;color: #909399;">{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="val in item.children"
          :key="val.uid"
          :index="String(val.uid)"
          @mouseover='onOver(val.type)' @mouseout="onOut"
          @click="jump(val)"
        >
          <component :is="val.icon" style="width: 16px;height: 16px;" :style="{color: state.flag1 === val.type ? '#000' : '#c7ccdc' }" ></component>&nbsp;
          <b style="font-size: 14px;" :style="{color: state.flag1 === val.type ? '#000' : '#c7ccdc' }" >{{ val.name }}</b>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
    <el-input v-model="filterText" placeholder="搜索" v-if="state.query" class="w-50 m-2" :prefix-icon="Search" />
    <el-tree ref="treeRef" 
      v-bind="$attrs" 
      :data="state.treeData" 
      node-key="id" 
      :expand-on-click-node="false" 
      :filter-node-method="filterNode"
      :props="{ class: customNodeClass }"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node" @mouseover='onHover(node.id)' @mouseout="onOut" @click="jump(node)">
          <span>{{ node.label }} </span>
          <span class="sp_10" v-show="node.id === state.flag">
            <el-popover
              placement="right"
              :width="150"
              trigger="click"
            >
              <template #reference>
                <el-icon><Plus /></el-icon>
              </template>
              <slot name="service"></slot>
            </el-popover>&nbsp;
            <el-popover
              placement="right"
              :width="150"
              trigger="click"
            >
              <template #reference>
                <el-icon><MoreFilled /></el-icon>
              </template>
              <slot name="more"></slot>
            </el-popover>
          </span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue'
import router from '@/router'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits(['handleClose'])
const props = defineProps({
  data: {
    type: Array,
  },
  titleData: {
    type: Object
  }, // 标题
})

const filterText = ref('')
const treeRef = ref()
const state = reactive({
  menuData: [],
  treeData: [],
  query: false, // 是否显示搜索框
  flag: '', // 是否高亮标记
  flag1: ''// 是否高亮标记
})
const onHover = (id: string) => {
  state.flag = id
}

const onOver = (id: string) => {
  state.flag1 = id
}

const customNodeClass = (data: any, node: Node) => {
  if (data.isPenultimate) {
    return 'is-penultimate'
  } else {
    return 'no-penultimate'
  }
}

const onOut = () => {
  state.flag = ''
  state.flag1 = ''
}
const init = () => {
  state.treeData = props.data.filter((item: any) => {
    return item.structure === true
  })
  state.menuData = props.data.filter((item: any) => {
    return item.structure === false
  })
  state.query = state.treeData[0]?.query
}
init()

watch(filterText, (val) => {
  console.log(val);
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}

// 路由跳转
const jump = (val:any)=>{
    if(val.url){
      router.push(val.url)
    }else if (val.data.url){
      router.push(val.data.url)
    }
}
// const handleClose = () => {
//   emit('handleClose', 'menu')
// }
// const select = () => {
//   emit('handleClose', 'tree')

// }
</script>

<style lang="scss" scoped>
  
  .title{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: #f9fbfe;
    font-size: 16px;
  }
  .custom-tree-node {
    width: 180px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // position: relative;
    .sp_10{
      position: absolute;
      right: 8px;
    }
  }

  ::v-deep .el-menu-item{
    height: 35px;
    width: 180px;
  }

  ::v-deep .no-penultimate > .el-tree-node__content{
    font-weight: 800;
  }

  ::v-deep .is-penultimate > .el-tree-node__content {
    font-size: 10px;
    color: #909399;
    font-weight: normal;
  }
  ::v-deep .el-tree-node__content{
    height: 40px;
  }
  // 去掉el-input自带边框
  ::v-deep .el-input__wrapper {
    margin: 15px;
    padding-left: 15px !important;
    box-sizing: border-box;
    border: none !important;
    box-shadow: none !important;
    padding: 0px; //前边边距去掉
    border-radius: 15px;
    background: #f2f4f9;
  }
</style>
