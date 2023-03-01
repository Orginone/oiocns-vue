<template>
  <div class="thing-box">
    <div class="menu-side" style="height: 100%; background: #fff">
      <div class="tree-wrap">
        <el-tree 
          show-checkbox
          :props="thingProps"
          @check="getNodes"
          :data="state.thingList"
        />
      </div>
    </div>
    <div class="content-main">
      <div class="main">
        <el-form class="main-form" :model="state.form" label-width="120px">
          <el-form-item class="form-item" :label="item.name" v-for="(item,index) in state.fromDetail?.items" :key="index">
            <div class="form-flex">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <el-icon style="margin-left: 10px; font-size: default; color: #b0b0b1"><QuestionFilled /></el-icon>
              </el-tooltip>
              <el-input width="300" v-model="state.form[item.name]" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive ,nextTick ,getCurrentInstance, onMounted} from 'vue'
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue'
import { setCenterStore } from '@/store/setting'
import {docsCtrl,userCtrl,thingCtrl,todoCtrl as todo ,INullSpeciesItem} from '@/ts/coreIndex';
import { ElMessage } from 'element-plus'

let router = useRouter()

// const emit = defineEmits(['handleSelect'])
const props = defineProps({
  data: {
    type: Array,
  },
})
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
const filterText = ref('')
const treeRef = ref()
const state = reactive({
  menuData: [],
  openeds: ['1', '2'],
  treeData: [],
  query: false, // 是否显示搜索框
  flag: '', // 是否高亮标记
  flag1: '',// 是否高亮标记
  tabActive:'2',
  thingList:[], //实际显示的应用列表
  current:[],
  tableHead: [],
  navData:[],
  fromDetail:{
    items:[]
  },
  form:{
    text:''
  }
})

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
  setTimeout(async () => {
    let res = await loadThingMenus('work', true);
    console.log('ress',res);
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
const getNodes = async (checkedNodes:any,checkedKeys:any) =>{

  let ids:any = []
  checkedKeys.checkedNodes.forEach((element:any) => {
    ids.push(element.item.id)
  });  
  if(ids.length){
    const fromDetail = await todo.queryOperationBySpeciesIds(ids,userCtrl.space.id);
    if(!fromDetail.data.result){
      ElMessage({
        message: '暂无数据',
        type: 'warning'
      })
    }else{
      state.fromDetail = fromDetail.data.result[0];
      // console.log(fromDetail)
      state.fromDetail.items.forEach(element => {
        console.log(JSON.parse(element.rule))
      });
    }
  }

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
  width: 197px;
  height: 100%;
  margin-right: 3px;
  padding-top: 10px;
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
  .thing-box{
    display: flex;
    width: 100%;
    height: 100%;
    .content-main{
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .main{
      background: #fff;
      padding-top: 20px;
    }
  }
  .main-form{
    display: flex;
    flex-wrap: wrap;
  }
  .form-item{
    width: 47%;
    display: flex;
    justify-content: center;
    .el-form-item__content{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-form-item__label{
      padding-right: 5px !important;
    }
    i{
      margin-left: 0 !important;
      margin-right:10px;
    }
    .form-flex{
      display: flex;
      align-items: center;
    }
  }
  .main-table{
    padding: 20px;
    background: #fff;
  }
</style>

