<template>
    <div class="main">
      <div class="content">
        <div class="table">
          <diytab
            :style="{width:'100%'}"
            ref="diyTable"
            :hasTabs="true"
            :tableName="'采购订单'"
            :hasTitle="true"
            :hasTableHead="true"
            :tableData="tableData"
            :options="options"
            @handleUpdate="handleUpdate"
            @selectionChange="selectionChange"
            :tableHead="tableHead"
          >
          </diytab>
        </div>
      </div>
    </div>
    
  </template>
  
  <script setup lang="ts">
    import diytab from '@/components/diyTable/index.vue'
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
      switch:false,
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
      .content{
        width:calc(100vw - 150px);
        display: flex;
        flex-direction: column;
        background: #f0f4f8;
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
        }
      }
    }
  </style>
  