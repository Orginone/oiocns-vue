<template>
  <div class="thing-box">
    <div class="content-main">
      <div class="main">
        <div class="from-title">资产配置</div>
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
        <diyDxTable :tableHead="tableHead"></diyDxTable>
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
import diyDxTable from '@/components/diyDxTable/index.vue';

import { ElMessage } from 'element-plus'
import {
  DxDataGrid,
  DxColumn,
  DxGrouping,
  DxGroupPanel,
  DxPager,
  DxPaging,
  DxSearchPanel,
} from 'devextreme-vue/data-grid';

import DataSource from 'devextreme/data/data_source';
import 'devextreme/data/odata/store';
let router = useRouter()
  const dataSource =  new DataSource({
    store: []
  })
  const tableHead = ref<any>([]);
  const getTabdata = async () => {
    const res = await todo.getTableAttrs(props.checkedKeys[0],userCtrl.space.id, true, true);
    console.log('aaaaaa',res.data.result)

    if (res.data.result) {
      tableHead.value = res.data.result
    }
  }  
  const pageSizes =  [10, 25, 50, 100];

  const onContentReady = (e:any) => {
    // if (!collapsed) {
    //   e.component.expandRow(['EnviroCare']);
    //   collapsed = true;
    // }
  }
// const emit = defineEmits(['handleSelect'])
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


onMounted(()=>{
  // init();
})
const props = defineProps<{
  checkedKeys: any; 
}>()

watch(() => props.checkedKeys, (newValue:any) => {
  setTimeout(() => {
    getNodes()
  }, 1000);
},

{
  immediate: true
})
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const getNodes = async () =>{
  let ids:any = props.checkedKeys
  if(ids.length){
    const fromDetail = await todo.queryOperationBySpeciesIds(ids,userCtrl.space.id);
    if(!fromDetail.data.result){
      ElMessage({
        message: '暂无数据',
        type: 'warning'
      })
    }else{
      state.fromDetail = fromDetail.data.result[0];
    }
    // let data = {
    //   id: species.id,
    //   spaceId: userCtrl.space.id,
    //   recursionOrg: true,
    //   recursionSpecies: false,
    //   page: {
    //     offset: 0,
    //     limit: 10000,
    //     filter: '',
    //   },
    // }
    // const res = await todo.queryOperationBySpeciesIds(ids,userCtrl.space.id);

    getTabdata();
  }

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
      margin-left: 3px;
    }
    .main{
      background: #fff;
      margin-top: 3px;
      .from-title{
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        padding-left: 20px;
        border-bottom: 1px solid #eee;
      }
    }
  }
  .main-form{
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
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

