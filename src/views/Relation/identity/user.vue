<template>
  <div class="card">
    <div class="header">
      <div class="title">{{selectItem.name}}</div>
      <div class="box-btns">
        <el-button small link type="primary" v-if="allowEdit()" @click="showGiveDialog">指派岗位</el-button>
      </div>
    </div>
    <div :style="{height:tabHeight-50+'px'}">
      <div style="width: 100%; height: 100%">
        <DiyTable ref="diyTable" :hasTableHead="false" :tableData="users" @handleUpdate="handleUpdate"
          :tableHead="tableHead">
          <template #operate="scope">
            <el-button link type="danger" size="small" v-if="allowEdit() && selectItem.value.id !== scope.row.id" @click="removeFrom(scope.row)">移除人员</el-button>
          </template>
        </DiyTable>
      </div>
    </div>
  </div>

  <el-dialog v-model="giveDialog" @close="hideGiveDialog" :title="'给人员 => ' + selectItem.name + ' 岗位'" width="50%">
    <el-input v-model="giveSearch" class="search" placeholder="搜索用户" @input="giveSearchChange">
      <template #prefix>
        <el-icon class="el-input__icon">
          <Search />
        </el-icon>
      </template>
    </el-input>
    <DiyTable ref="giveTable" :hasTableHead="true" :tableData="companyUsers" :options="{
      expandAll: false,
      checkBox: true,
      order: true,
      selectLimit:0,
      noPage: false
    }" @handleUpdate="giveTableChange" :tableHead="columns" :style="{height: '350px'}">
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
import $services from '@/services'
import DiyTable from '@/components/diyTable/index.vue'
import { onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import authority from '@/utils/authority'
import identityServices from '@/module/relation/identity'
const IdentityServices = new identityServices()
const props = defineProps<{
  tabHeight: number,
}>()

const allowEdit = () => {
  if(selectItem.value && selectItem.value.id){
    return authority.IsRelationAdmin([
      selectItem.value.belongId,
      authority.getSpaceId()
    ])
  }
  return false
}

let selectItem = ref<any>({})
const selectItemChange = (data: any) => {
  selectItem.value = data;
};
defineExpose({ selectItemChange });

const tableHead = ref([
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
  },
  {
    prop: 'team.remark',
    label: '座右铭',
    width: '330',
    name: 'teamRemark',
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
  const obj = selectItem
  if (obj) {
    const data = await IdentityServices.getIdentityPerson(selectItem.value.id)
    if(data){
        users.value = data.result;
        pageStore.total = data.total;
        diyTable.value.state.page.total = IdentityServices.pageStore.total;
    }
  }
}

const handleUpdate = (page: any) => {
  console.log('page',page)
  IdentityServices.pageStore.currentPage = page.current
  IdentityServices.pageStore.pageSize = page.pageSize
  getUsers()
}


// 移除岗位下的人员
const removeFrom = (row: any) => {
  let url: string = 'removeIdentity';
  ElMessageBox.confirm(
    `确定把 ${row.name} 从当前岗位移除吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const data = await IdentityServices.removeIdentity(selectItem.value.id, row.id)
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
const getOrgUsers = (filter?: string) => {
  
  let data = {
    id: selectItem.value.belongId,
    offset: (pageStore.currentPage - 1) * pageStore.pageSize,
    limit: pageStore.pageSize
  }
  if (filter && filter.trim() != '') {
    data = { ...data, ...{ filter } }
  }
  $services[selectItem.value.module][selectItem.value.persons]({
      data,
  }).then((res: ResultType) => {
    if (res.code == 200 && res.success) {
      // 去除已分配到岗位
      let us = res.data.result || []
      let userIds = []
      if (users.value) {
        userIds = users.value.map((u: any) => u.id);
      }
      const set: Set<string> = new Set(userIds)
      companyUsers.value = us.filter((u: any) => !set.has(u.id))
      pageStore.total = res.data.total - userIds.length
      giveTable.value.state.page.total = pageStore.total;
    }
  })
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


// 给人员岗位
const giveIdentity = async () => {
  const userIds = giveTable?.value?.state?.multipleSelection.map((u: any) => u.id);
  const data = await IdentityServices.giveIdentity(selectItem.value.id, userIds)
  if (data) {
    ElMessage({
      message: '分配成功',
      type: 'success'
    })
    hideGiveDialog()
    getUsers()
  }
}

watch(selectItem, () => {
  getUsers()
});

</script>

<style lang='scss' scoped>
.card {
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  padding: 20px;

  .header {
    display: flex;

    .title {
      text-align: left;
      font-size: 16px;
      width: 30%;
      font-weight: bold;
    }

    .box-btns {
      text-align: right;
      padding-right: 14px;
      padding-bottom: 10px;
      width: 70%;
    }
  }

  .search {
    width: 50%;
  }
}
</style>
