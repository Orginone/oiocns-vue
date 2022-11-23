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
            @handleUpdate="handleUpdate"
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
                    <el-dropdown-item @click="deleteStaging(scope.row.id)">删除</el-dropdown-item>
                    <el-dropdown-item @click="createOrderByStaging(scope.row.id)">购买</el-dropdown-item>
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
    import $services from '@/services'
    import diytab from '@/components/diyTable/index.vue'
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { PAGE_SIZES, PAGE_NUM } from '@/constant'

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
      getTableList()
    })
    const handleUpdate = (page: any) => {
      getTableList()

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
  // 表格分页数据
  const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
  //查询
  const getTableList = async () => {
    pageStore.tableData = []
    await $services.market
      .searchStaging({
        data: {
          id: 0, //市场id （需删除）
          offset: (pagination.current - 1) * pagination.limit,
          limit: pagination.limit,
          filter: ''
        }
      })
      .then((res: ResultType) => {
        console.log('aaaaa',res)
        var { result = [], total = 0 } = res.data
        pageStore.total = total
        result.forEach((item: any) => {
          item.ordertype = 'sell'
          item.checked = false
          return item
        })
        pageStore.tableData = result?.map(
          (item: {
            market: { remark: any; code: any; name: any }
            merchandise: { caption: any; information: any; sellAuth: any; days: any; price: any }
          }) => {
            if (!item.merchandise) { item.merchandise = { caption: null, information: null, sellAuth: null, days: null, price: null } }
            return {
              ...item,
              caption: item.merchandise.caption,
              information: item.merchandise.information,
              sellAuth: item.merchandise.sellAuth,
              days: item.merchandise.days,
              price: item.merchandise.price,
              marketName: item.market.name,
              marketCode: item.market.code
            }
          }
        )
        // isRouterAlive.value = true
      })
  }
  //从购物车移除
  const deleteStaging = async (id: string) => {
    console.log(id)
    await $services.market
      .deleteStaging({
        data: {
          id: id
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          getTableList()
          ElMessage({
            message: '移除成功',
            type: 'warning'
          })
        }
      })
  }
  //创建订单(批量)
  const createOrderByStaging = async (checkedId?: string) => {
    var checkedStagIds: any[] = []
    if (checkedId) {
      checkedStagIds = [checkedId]
    } else {
      checkedStagIds = pageStore.tableData.filter((item: any) => item.checked).map((item: any) => item.id)
    }
    console.log(checkedStagIds)
    var checkedStages = pageStore.tableData.filter((item: any) => checkedStagIds.includes(item.id))
    ElMessageBox.confirm('此操作将生成交易订单。是否确认?', '确认订单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      setTimeout(
        async (ids) => {
          await $services.market
            .createOrderByStaging({
              data: {
                code: new Date().getTime().toString().substring(0, 13),
                name:
                  checkedStages[0].merchandise.caption +
                  (checkedStages.length > 1 ? `...等${checkedStages.length}件商品` : ''),
                stagIds: checkedStagIds
              }
            })
            .then((res: ResultType) => {
              if (res.code == 200) {
                getTableList()
                ElMessage({
                  message: '创建订单成功',
                  type: 'success'
                })
              }
            })
        },
        1,
        checkedStagIds
      )
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
          .table-tabs{
            width: 500px;
          }
        }
      }
    }
  </style>
  