<template>
  <div class="userUnit">
    <div class="title">
      <div class="body">
        <div class="created">
          <div class="body-head">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="全部" name="1"> </el-tab-pane>
              <!-- <el-tab-pane label="已加入" name="2"></el-tab-pane>
                <el-tab-pane label="拒绝" name="3"> </el-tab-pane> -->
            </el-tabs>
          </div>
          <div class="contet">
            <div class="createdTop">
              <div class="topLeft">
                <!-- <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" /> -->
              </div>
              <div class="topRight">
                <el-button small link type="primary" @click="showdialogShow">创建单位</el-button>
                <el-button small link type="primary" @click="friendShow">申请加入单位</el-button>
                <!-- <el-button>查看申请记录</el-button> -->
              </div>
            </div>
            <div class="createdBody">
              <DiyTable
                class="diytable"
                ref="diyTable"
                :hasTableHead="false"
                @handleUpdate="handleUpdate"
                :tableData="dataList.list"
                :tableHead="tableHead"
              >
                <template #option="scope">
                  <el-button v-if="!authority.IsSuperAdmin(scope.row.id)" link type="danger" @click="handleExit(scope.row.id)">退出</el-button>
                  <el-button v-if="authority.IsSuperAdmin(scope.row.id)" link type="danger" @click="handleDelete(scope.row.id)">解散</el-button>
                </template>
              </DiyTable>
            </div>
          </div>
          <CreateUnitDialog
            :dialogShow="dialogShow"
            @switchCreateCompany="closeDialog"
          ></CreateUnitDialog>
          <searchCompany
            v-if="friendDialog"
            @closeDialog="()=> {friendDialog = false}"
            :serachType="3"
            @checksSearch="checksSearch"
          ></searchCompany>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import $services from '@/services'
  import { useUserStore } from '@/store/user'
  import type { TabsPaneContext } from 'element-plus'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import searchCompany from '@/components/searchs/index.vue'
  import CreateUnitDialog from '@/views/Layout/components/createUnitDialog.vue'
  import DiyTable from '@/components/diyTable/index.vue'
  import {chat} from '@/module/chat/orgchat'
  import authority from '@/utils/authority'

  const store = useUserStore()

  const activeName = ref('1')
  const diyTable = ref(null)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const handleUpdate = (page: any) => {
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    getList()
  }
  const tableHead = ref([
    {
      prop: 'name',
      label: '单位名称',
      name: 'name',
      width: '300'
    },
    {
      prop: 'code',
      label: '统一社会信用代码',
      name: 'code',
      width: '190'
    },
    {
      prop: 'team.code',
      label: '团队代号',
      name: 'teamCode',
      width: '190'
    },
    {
      prop: 'identitys',
      label: '我的岗位',
      name: 'identitys',
      width: '200'
    },
    {
      prop: 'createUser',
      label: '设立人',
      name: 'createUser',
      width: '200'
    },
    {
      prop: 'createTime',
      label: '设立时间',
      name: 'createTime',
      width: '200'
    },
    {
      prop: 'team.remark',
      label: '简介',
      name: 'teamRemark',
      width: '300'
    },
    {
      type: 'slot',
      prop: 'option',
      label: '操作',
      name: 'option'
    }
  ])
  //tab切换
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }
  const handleExit = (id: string) => {
    ElMessageBox.confirm('确定退出吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      $services.company
        .exit({
          data: {
            id: id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            ElMessage({
              message: '退出成功',
              type: 'warning'
            })
            getList()
          }
        })
    })
  }
  const handleDelete = (id: string) => {
    ElMessageBox.confirm('确定解散单位吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      $services.company
        .delete({
          data: {
            id: id
          }
        })
        .then((res: ResultType) => {
          if (res.code == 200) {
            ElMessage({
              message: '退出成功',
              type: 'warning'
            })
            getList()
          }
        })
    })
  }
  type listItem = {
    id: string
    code: string
  }
  type listType = {
    list: Array<listItem>
  }
  const dataList = reactive<listType>({ list: [] })
  onMounted(() => {
    getList()
  })
  //获取单位列表
  const getList = () => {
    $services.company
      .getJoinedCompany({
        data: {
          offset: 0,
          limit: 100
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          res.data.result.forEach((item:any)=>{
            let name = chat.getName(item.createUser)
            if(name && name.length > 0){
              item.createUser = name
            }
            item.identitys = authority.GetTargetIdentitys(item.id)
          })
          dataList.list = res.data.result
          diyTable.value.state.page.total = res.data.total
        }
      })
  }
  interface ListItem {
    value: string
    label: string
    remark: string
    name: string
  }
  const addCompanyFun = (arr: Array<arrList>) => {
    $services.company
      .applyJoin({
        data: {
          id: arr.join(',')
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '申请成功',
            type: 'warning'
          })
          friendDialog.value = false
        }
      })
  }
  type dialogType = {
    key: string
    value: boolean
  }
  const dialogShow = ref<dialogType>({
    key: 'unit',
    value: false
  })
  const showdialogShow = () => {
    dialogShow.value.value = true
  }
  const closeDialog = () => {
    location.reload()
  }
  type arrList = {
    id: string
  }
  const friendDialog = ref<boolean>(false)
  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<arrList> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      addCompanyFun(arr)
    } else {
      friendDialog.value = false
    }
  }
  const friendShow = () => {
    friendDialog.value = true
  }
</script>
<style lang="scss" scoped>
  .userUnit {
    height: 100%;
    .title {
      .body-head {
        background: var(--el-bg-color);
        
        :deep(.el-tabs__item) {
          // font-size: 20px !important;
          // font-weight: 600;
          margin-left: 30px;
          // border-color: #1a5773;
        }
        // :deep(.el-tabs__header) {
        //   padding-top: 20px;
        //   margin: 0;
        // }
      }

      .body {
        height: calc(100% - 100px);
        width: 100%;
        overflow: hidden;
        display: flex;
      }
    }
  }
  .created {
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    box-sizing: border-box;
    .contet {
      // padding: 20px;
      box-sizing: border-box;
      height: calc(100vh - 140px);
    }
    .createdTop {
      width: 100%;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      background: var(--el-bg-color);
    }
    .createdBody {
      // height: calc(100vh - 220px);
      box-sizing: border-box;
      background: var(--el-bg-color);
      padding: 6px;
    }
  }
</style>
