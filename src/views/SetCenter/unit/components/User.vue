<template>
  <div class="card" ref="cardHeight">
      <div style="width: 100%; height: 100%">
        <DiyTable 
          ref="diyTable" 
          :hasTableHead="true" 
          :hasTitle="true" 
          :tableName="selectItem.label" 
          :tableData="users" 
          :options="options"
          :checkList="[]" 
          @handleUpdate="handleUpdate"
          @selectionChange="selectionChange"
          :tableHead="tableHead">
          <template #buttons>
            <el-button small link type="primary" @click="friendDialog = true">添加成员</el-button>
          </template>
          <template #operate="scope">
            <el-dropdown>
              <span class="el-dropdown-link"> ··· </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="removeFrom(scope.row)">修改信息</el-dropdown-item>
                  <el-dropdown-item @click="removeFrom(scope.row)">变更部门</el-dropdown-item>
                  <el-dropdown-item @click="removeFrom(scope.row)">岗位设置</el-dropdown-item>
                  <el-dropdown-item @click="removeFrom(scope.row)">部门设置</el-dropdown-item>
                  <el-dropdown-item @click="removeFrom(scope.row)">停用</el-dropdown-item>
                  <el-dropdown-item @click="removeFrom(scope.row)" style="color: #f67c80">操作离职</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </DiyTable>
      </div>
  </div>
  <searchFriend v-if="friendDialog" :checkList='users' :selectLimit='0' @closeDialog="closeDialog"
    @checksSearch='checksSearch' />
  <AssignedPerson v-if="assignDialog" :checkList='users' :id="company.id" :selectLimit='0' :serachType='5'
    @closeDialog="hideAssignDialog" @checksSearch='checksCompanySearch' />

</template>
<script lang='ts' setup>
import $services from '@/services'
import DiyTable from '@/components/diyTable/index.vue'
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import searchFriend from '@/components/searchs/index.vue'
import AssignedPerson from '@/components/searchs/index.vue'
import authority from '@/utils/authority'
import DepartmentServices from '@/module/relation/department'
const departmentServices = new DepartmentServices()

let selectItem = ref<any>({})
// 获取单位树点击的信息
const selectItemChange = (data: any) => {
  selectItem.value = data;
  getUsers()
};
defineExpose({ selectItemChange });

const allowEdit = () => {
  return authority.IsRelationAdmin([
    selectItem.value.id,
    selectItem.value.data.belongId
  ])
}

const checkList = reactive<any>([])
const selectionChange = (val: any) => {
  checkList.value = val
}

const company = ref<any>({})
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
    prop: 'code',
    label: '账号',
  },
  {
    prop: 'name',
    label: '昵称',
    name: 'name',
  },
  {
    prop: 'team.name',
    label: '姓名',
    name: 'teamName',
  },
  {
    prop: 'team.code',
    label: '手机号',
    name: 'teamCode',
  },
  {
    prop: 'team.remark',
    label: '座右铭',
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
const router = useRouter()
// 表格展示数据
const diyTable = ref(null)
// 加载用户
const getUsers = async () => {
  if(selectItem.value?.data){
    const data = selectItem.value?.data
    const backData =  await departmentServices.getUser(data)
    if(backData.result){
      users.value =backData.result;
      diyTable.value.state.page.total = backData.total
    }else{
      users.value =[];
      diyTable.value.state.page.total = 0
    }
  }
}

const friendDialog = ref<boolean>(false)
const closeDialog = () => {
  friendDialog.value = false;
}
type arrList = {
  id: string
}
const checksSearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    });
    pullPerson(arr)
  } else {
    friendDialog.value = false;
  }
}
const checksCompanySearch = (val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    });
    assign(arr)
  } else {
    assignDialog.value = false;
  }
}

//邀请加入单位
const pullPerson = async (arr: any) => {
  const data =  await departmentServices.pullPerson(selectItem.value.id,arr)
  if (data) {
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
    getUsers()
    friendDialog.value = false;
  }
}
const handleUpdate = (page: any) => {
  //  page.currentPage
  //  page.pageSize
  getUsers()
}

//查看申请
const viewApplication = (row: any) => {
  router.push({ path: '/cardDetail', query: { type: 1, id: selectItem.value.id } })
}

// 移除
const removeFrom = async (row: any) => {
  let rowObj = {
    name:row.name,
    id:row.id,
    typeName:selectItem.value.data.typeName
  }
  const data =  await departmentServices.removePerson(rowObj,selectItem.value.data.id)
  if(data){
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    getUsers()
  }
}


const assignDialog = ref<boolean>(false)
const hideAssignDialog = () => {
  assignDialog.value = false
}

const showAssignDialog = () => {
  assignDialog.value = true
}


// 分配人员
const assign = (arr: any) => {
  const userIds = arr
  if (selectItem.value?.data?.typeName == '部门') {
    assignDepartment(selectItem.value.id, userIds)
  } else if (selectItem.value?.data?.typeName == '工作组') {
    assignJob(selectItem.value.id, userIds)
  }
}

//分配部门
const assignDepartment =  async (id:string, targetIds: string[]) => {
  const data = await departmentServices.assignDepartment(id,targetIds)
  if(data){
    ElMessage({
      message: '分配成功',
      type: 'success'
    })
    hideAssignDialog()
    getUsers()
  }
}
//分配工作组
const assignJob = async (id: string, targetIds: string[]) => {
  const data = await departmentServices.assignJob(id,targetIds)
  if(data){
    ElMessage({
      message: '分配成功',
      type: 'success'
    })
    hideAssignDialog()
    getUsers()
  }
}
const cardHeight = ref(null)
const tableHeight = ref<number>(100)
onMounted(() => {
  getUsers()
})
watch(()=> selectItem.value, (newValue)=> {
  getUsers()
})

</script>

<style lang='scss' scoped>
.card {
  height: 100%;
  width: 100%;
  // background-color: #fff;

  .header {
    display: flex;

    .title {
      text-align: left;
      font-size: 16px;
      width: 50%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
    }

    .box-btns {
      text-align: right;
      padding-right: 14px;
      padding-bottom: 10px;
      width: 50%;
    }
  }

  .search {
    width: 50%;
  }
}
.el-dropdown-link{
  padding: 2px 10px;
  cursor: pointer;
  border-radius: 10px;
  }
  .el-dropdown-link:hover{
  background:#1642cb;
  color: #fff;
  }
  .btn-check{
    padding: 8px 16px;
    color: #154ad8;
  }
  .btn-check:hover{
      background: #154ad8;
      color: #fff;
      padding: 8px  16px;
  }
.table-tabs{
  width: 500px;
  .el-menu--horizontal{
    border: 0;
  }
  .el-menu-item{
    padding: 0;
    margin-right: 16px;
    margin-bottom: 3px;
    border: 0 !important;
  }
  .is-active{
    background: #fff;
  }
  .is-active::after{
    content:'';
    position: absolute;
    left: 0;
    margin-left: calc(50% - 9px);
    bottom: 25%;
    width:18px;
    border-radius: 5px;
    height: 2px;
    background: #154ad8;
  }
  .el-menu--horizontal:hover, .el-menu-item:hover{
    background: #fff;
  }
}
</style>
