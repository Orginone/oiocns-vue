<template>
  <div class="card" ref="cardHeight">
    <div class="header">
      <div class="title">{{props.selectItem.label}}</div>
      <div class="box-btns">
        <div v-if="props.selectItem?.data?.typeName == '单位'">
          <el-button small link type="primary" v-if="allowEdit()" @click="friendDialog = true">添加成员</el-button>
          <el-button small link type="primary" v-if="allowEdit()" @click="viewApplication">查看申请</el-button>
        </div>
        <div v-if="props.selectItem?.data?.typeName == '部门' || props.selectItem?.data?.typeName == '工作组'">
          <el-button small link type="primary" v-if="allowEdit()" @click="showAssignDialog">分配人员</el-button>
        </div>
      </div>
    </div>
    <div :style="{height:tableHeight-20+'px'}">
      <div style="width: 100%; height: 100%">
        <DiyTable ref="diyTable" :hasTableHead="false" :tableData="users" :checkList="[]" @handleUpdate="handleUpdate"
          :tableHead="tableHead">
          <template #operate="scope">
            <div v-if="props.selectItem?.data?.typeName == '单位'">
              <el-button link type="danger" v-if="props?.selectItem?.data?.belongId != scope.row.id && allowEdit()"
                size="small" @click="removeFrom(scope.row)">操作离职</el-button>
            </div>
            <div
              v-if="allowEdit()&&(props.selectItem?.data?.typeName == '部门' || props.selectItem?.data?.typeName == '工作组')">
              <el-button link type="danger" size="small" @click="removeFrom(scope.row)">移除成员</el-button>
            </div>
          </template>
        </DiyTable>
      </div>
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

const props = defineProps<{
  selectItem: any,     // 节点数据
  tabHeight: any,
}>()

const allowEdit = () => {
  return authority.IsRelationAdmin([
    props.selectItem.id,
    props.selectItem.data.belongId
  ])
}

const company = ref<any>({})

const tableHead = ref([
  {
    prop: 'code',
    label: '账号',
    width: '180',
  },
  {
    prop: 'name',
    label: '昵称',
    width: '200',
    name: 'name',
  },
  {
    prop: 'team.name',
    label: '姓名',
    width: '200',
    name: 'teamName',
  },
  {
    prop: 'team.code',
    label: '手机号',
    width: '200',
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
const router = useRouter()
// 表格展示数据


const diyTable = ref(null)
// 加载用户
const getUsers = async () => {
  if(props.selectItem?.data){
    const data = props.selectItem?.data
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
  const data =  await departmentServices.pullPerson(props.selectItem.id,arr)
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
  router.push({ path: '/cardDetail', query: { type: 1, id: props.selectItem.id } })
}

// 移除
const removeFrom = async (row: any) => {
  let rowObj = {
    name:row.name,
    id:row.id,
    typeName:props.selectItem.data.typeName
  }
  const data =  await departmentServices.removePerson(rowObj,props.selectItem.data.id)
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
  if (props.selectItem?.data?.typeName == '部门') {
    assignDepartment(props.selectItem.id, userIds)
  } else if (props.selectItem?.data?.typeName == '工作组') {
    assignJob(props.selectItem.id, userIds)
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

watch(props, () => {
  getUsers()
  setTimeout(() => {
    let headerHeight = cardHeight.value?.clientHeight
    tableHeight.value = headerHeight
  }, 100);
});
watch(props.tabHeight, () => {
  let headerHeight = cardHeight.value?.clientHeight
  tableHeight.value = headerHeight
});

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
</style>
