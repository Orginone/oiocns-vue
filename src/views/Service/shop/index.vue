
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
          :tableData="state.approvalList"
          :tableHead="tableHead"
        >
          <template #slot-tabs>
            <el-tabs v-model="activeName" style="width: 100%" @tabClick="shopClick">
              <el-tab-pane label="加入市场申请" name="first"> </el-tab-pane>
              <el-tab-pane label="应用上架申请" name="second"> </el-tab-pane>
              <el-tab-pane label="加入市场审批" name="third"> </el-tab-pane>
              <el-tab-pane label="应用上架审批" name="four"> </el-tab-pane>
            </el-tabs>
          </template>
          <template #operate="scope">
            <el-button v-if="activeName === 'first'" @click="cancelApply(scope.row.id)" type="primary"
              >取消申请</el-button
            >
            <el-button
              v-if="activeName === 'third'"
              @click="approvalSuccess(scope.row.id, 100)"
              type="primary"
              >审批通过</el-button
            >
            <el-button
              v-if="activeName === 'third'"
              @click="approvalSuccess(scope.row.id, 200)"
              type="danger"
              >驳回申请</el-button
            >
            <el-button
              v-if="activeName === 'four'"
              @click="LastSuccess(scope.row.id, 100)"
              type="primary"
              >审批通过</el-button
            >
            <el-button
              v-if="activeName === 'four'"
              @click="LastSuccess(scope.row.id, 200)"
              type="danger"
              >驳回申请</el-button
            >
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

  const ThingServices  = new thingServices()
  const instance = getCurrentInstance()
  const route = useRoute()
  const router = useRouter()
  const dialogVisible = ref<boolean>(false)
  const store = useUserStore()
  const { workspaceData } = storeToRefs(store)
  var tableData = ref<any>([{id:123,flowInstance:{}}])
  const diyTable = ref(null)
  
  const tableHead =ref<any>(ThingServices.state.searchJoinApplyHead);
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

  const activeIndex = ref<string>('1')
  const flowActive = ref<string>('1')
  const activeId = ref<string>('0')
  const elmenus = ref(null);
  const activeName = ref('first') //商店tab
  
  const state = reactive({
    approvalList: [],
  })
  const handleClose = (index:any) => {
    elmenus.value.open(index)
    handleSelect(activeIndex.value, [])
  }
  const shopClick = (tab: TabsPaneContext, event: any) => {
    if (tab.index === '0') {
      activeName.value = 'first'
      searchJoinApply()
    }
    if (tab.index === '1') {
      activeName.value = 'second'
      searchPublishApply()
    }
    if (tab.index === '2') {
      activeName.value = 'third'
      searchJoinApplyManager()
    }
    if (tab.index === '3') {
      activeName.value = 'four'
      searchManagerPublishApply()
    }
  }

  //查询加入市场申请
  var searchJoinApply = async () => {
    await ThingServices.searchJoinApply()
    state.approvalList =ThingServices.state.searchJoinApplyList
    tableHead.value = ThingServices.state.searchJoinApplyHead
  }
  searchJoinApply()
  //查询加入市场审批
  const searchJoinApplyManager = async () => {
    await ThingServices.searchJoinApplyManager()
    state.approvalList =ThingServices.state.searchJoinApplyManagerList
    tableHead.value = ThingServices.state.searchJoinApplyManagerHead
  }
  //查询产品上架申请
  const searchPublishApply = async () => {
    await ThingServices.searchPublishApply()
    state.approvalList =ThingServices.state.searchPublishApplyList
    tableHead.value = ThingServices.state.searchPublishApplyHead
  }
  //查询应用上架审批
  const searchManagerPublishApply = async () => {
    await ThingServices.searchManagerPublishApply()
    state.approvalList =ThingServices.state.searchManagerPublishApplyList
    tableHead.value = ThingServices.state.searchManagerPublishApplyHead
  }
  
  //取消申请
  var cancelJoin = (item: { id: '' }) => {
    ElMessageBox.confirm('确定取消吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
     const data = await ThingServices.cancelJoin(item.id)
      if(data){
        ElMessage({
          message: '取消成功',
          type: 'success'
        })
        ThingServices.whiteList = [];
        handleSelect(activeIndex.value, [])
      }
    })
  }
  //取消申请
  const cancelApply = async (index: number) => {
    await $services.appstore
      .cancelJoin({
        data: {
          id: index
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '取消申请成功',
            type: 'success'
          })
          ThingServices.whiteList = [];
          searchJoinApply()
        }
      })
  }
  //审批加入市场
  const approvalSuccess = async (index: number, status: number) => {
    await $services.appstore
      .approvalJoin({
        data: {
          id: index,
          status: status
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '审批完成',
            type: 'success'
          })
          ThingServices.whiteList = [];
          searchJoinApplyManager()
        }
      })
  }
   //上架审批
  const LastSuccess = async (index: number, status: number) => {
    await $services.appstore
      .approvalPublish({
        data: {
          id: index,
          status: status
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '审批完成',
            type: 'success'
          })
          ThingServices.whiteList = [];
          searchManagerPublishApply()
        }
      })
  }
  const whiteList:Array<string>= ['1-1','1-2','1-3','1-4','1-5','1-6']
  const handleSelect = (key: any, keyPath: string[]) => {
    tableData.value = []
    // diyTable.value.state.page.total = 0
    activeIndex.value = key;
    ThingServices.whiteList = [];
    if (whiteList.includes(key)) {
      searchJoinApply()
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
    
    // handleSelect(selectType, [])
  });

  instance?.proxy?.$Bus.on('selectBtn', (num) => {
    if(num === '1-3') {
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
