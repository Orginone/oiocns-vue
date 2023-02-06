
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
          <el-menu-item index="1">待审批</el-menu-item>
          <el-menu-item index="2">已完成</el-menu-item>
          <el-menu-item index="3">我的申请</el-menu-item>
        </el-menu>
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
        <template #targetName="scope">
            {{scope.row?._data?.target?.name}}
          </template>
          <template #content="scope">
            {{ scope.row?._data?.target?.name }}申请加入{{ scope.row?._data?.team?.name }}
          </template>
          <template #createTime="scope">
            {{ scope.row?._data?.createTime?.slice(0,19) }}
          </template>
          <template #status="scope">
            <div v-if="scope.row?._data?.status >= 0 && scope.row?._data?.status < 100">待批</div>
            <div v-else-if="scope.row?._data?.status >= 100 && scope.row?._data?.status < 200">
              <div v-if="scope.row?._data.flowTask?.flowNode?.nodeType=='审批'">已通过</div>
              <div v-else-if="scope.row?._data.flowTask?.flowNode?.nodeType=='抄送'">已查阅</div>
              <div v-else>已通过</div>
            </div>
            <div v-else>已拒绝</div>
          </template>
          <template #option="scope">
            <el-button
              v-if="flowActive == '1'"
              link
              @click="joinSuccess(scope.row)"
              type="primary"
              >通过</el-button>
            <el-button
              v-if="flowActive == '1'"
              link
              @click="joinReject(scope.row)"
              type="warning"
              >拒绝</el-button>
            <el-button
              v-if="flowActive == '3'"
              link
              @click="cancelJoin(scope.row)"
              type="warning"
              >取消申请</el-button>
          </template>
        </DiyTable>
      </div>
    </div>
  </div>
  <searchCompany
    v-if="searchDialog"
    :serachType="3"
    @closeDialog="closeDialog"
    @checksSearch="checksSearch"
  >
  </searchCompany>
</template>

<script lang="ts" setup>
  import $services from '@/services'
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import DiyTable from '@/components/diyTable/index.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import searchCompany from '@/components/searchs/index.vue'
  // import {chatCtrl as chat} from '@/ts/coreIndex'
  
  import {todoCtrl} from '@/ts/coreIndex';

  // 申请加入单位弹窗控制
  const searchDialog = ref<boolean>(false)
  const joinCompany = () => {
    searchDialog.value = true
  }
  // 关闭弹窗
  const closeDialog = (key: string) => {
    searchDialog.value = false
  }
  // 加入单位方法
  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<any> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      console.log('val', arr)
      joinSubmit(arr)
    } else {
      searchDialog.value = false
    }
  }
  const joinSubmit = (arr: any) => {
    $services.company
      .applyJoin({
        data: {
          id: arr.join('')
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          searchDialog.value = false
          ElMessage({
            message: '申请成功',
            type: 'success'
          })
        }
      })
  }

  const store = useUserStore()
  var tableData = ref<any>([])
  const diyTable = ref(null)
  const tableHead =ref<any[]>([
    {
       prop: 'targetName',
       label: '申请人',
       name: 'targetName',
       type: 'slot',
     },
     {
       type: 'slot',
       prop: 'content',
       label: '内容',
       name: 'content'
     },
     {
       type: 'slot',
       prop: 'status',
       label: '状态',
       name: 'status'
     },
     {
       prop: 'createTime',
       label: '发送时间',
       name: 'createTime',
       type: 'slot',
     },
     {
       type: 'slot',
       prop: 'option',
       label: '操作',
       name: 'option'
     }
  ]) ;
  const options = {
    expandAll: false,
    checkBox: false,
    order: true,
    noPage: true,
    selectLimit: 0,
    switchType:false,
  }
  // 查询我的审批
  var getAllApprovalList = async () => {
    // await ThingServices.getAllApproval('0')
    // tableData.value = ThingServices.approvalList.length && ThingServices.approvalList.filter(i => i?.team?.target?.typeName === '单位')
    await todoCtrl.waitUntilInitialized();
    const res = await todoCtrl.OrgTodo.getTodoList(true);
    let arr:any = []
    res.forEach((element:any) => {
      if(element._data.team.target.typeName =='集团'){
        arr.push(element)
      }
    });
    tableData.value = arr
  }

  // 查询我的申请
  var getApplyList = async () => {
    await todoCtrl.waitUntilInitialized();
    const res:any = await todoCtrl.OrgTodo.getApplyList({
      offset:0,
      limit: 20,
      filter: ""
    });
    let arr:any = []
    res.result.forEach((element:any) => {
      if(element._data.team.target.typeName =='集团'){
        arr.push(element)
      }
    });
    tableData.value = arr
  }

  var getDoneList = async () => {
    await todoCtrl.waitUntilInitialized();
    const res:any = await todoCtrl.OrgTodo.getDoList({
      offset:0,
      limit: 20,
      filter: ""
    });
    let arr:any = []
    res.result.forEach((element:any) => {
      if(element._data.team.target.typeName =='集团'){
        arr.push(element)
      }
    });
    tableData.value = arr
  }

  // 当前menu默认active
  const flowActive = ref<string>('1')
  // menu 切换方法
  const flowSelect = (key: string) => {
    flowActive.value = key
    flowSwitch(key)
  }
  const flowSwitch  = async (key: string) => {
    if (key == '1') {
      getAllApprovalList();
    }else if(key =='2'){
      getDoneList();
    }else if(key =='3'){
      getApplyList();
    }
  }

  async function joinSuccess(row: { pass: (status: any) => Promise<any> }) {
    await row.pass(114);
    ElMessage.success('通过成功')
    flowSelect(flowActive.value)
  }
  async function cancelJoin(row: { cancel: (status: any) => Promise<any> }) {
    await row.cancel('100');
    ElMessage.success('取消成功')
    flowSelect(flowActive.value)
  }
  async function joinReject(row: { reject: (status: any) => Promise<any> }) {
    await row.reject(514);
    ElMessage.success('拒绝成功')
    flowSelect(flowActive.value)
  }

  onMounted(() => {
    getAllApprovalList()
  });

</script>
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
      :deep(.el-button){
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
