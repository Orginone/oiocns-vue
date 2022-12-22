<template>
  <div style="height: 100%; background: #fff">
    <div class="title">
      <component v-show="titleData.backFlag" @click="goBack" :is="'ArrowLeft'" style="width: 16px;height: 16px;cursor:pointer;position: absolute;left: 20px;"></component>
      <component :is="titleData.icon" style="width: 16px;height: 16px;color:#154ad8"></component>&nbsp;&nbsp;
      <b style="font-size: 14px;">{{titleData.title}}</b>
    </div>
    <el-menu v-bind="$attrs" :default-openeds="state.openeds"  @select="handleSelect">
      <el-sub-menu
        v-for="(item, index) in state.menuData"
        :key="item.uid"
        :index="String(index + 1)"
      >
        <template #title>
          <component :is="item.icon" style="width: 16px;height: 16px;"></component>&nbsp;
          <span style="font-size: 13px;color: #909399;">{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="val in item.children"
          :key="val.uid"
          :index="String(val.uid)"
          @mouseover='onOver(val.type)' @mouseout="onOut"
          @click="jump(val)"
        >
          <component :is="val.icon" style="width: 16px;height: 16px;" :style="{color: state.flag1 === val.type ? '#1642cb' : '#c7ccdc' }" ></component>&nbsp;
          <span style="font-size: 14px;" :style="{color: state.flag1 === val.type ? '#000' : '#a5a8ba' }" >{{ val.name }} 
          </span>
          <div class="tips" v-if="(val.num>0)">{{val.num}}</div>

        </el-menu-item>
      </el-sub-menu>
    </el-menu>
    <el-input v-model="filterText" placeholder="搜索" v-if="state.query" class="w-50 m-2" :prefix-icon="Search" />
    <el-tree ref="treeRef" 
      v-bind="$attrs" 
      :data="state.treeData"
      :default-expanded-keys="[1]"
      node-key="id" 
      :expand-on-click-node="false" 
      :filter-node-method="filterNode"
      :props="{ class: customNodeClass }"
      @node-click="nodeClick"
      v-show="state.treeData.length"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node" @mouseover='onHover(node.id)' @mouseout="onOut" @click="jump(node)">
          <span>{{ node.label }}</span>
          <span class="sp_10" v-show="node.id === state.flag">
            <el-popover
              placement="right"
              :width="100"
              trigger="click"
              :teleported="false"
            >
              <template #reference>
                <el-icon><Plus /></el-icon>
              </template>
              <div v-if="btnType=='STORE_USER_MENU'">
                <div class="btn-bus" :style="{cursor: 'pointer'}" >
                  <div class="row-btn" @click="storeBus(1,$event)"  :data-index="node.key">创建分类</div>
                  <div class="row-btn" @click="storeBus(2,$event)" :data-index="node.key">删除分类</div>
                </div>
              </div>  
              <div v-else class="btn-bus" @click="clickBus" :style="{cursor: 'pointer'}" >
                <div class="row-btn" v-for="(item,index) in data.btns" :key="item" :data-index="item.id">{{item.name}}</div>
              </div>
            </el-popover>&nbsp;
            <el-popover
              placement="right"
              :width="100"
              :append-to-body="false"
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
import { ref, watch, reactive ,nextTick ,getCurrentInstance, onMounted} from 'vue'
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue'
import { setCenterStore } from '@/store/setting'

// const emit = defineEmits(['handleSelect'])
const props = defineProps({
  data: {
    type: Array,
  },
  btnType:{
    type:String
  },
  titleData: {
    type: Object
  }, // 标题
  btnList:{
    type:Object
  }
})

const filterText = ref('')
const treeRef = ref()
const state = reactive({
  menuData: [],
  openeds: ['1', '2'],
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

const goBack = () => {
  window.history.go(-1)
}

const customNodeClass = (data: any, node: Node) => {
  if (data.isPenultimate) {
    return 'is-penultimate'
  } else {
    return 'no-penultimate'
  }
}
onMounted(()=>{
  init();
})
const onOut = () => {
  state.flag = ''
  state.flag1 = ''
}
const init =  () => {
  setTimeout(() => {
    state.treeData = props.data.filter((item: any) => {
      return item.structure === true
    })
    state.menuData = props.data.filter((item: any) => {
      return item.structure === false
    })
    state.query = state.treeData[0]?.query
  })
}
let router = useRouter()
watch(() => router.currentRoute.value.path, (newValue:any) => {
  // nextTick(() => {
    setTimeout(() => {
      init();
    });
  // })
})
watch(() => props.data, (newValue:any) => {
  init();
},
{
  immediate: true
})
watch(filterText, (val) => {
  console.log('a',val);
  treeRef.value!.filter(val)
})
const instance = getCurrentInstance();
const clickBus = (e:any)=>{
  instance?.proxy?.$Bus.emit('clickBus', e.target.dataset.index)
}
const storeBus = (type:number,e:any)=>{
  instance?.proxy?.$Bus.emit('storeBus', (type+'_'+e.target.dataset.index))
}
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
// 树点击事件
const nodeClick = (val: any) => {
  setCenterStore().currentSelectItme = val
}
const handleSelect = (key: any) => {
  instance?.proxy?.$Bus.emit('selectBtn', key)
}
</script>

<style lang="scss" scoped>
  *{font-family: '微软雅黑';}
  .title{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background: #f9fbfe;
    font-size: 16px;
  }

  .row-btn{
    text-align: center;
    line-height: 27px;
  }
  .row-btn:hover{
    background: #EBEEF5;
  }
  .row-btn:last-child{
    margin-bottom: 0;
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

  :deep .el-sub-menu__icon-arrow{
    display: none;
  }
  :deep .el-menu-item{
    height: 45px;
    width: 180px;
  }

  // :deep .no-penultimate > .el-tree-node__content{
    // font-weight: 800;
  // }

  :deep .is-penultimate > .el-tree-node__content {
    font-size: 10px;
    color: #909399;
  }
  :deep .el-tree-node__content{
    height: 40px;
  }
  // 去掉el-input自带边框
  :deep .el-input__wrapper {
    margin: 15px;
    padding-left: 15px !important;
    box-sizing: border-box;
    border: none !important;
    box-shadow: none !important;
    padding: 0px; //前边边距去掉
    border-radius: 15px;
    background: #f2f4f9;
  }
  .tips{
    margin-left: 10px;
    display: inline-block;
    height: 15px;
    width: 15px;
    line-height: 15px;
    background: #ec5b56;
    color: #fff;
    font-size: 12px;
    text-align: center;
    border-radius: 50%;
  }
</style>

