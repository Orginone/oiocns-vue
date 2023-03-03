<template>
  <div class="thing-box">
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
        <DxDataGrid
          :data-source="dataSource"
          :remote-operations="false"
          :allow-column-reordering="true"
          :row-alternation-enabled="true"
          :show-borders="true"
          @content-ready="onContentReady"
        >
          <DxColumn
            :group-index="0"
            data-field="Product"
          />
          <DxColumn
            :allow-grouping="false"
            data-field="Discount"
            caption="Discount %"
            data-type="number"
            format="percent"
            alignment="right"
            cell-template="discountCellTemplate"
            css-class="bullet"
          />
          <DxColumn
            data-field="SaleDate"
            data-type="date"
          />
          <DxColumn
            data-field="Region"
            data-type="string"
          />
          <DxColumn
            data-field="Sector"
            data-type="string"
          />
          <DxColumn
            data-field="Channel"
            data-type="string"
          />
          <DxColumn
            :width="150"
            data-field="Customer"
            data-type="string"
          />
          <DxGrouping :auto-expand-all="false"/>
          <DxPager
            :allowed-page-sizes="pageSizes"
            :show-page-size-selector="true"
          />
          <DxPaging :page-size="10"/>
          <template #discountCellTemplate="{ data: cellData }">
            <DiscountCell :cell-data="cellData"/>
          </template>
        </DxDataGrid>
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
        store: {
          type: 'odata',
          url: 'https://js.devexpress.com/Demos/SalesViewer/odata/DaySaleDtoes',
          key: 'Id',
          beforeSend(request) {
            request.params.startDate = '2020-05-10';
            request.params.endDate = '2020-05-15';
          },
        },
      })
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
      // console.log(fromDetail)
      state.fromDetail.items.forEach(element => {
        console.log(JSON.parse(element.rule))
      });
    }
    let data = {
      id: species.id,
      spaceId: userCtrl.space.id,
      recursionOrg: true,
      recursionSpecies: false,
      page: {
        offset: 0,
        limit: 10000,
        filter: '',
      },
    }
    const res = await todo.queryOperationBySpeciesIds(ids,userCtrl.space.id);
      console.log('res',res)

    
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

