<template>
  <MarketCard>
    <template #right>
      <el-select
        v-model="statusvalue"
        filterable
        placeholder="订单状态"
        clearable
        @change="getTableList(searchType)"
        style="margin: 5px 5px 5px 15px"
      >
        <el-option
          v-for="item in statusoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </template>
  </MarketCard>
  <div class="container">
    <div class="limit_table_height">
      <!-- 采购订单 -->
      <DiyTable
        v-if="route.fullPath.includes('buy')"
        ref="diyTable"
        :tableData="state.orderMessage.list"
        :tableHead="state.tableHeadBuy"
        :total="state.orderMessage.total"
        @handleUpdate="handleUpdate"
      >
        <template #expand="props">
          <div style="margin-left: 50px">
            <DiyTable
              ref="diyTableDetail"
              :tableData="props.row.details"
              :tableHead="state.tableHeadBuyDetail"
              :options="{ noPage: true }"
            >
              <template #merchandiseStatus="scope">
                <el-tag v-show="scope.row.merchandise">在售</el-tag>
                <el-tag class="ml-2" type="danger" v-show="!scope.row.merchandise">已下架</el-tag>
              </template>

              <template #operate="scope">
                <el-button link type="primary" @click="showPayList(scope.row)">支付记录</el-button>
                <el-button
                  link
                  small
                  type="danger"
                  class="btn"
                  v-show="scope.row.status < 102"
                  @click="cancelOrder('buy', scope.row.id)"
                >
                  取消订单
                </el-button>
                <el-button
                  link
                  small
                  type="primary"
                  class="btn"
                  v-show="scope.row.status == 102"
                  @click="reject(scope.row.id)"
                >
                  退货退款
                </el-button>
              </template>
            </DiyTable>
          </div>
        </template>
        <template #operate="scope">
          <el-button
            link
            small
            type="danger"
            class="btn"
            @click="cancelOrder('main', scope.row.id)"
          >
            取消订单
          </el-button>
        </template>
      </DiyTable>
      <!--售卖订单 -->
      <DiyTable
        v-else
        ref="diyTable"
        :hasTitle="true"
        :tableData="state.orderMessage.list"
        :tableHead="state.tableHeadSell"
        :total="state.orderMessage.total"
        @handleUpdate="searchSellList"
      >
        <template #merchandiseStatus="scope">
          <el-tag v-show="scope.row.merchandise">在售</el-tag>
          <el-tag class="ml-2" type="danger" v-show="!scope.row.merchandise">已下架</el-tag>
        </template>

        <template #operate="scope">
          <el-space>
            <el-button link type="success" @click="showPayList(scope.row)">支付记录</el-button>

            <el-button
              link
              small
              type="primary"
              v-show="scope.row.status < 102 && scope.row.merchandise"
              @click="delivery(scope.row.id)"
            >
              确认交付
            </el-button>
            <el-button
              link
              small
              type="danger"
              v-show="scope.row.status < 102"
              @click="cancelOrder('sell', scope.row.id)"
            >
              取消订单
            </el-button>
          </el-space>
        </template>
      </DiyTable>
      <payView v-if="payDialog.show" :order="payDialog.data" @close="closePay"></payView>
      <payList v-if="payListDialog.show" :selectLimit="0" @closeDialog="closePayList" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import renderDict from '@/services/dict'
  import payView from '@/components/pay/pay.vue'
  import payList from '@/components/pay/list.vue'
  import DiyButton from '@/components/diyButton/index.vue'
  import { ElTable } from 'element-plus'
  import { chat } from '@/module/chat/orgchat'
  import moment from 'moment'
  import { useRoute, useRouter } from 'vue-router'
  import type { ListProps } from '@/module/store/order'
  import OrderSevice from '@/module/store/order'
  import type { OrderListType, CancelType } from './order'

  const router = useRouter()
  const route = useRoute()
  // 表格分页数据
  // const pagination: { current: number; limit: number } = reactive({ current: 1, limit: PAGE_NUM })
  // 表格展示数据
  const pageStore = reactive({
    tableData: [],
    total: 0
  })
  const searchType = ref<OrderListType>('buy')
  const payDialog = reactive({ show: false, data: {} })
  const payListDialog = reactive({ show: false, data: {} })

  const orderTableRef = ref<InstanceType<typeof ElTable>>()
  //点击行触发，选中或不选中复选框
  const handleRowClick = (row: any) => {
    orderTableRef.value!.toggleRowSelection(row, undefined)
  }
  const statusvalue = ref('')
  const statusoptions = [
    { label: '待交付', value: 1 },
    //包含第三方监管和卖方的审核状态
    { label: '已发货', value: 102 },
    //后续可能有物流状态接入
    { label: '买方取消订单', value: 220 },
    { label: '卖方取消订单', value: 221 },
    { label: '已退货', value: 222 }
  ]
  // 会话列表搜索关键字
  const searchValue = ref<string>('')

  onMounted(() => {
    if (route.fullPath.includes('buy')) {
      getTableList('buy')
    } else {
      getTableList('sell')
    }
  })
  interface ListItem {
    value: string
    label: string
  }
  const options = ref<ListItem[]>([])
  const value = ref('')
  const loading = ref(false)
  const handleUpdate = (page: any) => {
    getTableList(searchType.value)
  }
  const state = reactive({
    qunList: [],
    orderMessage: {
      list: [],
      total: 0,
      pageSize: 20,
      current: 0
    },
    orderList: [],
    tableHeadBuy: [
      {
        type: 'expand',
        name: 'expand'
      },
      {
        prop: 'code',
        label: '订单号'
      },
      {
        prop: 'name',
        label: '应用名称'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        formatter: (row: any, column: any) => moment(row.createTime).format('YYYY/MM/DD HH:mm:ss')
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        width: '320',
        name: 'operate'
      }
    ],
    tableHeadBuyDetail: [
      {
        prop: 'caption',
        label: '应用名称',
        minWidth: '220'
      },
      {
        prop: 'sellAuth',
        label: '售卖权属'
      },
      {
        prop: 'days',
        label: '使用期限',
        width: '120',
        formatter: (row: any, column: any) => {
          return row.days || '永久'
        }
      },
      {
        prop: 'price',
        label: '价格'
      },
      {
        prop: 'marketId',
        label: '市场名称',
        formatter: (row: any, column: any) => {
          return row.marketId ? chat.getName(row.marketId) : null
        }
      },
      {
        prop: 'sellerId',
        label: '卖方名称',
        formatter: (row: any, column: any) => {
          return row.sellerId ? chat.getName(row.sellerId) : null
        }
      },
      {
        prop: 'status',
        label: '状态',
        formatter: (row: any, column: any) => renderDict(row, column, 'OrderStatus')
      },
      {
        prop: 'createTime',
        label: '创建时间',
        minWidth: '100',
        formatter: (row: any, column: any) => moment(row.createTime).format('YYYY/MM/DD HH:mm:ss')
      },

      {
        type: 'slot',
        label: '商品状态',
        fixed: 'right',
        align: 'center',
        width: '150',
        name: 'merchandiseStatus'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        minWidth: '220',
        name: 'operate'
      }
    ],
    tableHeadSell: [
      {
        prop: 'code',
        label: '订单号',
        minWidth: '120'
      },
      {
        prop: 'caption',
        label: '名称',
        minWidth: '120'
      },
      {
        prop: 'marketId',
        label: '市场名称',
        minWidth: '120',
        formatter: (row: any, column: any) => {
          return row.marketId ? chat.getName(row.marketId) : '-'
        }
      },
      {
        prop: 'belongId',
        label: '买方名称',
        minWidth: '120',
        formatter: (row: any, column: any) => chat.getName(row.belongId)
      },
      {
        prop: 'sellAuth',
        label: '售卖权属',
        width: '100'
      },
      {
        prop: 'days',
        label: '使用期限',
        width: '120',
        formatter: (row: any, column: any) => {
          return row.days || '永久'
        }
      },
      {
        prop: 'price',
        label: '价格',
        width: '120'
      },
      {
        prop: 'status',
        label: '状态',
        width: '120',
        formatter: (row: any, column: any) => renderDict(row, column, 'OrderStatus')
      },
      {
        prop: 'createTime',
        label: '创建时间',
        width: '160',
        formatter: (row: any, column: any) => moment(row.createTime).format('YYYY/MM/DD HH:mm:ss')
      },

      {
        type: 'slot',
        label: '商品状态',
        fixed: 'right',
        width: '100',
        name: 'merchandiseStatus'
      },
      {
        type: 'slot',
        label: '操作',
        fixed: 'right',
        align: 'left',
        minWidth: '200',
        name: 'operate'
      }
    ]
  })
  //查询
  const getTableList = async (type: OrderListType) => {
    searchType.value = type
    switch (type) {
      // case 'all':
      //   searchAllOrderList()
      //   break
      case 'buy':
        searchBuyList({ current: 0, pageSize: 20 })
        break
      case 'sell':
        searchSellList({ current: 0, pageSize: 20 })
        break
      // case 'pre-sell':
      //   searchPreSellList()
      //   break
    }
  }
  // //查询所有订单
  // const searchAllOrderList = async () => { }

  // //查询出售 待审批/确认交易内容的订单
  // const searchPreSellList = async () => {
  //   await $services.order
  //     .searchSellList({
  //       data: {
  //         offset: (pagination.current - 1) * pagination.limit,
  //         limit: pagination.limit,
  //         status: 1,
  //         filter: ''
  //       }
  //     })
  //     .then((res: ResultType) => {
  //       const { result = [], total = 0 } = res.data
  //       pageStore.total = total
  //       state.orderList = result?.map((item: { market: { remark: any; code: any; name: any } }) => {
  //         return {
  //           ...item,
  //           // remark: item.market.remark,
  //           // marketCode: item.market.code,
  //           // marketName: item.market.name
  //         }
  //       })
  //     })
  // }
  //查询已出售订单
  const searchSellList = async (params: ListProps) => {
    state.orderList = []
    const { data, total } = await OrderSevice.getSellList({
      ...params,
      filter: '',
      status: statusvalue.value ? statusvalue.value : 0 //后续改成-1
    })
    state.orderMessage.total = total
    state.orderMessage.list = data
  }
  //查询已购入订单
  const searchBuyList = async (params: ListProps) => {
    // state.orderMessage.list = [];
    const { data, total } = await OrderSevice.geBuyList({
      ...params,
      filter: '',
      status: statusvalue.value ? statusvalue.value : 0 //后续改成-1
    })
    state.orderMessage.total = total
    state.orderMessage.list = data
  }
  //确认开始交易
  const sureContent = async (id: string) => {
    await $services.order
      .updateDetail({
        data: {
          id: id,
          status: 100
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          getTableList(searchType.value)
          ElMessage({
            message: '确认开始交易',
            type: 'success'
          })
        }
      })
  }
  //查询支付列表
  const showPayList = async (data: any) => {
    payListDialog.data = data
    payListDialog.show = true
  }
  //支付
  const showPay = async (data: any) => {
    payDialog.data = data
    payDialog.show = true
  }
  //关闭支付
  const closePay = async () => {
    payDialog.show = false
  }
  //关闭支付记录列表
  const closePayList = async () => {
    payListDialog.show = false
  }

  // const pay = async (id: string, price: number, paymentType: string) => {
  //   await $services.order
  //     .createPay({
  //       data: {
  //         orderId: parseInt(id),
  //         price: price,
  //         paymentType: paymentType
  //       }
  //     })
  //     .then((res: ResultType) => {res.code == 200
  //       if (res.code == 200) {
  //         getTableList(searchType.value)
  //         ElMessage({
  //           message: '支付成功',
  //           type: 'warning'
  //         })
  //       } else {
  //         ElMessage({
  //           message: res.msg,
  //           type: 'warning'
  //         })
  //       }
  //     })
  // }
  //退货退款
  const reject = async (id: string) => {
    const { code } = await OrderSevice.rejectOrder({
      id: id,
      status: 222
    })

    if (code == 200) {
      getTableList(searchType.value)
      ElMessage({
        message: '退货成功',
        type: 'success'
      })
    }
  }

  // 取消订单
  const cancelOrder = async (type: CancelType, id: string) => {
    ElMessageBox.prompt('请输入原因', '确认取消订单?', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(async ({ value }) => {
        const { code } = await OrderSevice.cancelOrder(type, {
          id: id,
          status: type === 'sell' ? 221 : 220
        })
        if (code == 200) {
          getTableList(searchType.value)
          ElMessage({
            message: '取消订单成功',
            type: 'success'
          })
        }
      })
      .catch(() => {})
  }

  // //买方取消订单详情
  // const cancelBuy = async (id: string) => {
  //   ElMessageBox.prompt('请输入原因', '确认取消订单?', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消'
  //   })
  //     .then(({ value }) => {
  //       $services.order
  //         .cancelBuy({
  //           data: {
  //             id: id,
  //             status: 220
  //           }
  //         })
  //         .then((res: ResultType) => {
  //           if (res.code == 200) {
  //             getTableList(searchType.value)
  //             ElMessage({
  //               message: '取消订单成功',
  //               type: 'success'
  //             })
  //           }
  //         })
  //     })
  //     .catch(() => {})
  // }

  // //卖方取消订单详情
  // const cancelSell = async (id: string) => {
  //   ElMessageBox.prompt('请输入原因', '确认取消订单?', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消'
  //   })
  //     .then(({ value }) => {
  //       $services.order
  //         .cancelSell({
  //           data: {
  //             id: id,
  //             status: 221
  //           }
  //         })
  //         .then((res: ResultType) => {
  //           if (res.code == 200) {
  //             getTableList(searchType.value)
  //             ElMessage({
  //               message: '取消订单成功',
  //               type: 'success'
  //             })
  //           }
  //         })
  //     })
  //     .catch(() => {})
  // }

  // //取消订单详情  由删除更改为中止
  // const cancelOrderDetail = async (id: string,status:number,reason:string) => {
  //   ElMessageBox.prompt('请输入原因', '确认取消订单?', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //   })
  //   .then(({ value }) => {
  //     $services.order
  //     .orderConfirm({
  //       data: {
  //         id: id,
  //         status: status
  //       }
  //     })
  //     .then((res: ResultType) => {
  //       if (res.code == 200) {
  //         getTableList(searchType.value)
  //         ElMessage({
  //           message: '取消订单成功',
  //           type: 'success'
  //         })
  //       }
  //     })
  //   })
  //   .catch(() => {})
  // }
  //确认交付
  const delivery = async (id: string) => {
    const { code } = await OrderSevice.deliverMerchandise({
      id: id,
      status: 102
    })
    if (code == 200) {
      getTableList(searchType.value)
      ElMessage({
        message: '交付成功',
        type: 'success'
      })
    }
  }
  //确认收货
  // const accept = async (id: string) => {
  //   await $services.order
  //     .updateDetail({
  //       data: {
  //         id: id,
  //         status: 103
  //       }
  //     })
  //     .then((res: ResultType) => {
  //       if (res.code == 200) {
  //         getTableList(searchType.value)
  //         ElMessage({
  //           message: '确认收货成功',
  //           type: 'success'
  //         })
  //       }
  //     })
  // }
  //评论
  // const comment = (id: string) => {
  //   ElMessage({
  //     message: '评论成功',
  //     type: 'success'
  //   })
  // }
  //查看评价
  // const viewComment = (id: string) => {
  //   ElMessage({
  //     message: '该功能暂未开放',
  //     type: 'warning'
  //   })
  // }
  // 处理表格分页操作
  // const handlePaginationChange = (newVal: number, type: 'current' | 'limit') => {
  //   pagination[type] = newVal
  //   getTableList(searchType.value)
  // }
</script>
<style lang="scss" scoped>
  :deep(.cell) {
      display: flex;
    }
  .container {
    // width: 100%;
    height: 100vh;
    // background: var(--el-bg-color);
    display: flex;
    flex-direction: column;
    margin: 6px;
    border: 0;

    .limit_table_height {
      height: calc(100vh - 120px);
    }

    .tables {
      height: 50%;
    }

    .operate-btns {
      display: flex;
      justify-content: space-between;
      padding: 10px;

      // background: #fff;
      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .page-pagination {
      display: flex;
      justify-content: flex-end;
    }

    .group-side-bar-search {
      // padding: 10px;
      float: right;
      width: 220px;
      margin-right: 20px;
      margin-left: 20px;
      position: relative;
    }
  }

  .diy-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;

    &__header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 10px;

      .header-title {
        font-size: 16px;
        font-weight: bold;
        // color: #303133;
        padding: 0 0 10px;

        i {
          font-size: 20px;
          color: var(--el-color-primary);
        }
      }

      .header-tabs {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: -5px;
      }

      .header-buttons {
        display: flex;
      }
    }

    &__btn {
      display: flex;
      justify-content: space-between;
    }

    &__body {
      width: 100%;
      height: 100px; //避免el-table无限变高
      display: flex;
      flex: 1;
      margin-top: 10px;

      &-box {
        width: 1vw;
        flex: auto;
      }
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .footer-operate {
        width: 110px;
        height: 40px;
        border: 1px solid rgba(209, 223, 245, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .el-dropdown {
          width: 100%;
          height: 100%;
        }

        .el-dropdown-link {
          width: 100%;
          height: 100%;
          display: block;
          text-align: center;
          height: 38px;
          line-height: 38px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }

      .footer-buttons {
        width: 350px;
        display: flex;
        justify-content: space-between;

        .select-options {
          width: 150px;
        }
      }

      .footer-pagination {
        & :deep(.btn-prev) {
          border-radius: 16px;
        }

        & :deep(.el-pager > .number) {
          border-radius: 4px;
        }

        & :deep(.btn-next) {
          border-radius: 16px;
        }

        & :deep(.el-pagination__sizes .el-input__inner) {
          border-radius: 16px;
          // background: rgba(231, 239, 252, 1);
          border-color: transparent;
        }
      }
    }
  }

  .el-dropdown-menu {
    width: 110px;
  }

  .table-row-sty {
    height: calc(100vh - 12rem);
    padding: 6px;
  }

  .table-row-sty tr:hover,
  .table-row-sty tbody tr.el-table__row.not-read:hover {
    cursor: pointer;
    color: #2da1f8;
  }

  .el-icon-question {
  }

  .tableClass {
    background-color: #edf2fc;
    cursor: no-drop;
  }

  @media screen and (max-width: 1280px) {
    .diy-table__header {
      display: flex;
      display: none;
      flex-wrap: wrap;
    }
  }

  :deep(.el-table__header-wrapper .el-checkbox) {
    display: none;
  }
</style>
