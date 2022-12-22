<template>
    <div class="main">
      <div class="content">
        <div class="table">
          <diytab
            :style="{width:'100%'}"
            ref="diyTable"
            :hasTabs="true"
            :tableName="'购物车'"
            :hasTitle="true"
            :hasTableHead="true"
            :tableData="pageStore.tableData"
            :options="options"
            @selectionChange="selectionChange"
            :tableHead="pageStore.tableHead"
          >
            <template #options="scope">
                <el-dropdown>
                <span class="el-dropdown-link">
                  ···
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="deleteStaging(scope.row)">删除</el-dropdown-item>
                    <el-dropdown-item @click="createOrderByStaging(scope.row)">购买</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </diytab>
        </div>
      </div>
    </div>
    
  </template>
  
  <script setup lang="ts">
    import diytab from '@/components/diyTable/index.vue'
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { PAGE_SIZES, PAGE_NUM } from '@/constant'
    import marketCtrl from '@/ts/controller/store/marketCtrl';

    const dialogVisible = ref<boolean>(true)
    const diyTable = ref(null)
    // 表格展示数据
    const pageStore = reactive({
      tableData: [],
      tableHead: [
        {
          prop: 'caption',
          label: '商品名称'
        },
        { prop: 'information', label: '商品信息' },
        { prop: 'sellAuth', label: '售卖权属' },
        { prop: 'days', label: '使用期限' },
        { prop: 'price', label: '售卖价格' },
        { prop: 'number', label: '数量' },
        { prop: 'marketName', label: '市场名称' },
        { prop: 'marketCode', label: '市场编号' },
        { prop: 'marketCode', label: '操作',type:'slot',name:'options' }
      ],
      total: 0
    })

    const state = reactive({
      page: {
        total: 0, // 总条数
        currentPage: 1, // 当前页
        pageSize: 20, // 每页条数
        pageSizes: [20, 30, 50], // 分页数量列表
        layout: 'total, prev, pager, next'
      },
      dialogShow: [
        {
          key: 'info',
          value: false
        }
      ]
    })
  
    onMounted(() => {
      pageStore.tableData = marketCtrl.shopinglist
      console.log('marketCtrl.shopinglist',marketCtrl.shopinglist)
      if(marketCtrl.shopinglist.length ==0){
        setTimeout(() => {
          pageStore.tableData = marketCtrl.shopinglist
        },2000);
      }
      console.log('marketCtrl',)

      // getTableList()
    })
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
  // 表格分页数据
  const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })

  //从购物车移除
  const deleteStaging = async (item: any) => {
    await marketCtrl.deleApply([item]);
    pageStore.tableData = marketCtrl.shopinglist
  }
  //创建订单(批量)
  const createOrderByStaging = async (item:Object) => {
    ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(async () => {
      await marketCtrl.buyShoping([item]);
      pageStore.tableData = marketCtrl.shopinglist
    }).catch(()=>{})
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
      border-top: 3px solid #f0f4f8;
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
  