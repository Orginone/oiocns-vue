
<template>
  <div class="thing">
    <div class="content">
      <div>
        <el-menu
          :default-active="'1'"
          class="el-menu"
          style="height: 40px; padding-left: 20px; margin-bottom: 20px"
          mode="horizontal"
          @select="switchCheck"
        >
          <el-menu-item index="1">采购订单</el-menu-item>
          <el-menu-item index="2">售卖订单</el-menu-item>
        </el-menu>
      </div>
      <div class="btnStyle">
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
      </div>
       <div class="tab-list">
        <div class="container">
          <div class="limit_table_height">
            <!-- 采购订单 -->
            <DiyTable
              v-show="switchType ==1"
              ref="diyTable"
              :tableData="state.orderMessage.list"
              :tableHead="state.tableHeadBuy"
              :total="state.orderMessage.total"
              @handleUpdate="handleUpdate"
              :options="options"
            >
              <template #expand="props">
                <div style="margin-left: 50px">
                  <DiyTable
                    ref="diyTableDetail"
                    :tableData="props.row.details"
                    :tableHead="state.tableHeadBuyDetail"
                    :options="options"
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
              v-show ='(switchType ==2)'
              ref="diyTable"
              :hasTitle="true"
              :tableData="state.orderMessage.list"
              :tableHead="state.tableHeadSell"
              :total="state.orderMessage.total"
              @handleUpdate="searchSellList"
              :options="options"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import $services from '@/services'
  import { ref, onMounted, reactive, nextTick, getCurrentInstance } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/store/user'
  import { useRoute,useRouter } from 'vue-router'
  import DiyTable from '@/components/diyTable/index.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  import moment from 'moment'
  import { chat } from '@/module/chat/orgchat'
  import { ElTable } from 'element-plus'
  import OrderSevice from '@/module/store/order'
  import type { OrderListType, CancelType } from './order'
  import renderDict from '@/services/dict'
  import type { ListProps } from '@/module/store/order'
  import payView from './components/pay.vue'
  import payList from './components/list.vue'

  const pageStore = reactive({
    tableData: [],
    total: 0
  })
  const router = useRouter()
  const route = useRoute()
  const switchType = ref<number>(1);
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
    { label: '全部', value: '' },
    { label: '待交付', value: 1 },
    //包含第三方监管和卖方的审核状态
    { label: '已发货', value: 102 },
    //后续可能有物流状态接入
    { label: '买方取消订单', value: 220 },
    { label: '卖方取消订单', value: 221 },
    { label: '已退货', value: 222 }
  ]
  const switchCheck = (key:any)=>{
    switchType.value = key
    if (switchType.value ==1) {
      getTableList('buy')
    } else {
      getTableList('sell')
    }
  }

  onMounted(() => {
    if (switchType.value ==1) {
      getTableList('buy')
    } else {
      getTableList('sell')
    }
  })
  interface ListItem {
    value: string
    label: string
  }
  const options = {
    expandAll: false,
    checkBox: false,
    order: true,
    switchType:false,
    noPage: true,
    selectLimit: 0
  }
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
        minWidth: '150'
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
        minWidth: '200',
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
      case 'buy':
        searchBuyList({ current: 0, pageSize: 20 })
        break
      case 'sell':
        searchSellList({ current: 0, pageSize: 20 })
        break
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
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .thing {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-y: auto;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    .thing-menu{
      width: 200px;
      background: var(--el-bg-color-overlay);
      height: calc(100vh - 50px);
      overflow-y: auto;
      overflow-x: hidden;
      font-size: 14px;
      border-right: 1px solid #ddd;
      .thing-title{
        color: #8d8d8d;
        padding-left: 10px;
      }
      .thing-nav{
        border-radius: 3px;
        text-align: center;
      }
    }
  }
  // .thing-head {
  //   // padding: 30px;
  //   // background: #fff;
  //   .thing-type {
  //     font-size: 16px;
  //     color: #8d8d8d;
  //     margin-bottom: 15px;
  //   }
  //   .thing-mian {
  //     font-size: 24px;
  //     font-weight: bold;
  //     color: #333;
  //     display: flex;
  //     justify-content: space-between;
  //   }
  // }
  .content {
    flex: 1;
    height: calc(100vh - 108px);
    padding: 20px;
    box-sizing: border-box;
    background: var(--el-bg-color-overlay);
    margin-top: 3px;
    .btnStyle{
      position: absolute;
      right: 30px;
      top: 20px;
      :deep .el-button{
        width: 80px;
      }
    }
    .search {
      background: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .input {
        width: 200px;
      }
      .edit {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .btnList{
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tab-list {
      height: calc(100% - 40px);
      overflow-y:auto;
      box-sizing: border-box;

      background: var(--el-bg-color-overlay);
      span {
        cursor: pointer;
      }
    }
    .page {
      background: #fff;
      width: 100%;
      height: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding-right: 20px;
    }
  }
</style>
