<template>
    <div class="thing">
      <div class="content">
        <el-menu
            :default-active="flowActive"
            class="el-menu"
            style="height: 40px; padding-left: 20px;"
            mode="horizontal"
            @select="flowSelect"
        >
            <el-menu-item index="1">待办</el-menu-item>
            <el-menu-item index="2">已办</el-menu-item>
            <el-menu-item index="3">我发起的</el-menu-item>
            <el-menu-item index="4">抄送我的</el-menu-item>
            <!-- <el-menu-item index="5">公告</el-menu-item> -->
        </el-menu>
         <div class="tab-list" >
          <DiyTable
            class="diytable"
            ref="diyTable"
            :hasTableHead="false"
            :tableData="tableData"
            :options="options"
            :tableHead="tableHead"
          >
            <template #productId="scope">
              {{chat.getName(scope.row?.flowInstance?.flowRelation?.productId||scope.row?.flowTask?.flowInstance?.flowRelation?.productId||scope.row?.flowRelation?.productId)}}
            </template>
            <template #target.name="scope">
              {{chat.getName(scope.row.createUser)}}
            </template>
            <template #content="scope">
              {{scope.row?.flowInstance?.content || scope?.row?.flowTask?.flowInstance?.content || scope?.row?.content}}
            </template>
            <template #status="scope">
              <div v-if="scope.row.status >= 0 && scope.row.status < 100">待批</div>
              <div v-else-if="scope.row.status >= 100 && scope.row.status < 200">
                <div v-if="scope.row?.flowTask?.flowNode?.nodeType=='审批'">已通过</div>
                <div v-else-if="scope.row?.flowTask?.flowNode?.nodeType=='抄送'">已查阅</div>
                <div v-else>已通过</div>
              </div>
              <div v-else>已拒绝</div>
            </template>
            <template #option="scope">
              <el-dropdown>
                <span class="el-dropdown-link">
                  ···
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="flowActive == '1'" @click="showDetail(scope.row,1)">审核申请</el-dropdown-item>
                    <el-dropdown-item v-if="flowActive == '2'" @click="showDetail(scope.row,1)">查看详情</el-dropdown-item>
                    <el-dropdown-item v-if="flowActive == '3'" @click="showDetail(scope.row,1)">查看详情</el-dropdown-item>
                    <el-dropdown-item v-if="flowActive == '4'" @click="showDetail(scope.row,1)">查看详情</el-dropdown-item>
                    <el-dropdown-item v-if="flowActive == '3'" @click="showDetail(scope.row,3)">撤销</el-dropdown-item>
                    <el-dropdown-item v-if="flowActive == '4'" @click="showDetail(scope.row,4)">阅读</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
                </el-dropdown>
            </template>
          </DiyTable>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
    import $services from '@/services'
    import { ref, onMounted, reactive } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useUserStore } from '@/store/user'
    import { useRoute,useRouter } from 'vue-router'
    import DiyTable from '@/components/diyTable/index.vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import type { TabsPaneContext } from 'element-plus'
    import {chatCtrl as chat} from '@/ts/coreIndex'
    
    import thingServices from '@/module/flow/thing'
  
    const ThingServices  = new thingServices()
    const route = useRoute()
    const router = useRouter()
    const dialogVisible = ref<boolean>(false)
    const store = useUserStore()
    const { workspaceData } = storeToRefs(store)
    var tableData = ref<any>([{id:123,flowInstance:{}}])
    const diyTable = ref(null)
    const tableHead =ref<any>(ThingServices.flowHead) ;
    const options = {
      expandAll: false,
      checkBox: false,
      order: true,
      noPage: true,
      switchType:false,
      selectLimit: 0
    }
    // 表格展示数据
    const pageStore = reactive({
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0
    })
  
    const showDetail = async (row: any,type:number) => {
      if(type == 4){
        $services.wflow.approvalTask({data:{id: row.id,status: 100,}}).then(async (res: ResultType) => {
          ElMessage({
            message: res.msg,
            type: 'success'
          })
          ThingServices.whiteList = [];
          await ThingServices.queryTask()
          tableHead.value = ThingServices.flowHead;
          tableData.value = ThingServices.copyList
        })
        
      }else if(type ==3){
        $services.wflow.deleteInstance({data:{id: row.id}}).then(async (res: ResultType) => {
          ElMessage({
            message: res.msg,
            type: 'success'
          })
          ThingServices.whiteList = [];
          await ThingServices.queryInstance()
          tableHead.value = ThingServices.queryInstanceHead;
          tableData.value =ThingServices.queryInstanceList
        })
       
      }else{
        let instanceId:string;
        if(flowActive.value == '1'){
          instanceId = row?.instanceId
        }else if(flowActive.value == '2'){
          instanceId = row?.flowTask?.instanceId
        }else if(flowActive.value == '3'){
          instanceId = row?.id
        }else{
          instanceId = row?.instanceId
        }
        router.push({ path: '/work/process', query: {id:row.id,type:flowActive.value,instanceId:instanceId}});
      }
    }
  
    const activeIndex = ref<string>('1')
    const flowActive = ref<string>('1')
  
    const state = reactive({
      approvalList: [],
      tableHead: []
    })

  
    const getWflow =async () => {
      await ThingServices.queryTask()
      tableHead.value = ThingServices.flowHead;
      tableData.value =ThingServices.taskList
      
    }
  
    const flowSelect = (key: string) => {
      flowActive.value = key
      flowSwitch(key)
    }
    const flowSwitch  = async (key: string) => {
      if(key == '1'){
        await ThingServices.queryTask()
        tableHead.value = ThingServices.flowHead;
        tableData.value =ThingServices.taskList
      }else if(key =='2'){
        await ThingServices.queryRecord()
        tableHead.value = ThingServices.recordHead;
        tableData.value =ThingServices.recordList
      }else if(key =='3'){
        await ThingServices.queryInstance()
        tableHead.value = ThingServices.queryInstanceHead;
        tableData.value =ThingServices.queryInstanceList
      }else if(key =='4'){
        tableHead.value = ThingServices.flowHead;
        tableData.value = ThingServices.copyList
      }
    }

    const whiteList:Array<string>= ['1-1','1-2','1-3','1-4','1-5','1-6']
    const handleSelect = (key: any, keyPath: string[]) => {
      tableData.value = []
      diyTable.value.state.page.total = 0
      activeIndex.value = key;
      ThingServices.whiteList = [];
      
        getWflow();
    }
  
    onMounted(() => {
      const selectType = '2-1'
      handleSelect(selectType, [])
    });
  </script>
  <style lang="scss">
  .thing{
    .el-menu{
      border-right: 0;
      border-bottom: 0;
    }
    .el-sub-menu__icon-arrow{
      display: none;
    }
    .el-dropdown-link{
      padding: 2px 10px;
      border-radius: 10px;
    }
    .el-dropdown-link:hover{
      background: var(--el-bg-color-overlay);
    }
  }
  
  </style>
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
        width: 140px;
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
    .thing-head {
      padding: 30px;
      // background: #fff;
      .thing-type {
        font-size: 16px;
        color: #8d8d8d;
        margin-bottom: 15px;
      }
      .thing-mian {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        display: flex;
        justify-content: space-between;
      }
    }
    .content {
      flex: 1;
      height: calc(100% - 3px);
      margin-top: 3px;
      padding: 20px;
      box-sizing: border-box;
      background: var(--el-bg-color-overlay);
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
      .tab-list {
        height: calc(100% - 40px);
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