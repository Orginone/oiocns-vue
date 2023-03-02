<template>
  <div class="pages">
    <div class="menu-side" style="height: 100%; background: #fff">
      <div class="title">
        <b style="font-size: 14px;">办事</b>
      </div>
      <el-tabs v-model="state.tabActive" class="todo-tabs" @tab-click="tabsClick">
        <el-tab-pane label="待办" name="1"> </el-tab-pane>
        <el-tab-pane label="发起业务" name="2"> </el-tab-pane>
      </el-tabs>
      <el-menu v-bind="$attrs" :default-openeds="state.openeds"  v-if="state.tabActive=='1'" @select="handleSelect">
          <el-menu-item
          v-for="(item, index) in state.menuData"
            :key="item.uid"
            :index="String(item.uid)"
            @mouseover='onOver(item.type)' @mouseout="onOut"
            @click="jump(item)"
          >
               <span style="font-size: 14px;" :style="{color: state.flag1 === item.type ? '#000' : '#a5a8ba' }" >{{ item.name }} 
            </span>
          </el-menu-item>
      </el-menu>
      <el-input v-model="filterText" placeholder="搜索" v-if="state.query" class="w-50 m-2" :prefix-icon="Search" />
      <div class="tree-wrap" v-if="state.tabActive =='2'">
        <el-tree 
          show-checkbox
          :props="thingProps"
          @check="getNodes"
          :data="state.thingList"
        />
      </div>
    </div>
    <div class="trends">
      <component :is="state.componentName" :checkedKeys="state.ids" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive ,nextTick ,getCurrentInstance, onMounted} from 'vue'
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue'
import { setCenterStore } from '@/store/setting'
import {docsCtrl,userCtrl,thingCtrl,INullSpeciesItem} from '@/ts/coreIndex';
import todoJson from './json/todo.json';

import  friendPage from '@/views/todo/friendApply/index.vue'
import  companyPage from '@/views/todo/company/index.vue'
import  groupPage from '@/views/todo/group/index.vue'
import  orderPage from '@/views/todo/order/index.vue'
import  shopPage from '@/views/todo/shop/index.vue'
import  productPage from '@/views/todo/product/index.vue'
import  thingPage from '@/views/todo/thing/index.vue'

// instance?.proxy?.$Bus.on('clickBus', (num) => {
//   if(num === '301') {
//     console.log('发起业务')
//   }else if(num === '302') {
//     console.log('重命名')
//   }else if(num === '303') {
//     console.log('删除应用')
//   }
// })
let router = useRouter()

const filterText = ref('')
const treeRef = ref()
const state = reactive({
  menuData: [],
  openeds: ['1', '2'],
  treeData: [],
  query: false, // 是否显示搜索框
  flag: '', // 是否高亮标记
  flag1: '',// 是否高亮标记
  tabActive:'1',
  thingList:[], //实际显示的应用列表
  menuData:[],//导航数据
  current:[],
  tableHead: [],
  navData:[],
  ids:[],//办事选中的id
  componentName:friendPage,
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
  init();
  todoJson[1].children.forEach((element:any,index:any) => {
    // element?.num = index
  });
  state.menuData = todoJson[1].children
    setTimeout(async () => {
    let res = await loadThingMenus('work', true);
    let arr: any[] =[]
    res.forEach(element => {
      console.log('element',element)
      arr.push(
        {
          label:element?.label,
          children:getChildren(element?.children),
        }
      )
    });
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
}
const instance = getCurrentInstance();

const getNodes = (checkedNodes:any,checkedKeys:any) =>{
  let ids:any = []
  console.log('checkedKeys',checkedKeys)
  checkedKeys.checkedNodes.forEach((element:any) => {
    ids.push(element.item.id)
  });  
  if(ids.length){
    state.ids = ids;
    state.componentName = thingPage;
  }else{
    state.componentName = ''
  }
 
}

const loadThingMenus = async (prefix: string, isWork: boolean = false) => {
  const root = await userCtrl.space.loadSpeciesTree();
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
  console.log('val',val.id)
  if(val.id =='friendPage'){
    state.componentName = friendPage;
  }else if (val.id =='companyPage'){
    state.componentName = companyPage;
  }else if (val.id =='groupPage'){
    state.componentName = groupPage;
  }else if (val.id =='orderPage'){
    state.componentName = orderPage;
  }else if (val.id =='shopPage'){
    state.componentName = shopPage;
  } else if(val.id ='productPage'){
    state.componentName = productPage;
  } 
}
// 树点击事件
const nodeClick = (val: any) => {
  setCenterStore().currentSelectItme = val
}
const handleSelect = (key: any) => {
  console.log(key,'key')
  instance?.proxy?.$Bus.emit('selectBtn', key)
}
</script>
<style lang="scss">
.pages{
  display: flex;
  flex: 1;
  width: 100%;
}
.trends{
  width: calc(100% - 200px);
}
.menu-side{
  width: 197px;
  margin-right: 3px;
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
