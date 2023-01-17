<template>
  <div class="card">
    <div :style="{height:tabHeight-50+'px'}">
      <div style="width: 100%; height: 100%;">
        <DiyTable ref="diyTable" :tableData="users" @handleUpdate="handleUpdate"
          :tableHead="tableHead"
          :tableName="selectItem.name ?? ''"
          :hasTitle="true"
          :hasTableHead="true"
          >
          <template #buttons>
            <el-button small link type="primary" @click="showGiveDialog">指派身份</el-button>
          </template>
          <template #operate="scope">
            <el-button link type="danger" size="small" @click="removeFrom(scope.row)">移除人员</el-button>
          </template>
        </DiyTable>
      </div>
    </div>
  </div>

  <el-dialog v-model="giveDialog" @close="hideGiveDialog" title="指派身份" width="50%">
    <el-input v-model="giveSearch" class="search" placeholder="搜索用户" @input="giveSearchChange">
      <template #prefix>
        <el-icon class="el-input__icon">
          <Search />
        </el-icon>
      </template>
    </el-input>
    <DiyTable ref="giveTable" :options="{
      expandAll: false,
      checkBox: true,
      order: true,
      selectLimit:0,
      switchType: false,
      noPage: false
    }" :hasTableHead="true" :tableData="companyUsers" @handleUpdate="giveTableChange" :tableHead="columns" :style="{height: '350px'}">
    </DiyTable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="hideGiveDialog">取消</el-button>
        <el-button type="primary" @click="giveIdentity">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang='ts' setup>
import DiyTable from '@/components/diyTable/index.vue'
import { reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import {userCtrl} from '@/ts/coreIndex'
const props = defineProps<{
  tabHeight: number,
}>()

const current = ref()
let selectItem = ref<any>({})
const selectItemChange = (data: any) => {
  current.value = data;
  selectItem.value = data.target;
};
defineExpose({ selectItemChange });

const tableHead = ref([
  {
    prop: 'code',
    label: '账号'
  },
  {
    prop: 'name',
    label: '昵称'
  },
  {
    prop: 'team.name',
    label: '姓名',
    name: 'teamName',
  },
  {
    prop: 'team.remark',
    label: '备注',
    name: 'teamRemark',
  },
  {
    prop: 'team.code',
    label: '手机号',
    name: 'teamCode',
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
let users = ref<any>([])

const columns = ref([
  {
    prop: 'code',
    label: '账号',
    width: '180',
  },
  {
    prop: 'name',
    label: '姓名',
    width: '240',
    name: 'name',
  },
  {
    prop: 'team.code',
    label: '手机号',
    width: '330',
    name: 'teamCode',
  }
])
let companyUsers = ref<any>([])

// 表格展示数据
const pageStore = reactive({
  tableData: [],
  currentPage: 1,
  pageSize: 20,
  total: 0
})

const diyTable = ref(null)
const giveTable = ref(null)

// 加载岗位下的用户
const getUsers = async () => {
  const obj = current.value
  if (obj) {
    const data = await obj.loadMembers({
      offset: 0,
      filter: '',
      limit: 65535,
    });
    if(data?.result){
        users.value = data.result;
        pageStore.total = data.total;
        diyTable.value.state.page.total = data.total;
    }
  }
}

const handleUpdate = (page: any) => {
  getUsers()
}


// 移除岗位下的人员
const removeFrom = (row: any) => {
  ElMessageBox.confirm(
    `是否确认移除该人员`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const data = await current.value.removeMembers([row.id])
    if(data){
      getUsers()
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
    }
  })
    .catch(() => {
      console.log('移除成功!')
    })
}

// 加载单位所有用户
const getOrgUsers = async(filter?: string) => {
  let data = {
    offset: (pageStore.currentPage - 1) * pageStore.pageSize,
    limit: pageStore.pageSize,
    filter: ''
  }
  if (filter && filter.trim() != '') {
    data = { ...data, ...{ filter } }
  }
  const personData = await userCtrl.space.loadMembers({
    offset: 0,
    limit: 10,
    filter: ''
  });

  let us = personData.result || []
  let userIds = []
  if (users.value) {
    userIds = users.value.map((u: any) => u.id);
  }
  const set: Set<string> = new Set(userIds)
  companyUsers.value = us.filter((u: any) => !set.has(u.id))
  pageStore.total = personData.total - userIds.length
  giveTable.value.state.page.total = pageStore.total;
}

const giveDialog = ref<boolean>(false)
const hideGiveDialog = () => {
  giveDialog.value = false
  getUsers()
}

const showGiveDialog = () => {
  pageStore.currentPage =1;
  if (!selectItem.value.id) {
    ElMessage({
      type: 'warning',
      message: '请选择岗位'
    })
    return false
  }
  giveDialog.value = true
  getOrgUsers()
}

// 过滤数据
const giveSearch = ref('')
const giveTableChange = (page: any) => {
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  getOrgUsers()
}

// 分配页面搜索用户变化
const giveSearchChange = (e: string) => {
  getOrgUsers(e)
}


// 给人员指派身份
const giveIdentity = async () => {
  const userIds = giveTable?.value?.state?.multipleSelection.map((u: any) => u.id);
  const data = await current.value.pullMembers(userIds)
  if (data) {
    ElMessage.success('指派身份成功!')
    hideGiveDialog()
    getUsers()
  } else {
    ElMessage.error('指派身份失败!')
  }
}

watch(selectItem, () => {
  getUsers()
});

</script>

<style lang='scss' scoped>
:deep(.el-table th.el-table__cell) {
  background-color: #eceffb!important;
}
.card {
  height: 100%;
  width: 100%;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
  padding: 10px;
  .search {
    width: 50%;
  }
}
</style>
