<template>
  <div class="main">
    <div class="nav-list">

    </div>
    <div class="content">
      <div class="menu"></div>
      <opened></opened>
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
          <template #slot-tabs>
            <div class="table-tabs">
              <el-menu
                :default-active="tableActiveIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
              >
                <el-menu-item index="1">全部</el-menu-item>
                <el-menu-item index="2">创建的</el-menu-item>
                <el-menu-item index="3">购买的</el-menu-item>
                <el-menu-item index="4">共享的</el-menu-item>
                <el-menu-item index="5">分配的</el-menu-item>
              </el-menu>
            </div>
          </template>
          <template #buttons>
            <el-button class="btn-check" type="primary" link>按钮</el-button>
            <el-button class="btn-check" type="primary" link>按钮</el-button>
            <el-button class="btn-check" type="primary" link>按钮</el-button>
          </template>
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                ···
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="showDiong">查看</el-dropdown-item>
                  <el-dropdown-item @click="showDiong">测试</el-dropdown-item>
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
  import opened from './components/opened.vue'
  import card from './components/card.vue'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  const dialogVisible = ref<boolean>(true)
  const diyTable = ref(null)
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
  const handleClick = (key?:any) => {
    console.log(key)
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

  const tableHead = ref([{
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
  const showDiong = () => {
    
  }
  const commontActive = ()=>{

  }
  
</script>
<style lang="scss">
  .drop-link{
    cursor: pointer;
    padding: 2px 10px;
    border-radius: 10px;
  }
  .drop-link:hover{
    background: var(--el-bg-color-overlay);
  }
</style>
<style lang="scss" scoped>
  .main{
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    .nav-list{
      width: 150px;
      height: 100%;
      border-right: 1px solid #EBEEF5;
    }
    .content{
      width:calc(100vw - 150px);
      display: flex;
      flex-direction: column;
      background: #f0f4f8;
      .menu{
        height: 40px;
        width: 100%;
        background: #aab;
        margin-bottom: 6px;
      }
      .detail{
        background: #fff;
        margin-bottom: 6px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        max-height: 200px;
        padding: 16px;
        .detail-title{
          font-size: 14px;
          color: #303133;
          margin-bottom: 10px;
        }
        .detail-list{
          display: flex;
          flex-wrap: nowrap;
          height: 102px;
          flex: 1;
        }
        .list-item{
          width: 187px;
          min-width: 187px;
          height: 102px;
          display: flex;
          flex-wrap: nowrap;
          border: 1px solid #eee;
          border-radius: 10px;
          box-sizing: border-box;
          padding: 18px 12px;
          margin-right: 10px;
          .row{
            img{
              width: 52px;
              height: 52px;
              border-radius: 10px;
            }
            .version{
              font-size: 12px;
              color: #606266;
              margin-top: 5px;
            }
            .title{
              color: #303133;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              span:nth-child(2n){
                display: flex;
                align-items: center;
              }
            }
            .describe{
              color:#606266;
              font-size: 12px;
              -webkit-line-clamp: 2;
              margin-top: 3px;

              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .row-left{
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 10px;

          }
        }
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
  .foot {
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: flex-end;
  }
  .remark-text{
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tooltip-text{
    width: 400px;
    max-height: 300px;
    overflow-y: auto;
  }
  .tabs-btn{
    display: flex;
  }
</style>
