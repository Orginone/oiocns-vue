<template>
  <div class="menu-side" style="height: 100%; background: #fff">
    <div class="title">
      <component v-show="titleData.backFlag" @click="goBack" :is="'ArrowLeft'" style="width: 16px;height: 16px;cursor:pointer;position: absolute;left: 20px;"></component>
      <component :is="titleData.icon" style="width: 16px;height: 16px;color:#154ad8"></component>&nbsp;&nbsp;
      <b style="font-size: 14px;">{{titleData.title}}</b>
    </div>
    <el-tabs v-model="activeName" v-if="titleData.title == '仓库'" class="todo-tabs" @tab-click="handleClick">
      <el-tab-pane label="创建" name="1"></el-tab-pane>
      <el-tab-pane label="获取" name="2"></el-tab-pane>
    </el-tabs>
    <el-tabs v-model="state.tabActive" class="todo-tabs" v-if="router.currentRoute.value.path.indexOf('/service') != -1" @tab-click="tabsClick">
      <el-tab-pane label="待办" name="1"> </el-tab-pane>
      <el-tab-pane label="发起业务" name="2"> </el-tab-pane>
    </el-tabs>
    <el-menu v-bind="$attrs" :default-openeds="state.openeds"  v-if="state.tabActive=='1'" @select="handleSelect">
      <el-sub-menu
        v-for="(item, index) in state.menuData"
        :key="item.uid"
        :index="String(index + 1)"
      >
        <template #title>
          <component :is="item.icon" style="width: 16px;height: 16px;"></component>&nbsp;
          <span style="font-size: 14px;color: #909399;">{{ item.name }}</span>
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
      v-if="state.tabActive == '1' && state.treeData.length"
      v-bind="$attrs" 
      :data="state.treeData"
      :default-expanded-keys="[1]"
      node-key="id" 
      :expand-on-click-node="false" 
      :filter-node-method="filterNode"
      :props="{ class: customNodeClass }"
      @node-click="nodeClick"
      v-show="props.titleData.title != '设置' && props.titleData.title != '仓库' && props.titleData.title != '我的'"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node" @mouseover='onHover(node.id)' @mouseout="onOut" @click="jump(node)">
            <span style="padding-right:8px">{{ node.label }}
              <div  v-if="node?.data?.isStoreMenu" class="blue-tips">{{node?.data?.items?.length}}</div>
            </span>
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
                  <div class="row-btn" @click="storeBus(1,$event)" :data-index="node.key">创建分类</div>
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
    <div class="tree-wrap" v-if="state.tabActive =='2'">
      <el-tree 
        show-checkbox
        :props="thingProps"
        @check="getNodes"
        :data="state.thingList"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, reactive ,nextTick ,getCurrentInstance, onMounted} from 'vue'
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
import { setCenterStore } from '@/store/setting'
import {docsCtrl,userCtrl,thingCtrl,INullSpeciesItem} from '@/ts/coreIndex';
let router = useRouter()
const emit = defineEmits(['handleSelect'])
const props = defineProps({
  data: {
    type: Array,
  },
  btnType:{
    type:String,
    default:'',
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
let activeName = ref('1')
const state = reactive({
  menuData: [],
  openeds: ['1', '2'],
  treeData: [],
  query: false, // 是否显示搜索框
  flag: '', // 是否高亮标记
  flag1: '',// 是否高亮标记
  tabActive:'1',
  thingList:[], //实际显示的应用列表
  current:[],
  tableHead: [],
  navData:[]
})
const onHover = (id: string) => {
  state.flag = id
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  docsCtrl.setTabIndex(tab.props.name)
  emit('clickTabs', tab.props.name)
}
const onOver = (id: string) => {
  state.flag1 = id
}
const goBack = () => {
  window.history.go(-1)
}
const tabsClick = () => {
}
const customNodeClass = (data: any, node: Node) => {
  if (data.isPenultimate) {
    return 'is-penultimate'
  } else {
    return 'no-penultimate'
  }
}
const thingProps = {
  label: 'label',
  children: 'children',
}
onMounted(()=>{
  console.log('aa',thingCtrl);
  init();
  setTimeout(async () => {
    let res = await loadThingMenus('work', true);
    console.log('ress',res);
    // let arr: any[] =[]
    // res.forEach(element => {
    //   console.log('element',element)
    //   arr.push(
    //     {
    //       label:element?.label,
    //       children:getChildren(element?.children),
    //     }
    //   )
    // });
    state.thingList = res;
    console.log('thingList',state.thingList);
  }, 1000);
})
const getChildren = (list:any)=>{
  if(list.length){
    let arr:any = []
    list.forEach((el:any) => {
      arr.push(
          {
            label:el.label,
            children:getChildren(el.children),
          }
      )
    });
    return arr;
  }else{
    return []
  }
}
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
  treeRef.value!.filter(val)
})
const instance = getCurrentInstance();
const clickBus = (e:any)=>{
  console.log('aaa',e.target.dataset.index)
  instance?.proxy?.$Bus.emit('clickBus', e.target.dataset.index)
}
const storeBus = (type:number,e:any)=>{
  instance?.proxy?.$Bus.emit('storeBus', (type+'_'+e.target.dataset.index))
}
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.includes(value)
}
const getNodes = (checkedNodes:any) =>{
  console.log(checkedNodes)
}
const loadThingMenus = async (prefix: string, isWork: boolean = false) => {
  const root = await userCtrl.space.loadSpeciesTree();
  console.log('thingCtrl',thingCtrl)
  // const aaa = await thingCtrl.queryOperationBySpeciesIds();
  var thing = root?.children?.find((item) => item.name == '事');
  if (thing) {
    return await buildSpeciesTree(thing.children, prefix + '事', isWork);
  }
  return [];
};
/** 编译分类树 */
const buildSpeciesTree = async (
  species: any,
  itemType: string,
  isWork: boolean,
): Promise<MenuItemType[]> => {
  var result: MenuItemType[] = [];
  for (let item of species) {
    result.push({
      key: itemType + item.id,
      item: item,
      label: item.name,
      icon: 'icon',
      itemType: itemType,
      menuType: isWork ? 'checkbox' : undefined,
      menus: [],
      children: await buildSpeciesTree(item.children, itemType, isWork),
    });
  }
  return result;
};
// 路由跳转
const jump = (val:any)=>{
  if(val?.data?.isStoreMenu){ //仓库分类事件
    instance?.proxy?.$Bus.emit('storeMenu', val.data.items)
  }else if(val?.data?.shopLink){ //商店分类跳转事件
    instance?.proxy?.$Bus.emit('shopLink', val.data)
  } else{ //普通url跳转
    if(val.url){
      router.push(val.url)
    }
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
<style lang="scss">
.menu-side{
  width: 100%;
  min-width: 197px;
  .el-menu{
    border: 0;
  }
  .el-sub-menu__title{
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item{
    height: 45px;
    line-height: 45px;
  }
}
  .el-tabs__header{
    margin-bottom: 0 !important;
  }
  /*去掉tabs底部的下划线*/
  .el-tabs__nav-wrap::after {
    position: static !important;
  }
</style>
<style lang="scss" scoped>
  *{font-family: '微软雅黑';}
  .tree-wrap{
    height: calc(500px);
    overflow-y: auto;
  }
  .todo-tabs{
    display: flex;
    justify-content: center;
    width: 100%;
    border-bottom: 1px solid #eee;
    .el-tabs__nav-scroll{
      display: flex;
    justify-content: center;  
    }
    :deep(.el-tabs__item){
      height: 44px;
    }
  }
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
    span{
      display: flex;
      align-items: center;
    }
    .blue-tips{
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      margin-left: 5px;
      color: #fff;
      background: #214dd0;
    }
    .sp_10{
      position: absolute;
      right: 8px;
    }
  }
  :deep(.el-sub-menu__icon-arrow){
    display: none;
  }
  // :deep .no-penultimate > .el-tree-node__content{
    // font-weight: 800;
  // }
  :deep(.is-penultimate > .el-tree-node__content) {
    font-size: 10px;
    color: #909399;
  }
  :deep(.el-tree-node__content){
    height: 40px;
  }
  // 去掉el-input自带边框
  :deep(.el-input__wrapper) {
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