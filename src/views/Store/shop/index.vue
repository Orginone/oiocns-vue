<template>
  <div class="main">
    <div class="nav-list">
      <div class="nav-title">全部分类</div>
      <el-select v-model="valuee" placeholder="Select">
        <el-option-group
          v-for="group in optionsList"
          :key="group.label"
          :label="group.label"
        >
          <el-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-option-group>
      </el-select>
    </div>
    <div class="content">
      <div class="table">
        <diytab
          :style="{width:'100%'}"
          ref="diyTable"
          :hasTabs="true"
          :tableName="'测试表格名称'"
          :hasTitle="true"
          :hasTableHead="true"
          :tableData="tableData"
          :options="options"
          @handleUpdate="handleUpdate"
          @selectionChange="selectionChange"
          :tableHead="tableHead"
        >
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                ···
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="showDiong">打开</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">详情</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">管理</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">上架</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">共享</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">分配</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">暂存</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #slot-card>
            <card></card>
          </template>
        </diytab>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
  import diytab from '@/components/diyTable/index.vue'
  import card from '../components/card.vue'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  const dialogVisible = ref<boolean>(true)
  const diyTable = ref(null)
  const valuee = ref<any>('');
  const optionsList = [
    {
      label: '功能分类',
      options: [
        {
          value: 'caiwu',
          label: '财务',
        },
        {
          value: 'zichan',
          label: '资产',
        },
      ],
    },
  ]
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const tableData = ref([{
    paymentType:'线上',
    price:'100',
    status:'200',
    createTime:'2022-11-01 16:01',
  }])
  const activeName = ref<string>(); //table tab index
  const tableActiveIndex = ref<string>(); //table nav index
  const handleSelect = () => {
    console.log('index')
  }

  interface ListItem {
    code: string
    name: string
    trueName: string
    teamCode: string
    remark: string
  }

  onMounted(() => {
    remoteMethod()
  })
  const remoteMethod = () => {
  }

  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    remoteMethod()
  }
  const checkList = reactive<any>([])
  const selectionChange = (val: any) => {
    checkList.value = val
  }


  const tableHead = ref([
    {
      prop: 'paymentType',
      label: '付款方式',
    },
    {
      prop: 'price',
      label: '价格',
      name: 'price'
    },
    {
      prop: 'status',
      label: '状态',
      name: 'status'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      name: 'createTime'
    },
    {
      type: 'slot',
      label: '操作',
      fixed: 'right',
      align: 'center',
      width: '150',
      name: 'operate'
    }
  ])
  const options = ref<any>({
    checkBox: false,
    order: true,
    selectLimit: 1,
    defaultSort: { prop: 'createTime', order: 'descending' },
    treeProps: {
      children: 'children',
      hasChildren: 'hasChildren'
    }
  })
  const showDiong = (type:number) => {
    if(type ==1){

    }else if(type ==2){
      
    }
  }
  
</script>
<style lang="scss">
  .el-dropdown-link{
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;
  }
  .el-dropdown-link:hover{
    background:#1642cb;
    color: #fff;
  }
</style>
<style lang="scss" scoped>
  .main{
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    color: #303133;
    .nav-list{
      width: 240px;
      height: 100%;
      background: #fff;
      border-right: 1px solid #EBEEF5;
      margin-right: 3px;
      box-sizing: border-box;
      padding: 10px 15px;
      font-size: 14px;
      font-weight: bold;
      .nav-title{
        margin-bottom: 10px;
      }
    }
    .content{
      width:calc(100%);
      display: flex;
      flex-direction: column;
      background: #f0f4f8;
      .menu{
        height: 40px;
        width: 100%;
        background: #aab;
        margin-bottom: 6px;
      }
      .table{
        background: #fff;
        display: flex;
        flex: 1;
        .btn-check{
          padding: 8px 16px;
          color: #154ad8;
        }
        .btn-check:hover{
            background: #154ad8;
            color: #fff;
            padding: 8px  16px;
        }
        .table-tabs{
          width: 500px;
          .el-menu--horizontal{
            border: 0;
          }
          .el-menu-item{
            padding: 0;
            margin-right: 16px;
            margin-bottom: 3px;
            border: 0 !important;
          }
          .is-active{
            background: #fff;
          }
          .is-active::after{
            content:'';
            position: absolute;
            left: 0;
            margin-left: calc(50% - 9px);
            bottom: 25%;
            width:18px;
            border-radius: 5px;
            height: 2px;
            background: #154ad8;
          }
          .el-menu--horizontal:hover, .el-menu-item:hover{
            background: #fff;
          }
        }
      }
    }
  }
</style>
