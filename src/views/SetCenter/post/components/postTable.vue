<template>
  <div class="content box">
    <div class="body" ref="bodyWrap">
      <diytab
        :style="{ width: '100%' }"
        ref="diyTable"
        :hasTitle="true"
        :hasTableHead="true"
        tableName="岗位人员"
        :tableData="tableData"
        :options="options"
        :total="pageStore.total"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
        :tableHead="tableHead"
      >
        <template #slot-tabs>
          <h4>岗位人员</h4>
        </template>
        <template #buttons>
          <el-button class="btn-check" @click="showGiveDialog" type="primary" link>指派岗位
            <!-- <span style="transform: scale(1.5);">+</span> -->
          </el-button>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showDiong">调整岗位</el-dropdown-item>
                <el-dropdown-item @click="removeFrom(scope.row)" style="color: #f67c80" >移出岗位</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #slot-card>
          <!-- <card></card> -->
        </template>
      </diytab>
    </div>
    <el-dialog v-model="giveDialog" @close="hideGiveDialog" title="指派岗位" width="50%">
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
  </div>
</template>
<script lang="ts" setup>
// @ts-nocheck
import diytab from "@/components/diyTable/index.vue";
import { ref } from "vue";
import { setCenterStore } from '@/store/setting'
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import { USERCTRL, TargetType } from '@/ts/coreIndex';
const store = setCenterStore()
store.$subscribe(
(_, state) => {
  if(state.currentSelectItme.label === '岗位管理') return
  getUsers(store.currentSelectItme?.object)
},
{ detached: false }
)

// 表格展示数据
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})
const tableData = ref([])
const options = ref<any>({
  checkBox: true,
  order: true,
  selectLimit: 1,
  defaultSort: { prop: 'createTime', order: 'descending' },
  treeProps: {
    children: 'children',
    hasChildren: 'hasChildren'
  }
})
const tableHead = ref([
  {
    prop: 'name',
    label: '人员名称',
  },
  {
    prop: 'nickname',
    label: '所属部门',
    name: 'nickname'
  },
  {
    prop: 'name',
    label: '职务',
    name: 'name'
  },
  {
    prop: 'team.code',
    label: '手机号',
    name: 'teamCode'
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
const handleUpdate = (page: any) => {
  pageStore.currentPage = page.currentPage
  pageStore.pageSize = page.pageSize
  getUsers()
}
const checkList = reactive<any>([])
const selectionChange = (val: any) => {
  checkList.value = val
}

// 加载岗位下的用户
const getUsers = async (currentData = store.currentSelectItme.object) => {
  if(currentData){
    const backData =  await currentData?.loadMembers({
      filter: "",
      limit: 20,
      offset: 0
  })
    if(backData.result){
      tableData.value =backData.result;
      pageStore.total = backData.total
    }else{
      tableData.value =[];
      pageStore.total = 0
    }
  }
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
    const data = await store.currentSelectItme.object?.removeMember(row)
    if(data){
      getUsers()
      ElMessage({
        message: '移除成功',
        type: 'success'
      })
    }
  })
    .catch(() => {
      console.log('移除成功!')
    })
}

let companyUsers = ref<any>([])
const giveDialog = ref<boolean>(false)
const giveTable = ref(null)
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
const hideGiveDialog = () => {
  giveDialog.value = false
  getUsers()
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

// 指派岗位
const showGiveDialog = () => {
  pageStore.currentPage =1;
  if (!store.currentSelectItme.object?.target?.name) {
    ElMessage({
      type: 'warning',
      message: '请选择岗位'
    })
    return false
  }
  giveDialog.value = true
  getOrgUsers()
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
  const personData = await USERCTRL.space.loadMembers({
    offset: 0,
    limit: 10,
    filter: ''
  });

  let us = personData.result || []
  let userIds = []
  if (tableData.value) {
    userIds = tableData.value.map((u: any) => u.id);
  }
  const set: Set<string> = new Set(userIds)
  companyUsers.value = us.filter((u: any) => !set.has(u.id))
  pageStore.total = personData.total - userIds.length
  giveTable.value.state.page.total = pageStore.total;
}

// 给人员岗位
const giveIdentity = async () => {
  const userIds = giveTable?.value?.state?.multipleSelection.map((u: any) => u.id);
  const data = await store.currentSelectItme.object?.pullMembers(userIds, TargetType.Person)
  if (data) {
    ElMessage({
      message: '分配成功',
      type: 'success'
    })
    hideGiveDialog()
    getUsers()
  }
}

</script>
<style lang="scss" scoped>
  .el-dropdown-link{
    padding: 2px 10px;
    cursor: pointer;
    border-radius: 10px;
  }
  .el-dropdown-link:hover{
    background:#1642cb;
    color: #fff;
  }
.content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    box-sizing: border-box;
    .body {
      height: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
      flex: 1;
      .btn-check{
        padding: 8px 16px;
        color: #154ad8;
      }
      .btn-check:hover{
          background: #154ad8;
          color: #fff;
          padding: 8px  16px;
      }
    }
  }
</style>
