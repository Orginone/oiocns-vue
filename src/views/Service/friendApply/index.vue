
<template>
  <div class="thing">
    <div class="content">
      <div>
        <el-menu
          :default-active="flowActive"
          class="el-menu"
          style="height: 40px; padding-left: 20px; margin-bottom: 20px"
          mode="horizontal"
          @select="flowSelect"
        >
          <el-menu-item index="1">待处理</el-menu-item>
          <el-menu-item index="2">已完成</el-menu-item>
          <el-menu-item index="3">我的请求</el-menu-item>
        </el-menu>
      </div>
      <div class="btnStyle">
        <el-button @click="labor(1)" type="primary">加好友</el-button>
        <el-button @click="labor(2)" type="primary">审核</el-button>
        <el-button @click="labor(3)" type="primary">退回</el-button>
      </div>
       <div class="tab-list">
        <DiyTable
          class="diytable"
          ref="diyTable"
          :hasTableHead="false"
          :tableData="tableData"
          :options="options"
          :tableHead="tableHead"
        >
          <template #productId="scope">
            <!-- {{chat.getName(scope.row?.team?.flowRelation?.productId||scope.row?.flowTask?.flowInstance?.flowRelation?.productId||scope.row?.flowRelation?.productId)}} -->
          </template>
          <template #remark="scope">
            {{ scope.row?.team?.remark }}
          </template>
          <template #target.name="scope">
            {{ chat.getName(scope.row.createUser) }}
          </template>
          <template #option="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                ···
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>审核申请</el-dropdown-item>
                  <el-dropdown-item>退回申请</el-dropdown-item>
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
  import { ref, onMounted, reactive,nextTick, getCurrentInstance } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/store/user'
  import { useRoute,useRouter } from 'vue-router'
  import DiyTable from '@/components/diyTable/index.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import friendJosn from '../json/friend.json';
  import type { TabsPaneContext } from 'element-plus'
  import { chat } from '@/module/chat/orgchat'
  
  import thingServices from '@/module/flow/thing'

  const ThingServices  = new thingServices()
  const instance = getCurrentInstance()
  const route = useRoute()
  const router = useRouter()
  const dialogVisible = ref<boolean>(false)
  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  var tableData = ref<any>([{id:123,flowInstance:{}}])
  const diyTable = ref(null)
  const tableHead =ref<any>(ThingServices.friendHead);
  const options = {
    expandAll: false,
    checkBox: false,
    order: true,
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

  // const showDetail = async (row: any,type:number) => {
  //   if(type == 4){
  //     $services.wflow.approvalTask({data:{id: row.id,status: 100,}}).then(async (res: ResultType) => {
  //       ElMessage({
  //         message: res.msg,
  //         type: 'success'
  //       })
  //       ThingServices.whiteList = [];
  //       await ThingServices.queryTask()
  //       tableHead.value = ThingServices.flowHead;
  //       tableData.value = ThingServices.copyList
  //     })
      
  //   }else if(type ==3){
  //     $services.wflow.deleteInstance({data:{id: row.id}}).then(async (res: ResultType) => {
  //       ElMessage({
  //         message: res.msg,
  //         type: 'success'
  //       })
  //       ThingServices.whiteList = [];
  //       await ThingServices.queryInstance()
  //       tableHead.value = ThingServices.queryInstanceHead;
  //       tableData.value =ThingServices.queryInstanceList
  //     })
     
  //   }else{
  //     let instanceId:string;
  //     if(flowActive.value == '1'){
  //       instanceId = row?.instanceId
  //     }else if(flowActive.value == '2'){
  //       instanceId = row?.flowTask?.instanceId
  //     }else if(flowActive.value == '3'){
  //       instanceId = row?.id
  //     }else{
  //       instanceId = row?.instanceId
  //     }
  //     router.push({ path: '/work/process', query: {id:row.id,type:flowActive.value,instanceId:instanceId}});
  //   }
  // }

  const activeIndex = ref<string>('1')
  const flowActive = ref<string>('1')
  const activeId = ref<string>('0')
  const elmenus = ref(null);
  const activeName = ref('first') //商店tab

  const labor = (index:any) => {
    if(index === 1) {
      router.push({ path: '/chat' })
    }
  }

  const handleClose = (index:any) => {
    elmenus.value.open(index)
    handleSelect(activeIndex.value, [])
  }
  var getList = async () => {
    await ThingServices.getAllApproval('0')
    console.log(friendJosn);
    
    tableData.value = friendJosn
  }

  const getWflow =async () => {
    await ThingServices.queryTask()
    tableHead.value = ThingServices.friendHead;
    tableData.value = friendJosn
  }

  const flowSelect = (key: string) => {
    flowActive.value = key
    flowSwitch(key)
  }
  const flowSwitch  = async (key: string) => {
    if(key == '1'){
      await ThingServices.queryTask()
      tableData.value = friendJosn
    }else if(key =='2'){
      await ThingServices.queryRecord()
      tableData.value = friendJosn
    }else if(key =='3'){
      await ThingServices.queryInstance()
      tableData.value = friendJosn
    }else if(key =='4'){
      tableData.value = friendJosn
    }
  }
  const whiteList:Array<string>= ['1-1','1-2','1-3','1-4','1-5','1-6']
  const handleSelect = (key: any, keyPath: string[]) => {
    tableData.value = []
    // diyTable.value.state.page.total = 0
    
    activeIndex.value = key;
    ThingServices.whiteList = [];
    if (whiteList.includes(key)) {
      getList()
      tableHead.value = ThingServices.friendHead;
    } else {
      getWflow();
    }
  }

  onMounted(() => {
    // ThingServices.whiteList = [];
    // const route = useRouter();
    // const selectType = route.currentRoute.value.query.type?'1-1':'2-1';
    // let id = route.currentRoute.value.query.id;
    // activeIndex.value = '1-1';
    // if (Array.isArray(id)) {
    //   activeId.value = id[0];
    // } else {
    //   activeId.value = id
    // }
    
    handleSelect('1-1', [])
  });

  instance?.proxy?.$Bus.on('selectBtn', (num) => {
    if(num === '1-1') {
      handleSelect(num, [])
    }
  })

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
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: var(--el-bg-color-overlay);
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
