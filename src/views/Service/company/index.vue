
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
      <div class="btnStyle">
        <el-button @click="joinCompany" type="primary">加入单位</el-button>
        <el-button type="primary">审核</el-button>
        <el-button type="primary">退回</el-button>
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
          <template #content="scope">
            {{ scope.row.target.name }}申请加入{{ scope.row.team.name }}
          </template>
          <template #targetName="scope">
            {{chat.getName(scope.row.createUser)}}
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
  import { ref, onMounted, reactive, nextTick, getCurrentInstance } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/store/user'
  import { useRoute,useRouter } from 'vue-router'
  import DiyTable from '@/components/diyTable/index.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  import searchCompany from '@/components/searchs/index.vue'
  import { chat } from '@/module/chat/orgchat'
  
  import thingServices from '@/module/flow/thing'

  import {WorkModel} from "@orginone/oiocns-ts";

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

  const ThingServices  = new thingServices()
  const instance = getCurrentInstance()
  const route = useRoute()
  const router = useRouter()
  const dialogVisible = ref<boolean>(false)
  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  var tableData = ref<any>([{id:123,flowInstance:{}}])
  const diyTable = ref(null)
  const tableHead =ref<any>(ThingServices.companyHead) ;
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

  const activeIndex = ref<string>('1')
  const activeId = ref<string>('0')
  const elmenus = ref(null);

  const handleClose = (index:any) => {
    elmenus.value.open(index)
    handleSelect(activeIndex.value, [])
  }

  // 查询我的审批
  var getAllApprovalList = async () => {
    // await ThingServices.getAllApproval('0')
    // tableData.value = ThingServices.approvalList.length && ThingServices.approvalList.filter(i => i?.team?.target?.typeName === '单位')
    const res = await WorkModel.OrgTodo.getTodoList(true);
    tableData.value = res.map(d => {
      d.Data.pass = d.pass;
      d.Data.reject = d.reject;
      return d.Data;
    });
  }

  // 查询我的申请
  var getApplyList = async () => {
    await ThingServices.getAllApply()
    tableData.value = ThingServices.applyList
  }

  // 当前menu默认active
  const flowActive = ref<string>('1')
  // menu 切换方法
  const flowSelect = (key: string) => {
    flowActive.value = key
    flowSwitch(key)
  }
  const flowSwitch  = async (key: string) => {
    // if(key == '1'){
    //   await ThingServices.queryTask()
    //   tableData.value =ThingServices.taskList
    // }else if(key =='2'){
    //   await ThingServices.queryRecord()
    //   tableData.value =ThingServices.recordList
    // }else if(key =='3'){
    //   await ThingServices.queryInstance()
    //   tableData.value =ThingServices.queryInstanceList
    // }else if(key =='4'){
    //   tableData.value = ThingServices.copyList
    // }
  }

  async function joinSuccess(row: { pass: (status: any) => Promise<any> }) {
    await row.pass(114);
    ElMessage.success('通过成功')
  }
  async function joinReject(row: { reject: (status: any) => Promise<any> }) {
    await row.reject(514);
    ElMessage.success('拒绝成功')
  }

  const whiteList:Array<string>= ['1-1','1-2','1-3','1-4','1-5','1-6']
  const handleSelect = (key: any, keyPath: string[]) => {
    tableData.value = []
    // diyTable.value.state.page.total = 0
    activeIndex.value = key;
    ThingServices.whiteList = [];
    if (whiteList.includes(key)) {
      getApplyList()
      tableHead.value = ThingServices.companyHead;
    }
  }

  onMounted(() => {
    handleSelect('1-2', [])
    getAllApprovalList()
  });

  instance?.proxy?.$Bus.on('selectBtn', (num) => {
    if(num === '1-2') {
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
