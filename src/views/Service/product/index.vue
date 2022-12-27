
<template>
    <div class="thing">
      <div class="content">
        <div class="tab-list">
          <div>
            <DiyTable
            ref="diyTable"
            :hasTitle="false"
            :hasTabs="true"
            :options="options"
            :hasTableHead="true"
            :tableData="state.list"
            :tableHead="tableHead"
          >
            <template #slot-tabs>
              <el-tabs v-model="activeName" style="width: 100%" @tabClick="loadList">
                <el-tab-pane label="待办" name="1"> </el-tab-pane>
                <el-tab-pane label="已办" name="2"> </el-tab-pane>
                <el-tab-pane label="我发起的" name="3"> </el-tab-pane>
              </el-tabs>
            </template>
            <template  #marketName="scope" >
              {{scope.row._data.market.name}}
              <el-tag type="info">{{scope.row._data.market.code}}</el-tag>
            </template>
            <template  #marketCode="scope" >
              {{scope.row.Data.target ? scope.row.Data.target.name : '本人'}}
            </template>
            <template  #status="scope" >
               <el-tag>{{statusMap[scope.row._data.status].text}}</el-tag>
            </template>
            <template  #createTime="scope" >
              {{scope.row._data.createTime}}
            </template>
            <template #operate="scope">
              <el-button
                v-if="activeName == '0' || activeName == '1'"
                @click="lastSuccess(scope.row, 100)"
                type= 'primary'
                link>同意</el-button>
              <el-button
                v-if="activeName == '0'"
                @click="lastRefuse(scope.row, 200)"
                type= 'danger'
                link>拒绝</el-button>
                <el-button
                v-if="activeName == '2'"
                @click="lastCancel(scope.row, 200)"
                type= 'danger'
                link>取消申请</el-button>
            </template>
            </DiyTable>
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
    import thingServices from '@/module/flow/thing'
    import {todoCtrl} from '@/ts/coreIndex'
    const statusMap = {
      1: {
        color: 'blue',
        text: '待处理',
      },
      100: {
        color: 'green',
        text: '已同意',
      },
      200: {
        color: 'red',
        text: '已拒绝',
      },
      102: {
        color: 'green',
        text: '已发货',
      },
      220: {
        color: 'gold',
        text: '买方取消订单',
      },
      221: {
        color: 'volcano',
        text: '卖方取消订单',
      },
      222: {
        color: 'default',
        text: '已退货',
      },
    };
    const ThingServices  = new thingServices()
    const store = useUserStore()
    const diyTable = ref(null)
         
    const tableHead =ref<any>(
      [
        {
          type:'slot',
          name:'marketName',
          prop: 'marketName',
          label: '市场名称'
        },
        {
          type:'slot',
          name:'marketCode',
          prop: 'marketCode',
          label: '申请组织'
        },
        {
          type:'slot',
          name:'status',
          prop: 'status',
          label: '状态'
        },
        {
          type:'slot',
          name:'createTime',
          prop: 'createTime',
          label: '申请时间'
        },
        {
          type: 'slot',
          label: '操作',
          fixed: 'right',
          align: 'center',
          width: '200',
          name: 'operate'
        }
      ]
    );
    const options = {
      expandAll: false,
      checkBox: false,
      order: true,
      switchType:false,
      noPage: true,
      selectLimit: 0
    }
    // 表格展示数据
    const pageStore = reactive({
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
    const activeName = ref('first') //商店tab
    
    const state = reactive({
      list: [],
    })
    const loadList = async (tab: TabsPaneContext) => {
      if(!tab){
        tab.index= '0';
      }
      if (tab.index== '0') {
        const list = await todoCtrl.PublishTodo['getTodoList'](false);
        console.log('list',list)
        state.list = list || []
      } else if (tab.index =='1'){
        const list = await todoCtrl.PublishTodo['getDoList']({
          limit:0,
          offset:0,
          filter:""
        });
        state.list = list || []
      }else {
        const list = await todoCtrl.PublishTodo['getApplyList']({
          limit:0,
          offset:0,
          filter:""
        });
        state.list = list || []
      }
      console.log('state', state.list)
    };
  
     //同意
    const lastSuccess = async (item: any,status:number) => {
      item.pass(status, '').then(() => {
        todoCtrl.changCallback();
        ElMessage({
          message: '审批完成',
          type: 'success'
        })
        loadList({
          uid: 0,
          slots: undefined,
          props: undefined,
          paneName: '',
          active: false,
          index: activeName.value,
          isClosable: false
        },);
      })
    }
    // 拒绝
    const lastRefuse = async (item: any,status:number) =>{
      item.reject(status, '').then(() => {
        ElMessage({
          message: '审批完成',
          type: 'success'
        })
        loadList({
          uid: 0,
          slots: undefined,
          props: undefined,
          paneName: '',
          active: false,
          index: activeName.value,
          isClosable: false
        },);
      })
    }
    // 取消
    const lastCancel = async (item: any,status:number) =>{
      item.cancel(status, '').then(() => {
        ElMessage({
          message: '审批完成',
          type: 'success'
        })
        loadList({
          uid: 0,
          slots: undefined,
          props: undefined,
          paneName: '',
          active: false,
          index: activeName.value,
          isClosable: false
        },);
      })
    }
    onMounted(() => {
      loadList({
          uid: 0,
          slots: undefined,
          props: undefined,
          paneName: '',
          active: false,
          index: '0',
          isClosable: false
      },);
      activeName.value = '1';
    });
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
      height: calc(100% - 3px);
      padding: 20px;
      box-sizing: border-box;
      background: var(--el-bg-color-overlay);
      margin-top: 3px;
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
        height: 100%;
        overflow: hidden;
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
  