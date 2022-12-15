<template>
  <div class="content box">
    <div class="info" ref="infoWrap">
      <Info ref="info" />
    </div>
    <div class="body" ref="bodyWrap">
      <div class="body-tabs">
        <el-menu
        :default-active="tableActiveIndex"
        mode="horizontal"
      >
        <el-menu-item index="1">部门成员</el-menu-item>
        <el-menu-item index="2">部门应用</el-menu-item>
      </el-menu>
      <hr >
      </div>
      <diytab
        :style="{ width: '100%' }"
        ref="diyTable"
        :hasTabs="true"
        :tableName="store?.currentSelectItme?.label ?? ''"
        :hasTitle="true"
        :hasTableHead="true"
        :tableData="tableData"
        :options="options"
        :total="pageStore.total"
        @handleUpdate="handleUpdate"
        @selectionChange="selectionChange"
        :tableHead="tableHead"
      >
        <template #slot-tabs>
          <div class="table-tabs">
            <el-menu
              :default-active="tableActiveIndex2"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="1">全部</el-menu-item>
              <el-menu-item index="2">已开通</el-menu-item>
              <el-menu-item index="3">未开通</el-menu-item>
            </el-menu>
          </div>
        </template>
        <template #buttons>
          <el-button class="btn-check" type="primary" link @click="handleShare()">分享部门</el-button>
          <el-button v-if="checkList.length" @click="setPost('', 1)" class="btn-check" type="primary" link>岗位设置</el-button>
          <el-button class="btn-check" type="primary" link @click="showAssignDialog">添加成员</el-button>
          <el-button class="btn-check" type="primary" link @click="viewApplication">查看申请</el-button>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="reviseInfo(scope.row)">修改信息</el-dropdown-item>
                <el-dropdown-item @click="changeDepartment(scope.row)">变更部门</el-dropdown-item>
                <el-dropdown-item @click="setPost(scope.row, 2)">岗位设置</el-dropdown-item>
                <el-dropdown-item @click="showDiong">停用</el-dropdown-item>
                <el-dropdown-item @click="removeFrom(scope.row)" style="color: #f67c80">移出成员</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #slot-card>
          <!-- <card></card> -->
        </template>
      </diytab>
    </div>
  </div>
  <el-dialog v-model="deptDialogVisible" title="请录入部门信息" width="30%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="部门名称" style="width: 100%">
        <el-input v-model="formData.teamName" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="部门简称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="部门编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="部门标识" style="width: 100%">
        <el-input v-model="formData.teamCode" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="部门简介" style="width: 100%">
        <el-input v-model="formData.teamRemark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createDept">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="jobDialogVisible" title="请录入工作组信息" width="40%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="工作组名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="工作组编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="工作组简介" style="width: 100%">
        <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createJob">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="personDialogVisible" title="修改信息" width="40%" append-to-body @close="dialogHide">
    <el-form
      label-position="top"
      label-width="100px"
      :model="personFormData"
    >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="账号" style="width: 100%">
          <el-input disabled v-model="personFormData.code" placeholder="请输入账号" clearable style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="昵称" style="width: 100%">
          <el-input v-model="personFormData.name" placeholder="请输入昵称" clearable style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名" style="width: 100%">
          <el-input v-model="personFormData.teamName" placeholder="请输入姓名" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号" style="width: 100%">
          <el-input v-model="personFormData.teamCode" placeholder="请输入手机号" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="其他信息" style="width: 100%">
          <el-input v-model="personFormData.remark" placeholder="请输入" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="personUpdate">完成</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="createDeptDialogVisible"
    title="变更部门"
    width="30%"
    append-to-body
    @close="dialogHide"
  >
    <el-form
      label-position="top"
      label-width="100px"
      :model="personFormData"
    >
      <el-form-item label="人员名称" style="width: 100%">
        <el-input disabled v-model="currentData.team.name" />
      </el-form-item>
      <el-form-item label="所属部门" style="width: 100%">
        <el-tree-select
          v-model="formData.parentId"
          :data="cascaderTree"
          check-strictly
          @node-click="handleSelectTree(_, $event)"
          :render-after-expand="false"
          style="width: 100%"
          :default-expand-all="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="editDept">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="setPostDialogVisible"
    title="岗位设置"
    width="40%"
    append-to-body
    @close="dialogHide"
  >
    <el-form
      label-position="top"
      label-width="100px"
      :model="personFormData"
    >
      <el-form-item label="岗位" style="width: 100%">
        <el-select
          v-model="postValue"
          placeholder="请选择岗位"
          style="width: 100%"
        >
          <el-option
            v-for="item in postOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="addPost">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog customClass="QrDialog" v-model="dialogVisible" title="邀请加入部门" width="30%">
    <p>方式一：分享二维码，邀请加入部门</p>
    <div class="QrDiv" :key="store?.currentSelectItme?.id">
      <QrCodeCustom :qrText="store?.currentSelectItme?.label ?? ''" />
    </div>
    <p>方式二：分享到群组，邀请加入部门</p>
    <div class="share-link">分享到群组...</div>
    <template #footer>
      <span>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <CreateTeamModal 
    :title="activeModal"
    :visible="visible"
    :current="store.currentSelectItme?.intans || USERCTRL.company"
    :typeNames="createOrEdit?.split('|')"
  />
  <AssignedPerson v-if="assignDialog" :checkList='tableData' :id="company.id" :selectLimit='0' :serachType='5'
    @closeDialog="hideAssignDialog" @checksSearch='checksCompanySearch' />
</template>
<script lang="ts" setup>
// @ts-nocheck
import Info from "./components/info.vue";
import diytab from "@/components/diyTable/index.vue";
import $services from '@/services'
import { ref, onMounted, getCurrentInstance, onBeforeMount } from "vue";
import { useRouter } from 'vue-router'
import AssignedPerson from '@/components/searchs/index.vue'
import { setCenterStore } from '@/store/setting'
const store = setCenterStore()
import identityServices from '@/module/relation/identity'
const IdentityServices = new identityServices()
import QrCodeCustom from '@/components/qrCode/index.vue'
import {TargetType, USERCTRL} from '@/ts/coreIndex'
import CreateTeamModal from '../GlobalComps/createTeam.vue';

const activeModal = ref('')
const createOrEdit = ref()
const visible = ref(false)
let cascaderTree = ref<OrgTreeModel[]>([])
const router = useRouter()

const subscribe = store.$subscribe(
  (mutation, state) => {
    /*
      * mutation主要包含三个属性值：
      *   events：当前state改变的具体数据，包括改变前的值和改变后的值等等数据
      *   storeId：是当前store的id
      *   type：用于记录这次数据变化是通过什么途径，主要有三个分别是
      *         “direct” ：通过 action 变化的
                ”patch object“ ：通过 $patch 传递对象的方式改变的
                “patch function” ：通过 $patch 传递函数的方式改变的
      *
      * */
    // 在此处监听store中值的变化，当变化为某个值的时候，做一些业务操作
    if(state.currentSelectItme.label === '部门管理') return
    getUsers(store.currentSelectItme?.intans)
  },
  { detached: false }
    // detached:布尔值，默认是 false，正常情况下，当订阅所在的组件被卸载时，订阅将被停止删除，
    // 如果设置detached值为 true 时，即使所在组件被卸载，订阅依然在生效
)

let deptDialogVisible = ref<boolean>(false)
let jobDialogVisible = ref<boolean>(false)
let personDialogVisible = ref<boolean>(false)
let createDeptDialogVisible = ref<boolean>(false)
let setPostDialogVisible = ref<boolean>(false)
let formData = ref<any>({})
let personFormData = ref<any>({
  id: '',
  code: '', // 账号
  name: '', // 昵称
  thingId: '',
  teamName: '', // 姓名
  teamCode: '', // 手机号
  teamRemark: '' // 其他信息
})
let currentData = ref<any>({}) 
//关闭弹窗清空
const dialogHide = () => {
  formData.value = { parentId: store.currentSelectItme?.id }
  deptDialogVisible.value = false
  jobDialogVisible.value = false
  personDialogVisible.value = false
  createDeptDialogVisible.value = false
  setPostDialogVisible.value = false
}
let isUnit = ref<boolean>(true)
// 创建部门
const createDept = async() => {
  const data = {
    avatar:undefined,
    typeName:"部门",
    ...formData.value
  }
  // 单位创建部门 Or 部门下创建部门
  const unitOrdeptApi = isUnit.value ? USERCTRL.company : store.currentSelectItme?.intans
  // 单位创建部门
  if (await unitOrdeptApi.create(data)) {
    ElMessage.success('创建成功!')
    dialogHide()
    proxy?.$Bus.emit('refreshNav')
  }
}

// 分享集团
const dialogVisible = ref(false)
const handleShare = () => {
  dialogVisible.value = true
}

// 岗位设置
const postOptions = ref([])
const postValue = ref('')
const getPostList = () => {
  setCenterStore().GetIdentities().then((treeData)=> {
    postOptions.value = treeData ?? []
    console.log('treeData: ', treeData);
  })
}
// 设置岗位type 1：多选设置岗位  2：人员列表设置岗位
const setPostType = ref(1)
// 设置岗位
const setPost = (row: any, type: number) => {
  setPostType.value = type
  formData.value = { parentId: store.currentSelectItme?.id }
  if(type==2) currentData.value = row
  setPostDialogVisible.value = true
}
// 给人员岗位
const addPost = async () => {
  let userIds = []
  if(setPostType.value === 1) {
    userIds = checkList.value.map((u: any) => u.id)
  } else {
    userIds = [currentData?.value?.id]
  }
  const data = await IdentityServices.giveIdentity(postValue.value, userIds)
  if (data) {
    ElMessage({
      message: '分配成功',
      type: 'success'
    })
    dialogHide()
  }
}

let newDept = ref()

const handleSelectTree = (_: any, info: {intans: any}) => {
  newDept.value = info?.intans
}
// 变更部门
const editDept = async ()=> {
  if(formData.value?.parentId === store.currentSelectItme?.value) {
    dialogHide()
    return
  }
  if (newDept.value) {
    if (await store.currentSelectItme.intans?.removeMember(currentData.value)) {
      if (await newDept.value.pullMember(currentData.value)) {
        ElMessage({ message: '操作成功',type: 'success' })
        getUsers(store.currentSelectItme?.intans)
        dialogHide()
      } else {
        return false;
      }
    }
  }
}

// 加载单位
const loadOrgTree = () => {
  $services.company.getCompanyTree({}).then((res: any)=>{
    const orgTree = []
    orgTree.push(res.data)
  })
}

function getSelectTree() {
  store.loadTreeData(false).then((res: any[]) => {
    cascaderTree.value = res
  })
}

// 过滤掉工作组作为表单级联数据
const filter = (nodes: OrgTreeModel[]): OrgTreeModel[] => {
  nodes = nodes.filter(node => node.data?.typeName !== '工作组')
  for (const node of nodes) {
    node.children = filter(node.children)
  }
  return nodes;
}
// 创建工作组
const createJob = () => {
  $services.company.createJob({
    data: {
      id: formData.value.id,
      code: formData.value.code,
      name: formData.value.name,
      parentId: store.currentSelectItme?.id,
      teamName: formData.value.name,
      teamRemark: formData.value.remark
    }
  }).then((res: ResultType) => {
    if (res.success) {
      dialogHide()
      ElMessage({
        message: res.msg,
        type: 'success'
      })
      proxy?.$Bus.emit('refreshNav')
    } else {
      ElMessage({
        message: res.msg,
        type: 'error'
      })
    }
  })
}
const personUpdate = () => {
  const {id, code, name, thingId, teamName, teamCode, teamRemark } = personFormData.value
  $services.person
    .update({
      data: { id, code, name, thingId, teamName, teamCode, teamRemark }
    })
    .then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        getUsers(store.currentSelectItme?.intans)
        ElMessage({
          message: '更新成功',
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'warning'
        })
      }
    })
  }

const assignDialog = ref<boolean>(false)
const hideAssignDialog = () => {
  assignDialog.value = false
}
const showAssignDialog = () => {
  assignDialog.value = true
}

const checksCompanySearch = async(val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    });
    const current = store.currentSelectItme?.intans
    if (await current.pullMembers(arr, TargetType.Person)) {
       ElMessage({
        message: '分配成功',
        type: 'success'
      })
      hideAssignDialog()
      getUsers(store.currentSelectItme?.intans)
    }
  } else {
    assignDialog.value = false;
  }
}

// 加载用户
const getUsers = async (currentData?: any) => {
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

//查看申请
const viewApplication = (row: any) => {
  router.push({ path: '/service/company', query: { type: 1, id: store.currentSelectItme?.id } })
}
// 修改信息
const reviseInfo = (row: any) => {
  personFormData.value.id = row.id
  personFormData.value.code = row.code
  personFormData.value.name = row.name
  personFormData.value.thingId = row.thingId
  personFormData.value.teamName = row.team?.name
  personFormData.value.teamCode = row.team?.code
  personFormData.value.teamRemark = row.team.remark
  personDialogVisible.value = true
}

// 变更部门
const changeDepartment = (row: any) => {
  formData.value = { parentId: store.currentSelectItme?.value }
  currentData.value = row
  createDeptDialogVisible.value = true
}

// 移除人员
const removeFrom = async (row: any) => {
  if(await store.currentSelectItme.intans?.removeMember(row)) {
    ElMessage({ message: '移出成功',type: 'success' })
    getUsers(store.currentSelectItme?.intans)
  }
}

const { proxy } = getCurrentInstance()

proxy?.$Bus.on('clickBus', (id) => {
  if(id === '2201') { // 部门创建子部门
    isUnit.value = false
    deptDialogVisible.value = true
  } else if(id === '2202') { // 创建工作组
    jobDialogVisible.value = true
  } else if(id === '2203') {  // 单位创建部门
    isUnit.value = true
    // activeModal.value = '新建'
    // visible.value = true
    deptDialogVisible.value = true
    // createOrEdit.value = '新建|' + USERCTRL.company.subTeamTypes.join('|');
  }
})

const company = ref<any>({})

// 表格展示数据
const pageStore = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})
const tableActiveIndex = ref<string>('1'); //table nav index
const tableActiveIndex2 = ref<string>('1');
const tableData = ref([])
const options = ref<any>({
  checkBox: true,
  order: true,
  defaultSort: { prop: 'createTime', order: 'descending' },
})
const tableHead = ref([
  {
    prop: 'code',
    label: '账号',
  },
  {
    prop: 'name',
    label: '昵称',
    name: 'name'
  },
  {
    prop: 'team.name',
    label: '姓名',
    name: 'teamName'
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
  remoteMethod()
}
const checkList = ref<any>([])
const selectionChange = (val: any) => {
  checkList.value = val
}
//获取单位信息
onMounted(() => {
  getPostList()
  loadOrgTree()
  getSelectTree()
})
// 获取单位信息
onBeforeMount(()=> {
  store.GetDepartmentInfo()
})
</script>
<style lang="scss" scoped>
  .QrDialog {
    .txt {
      margin: 0 0 10px 15px;
      text-align: center;
    }
    .QrDiv {
      text-align: center;
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
  .content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 3px 0;
    box-sizing: border-box;
    .info {
      padding: 0 0 3px 0;
      box-sizing: border-box;
    }
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
      .body-tabs {
        margin: 0px 20px;
        margin-top: 10px;
        position: relative;
        hr {
          position: absolute;
          width: 100%;
          border-top: none;
          border-left: none;
          margin-top: -3px;
          border-bottom: solid 3px var(--el-menu-border-color);
        }
        .el-menu-item {
          margin-right: 20px;
          padding: 0;
        }
        .el-menu--horizontal{
          border: 0;
          // border-bottom: solid 3px var(--el-menu-border-color);
          height: 40px;
        }
        .is-active{
          background: #fff;
          z-index: 2;
          border-bottom: 3px solid var(--el-menu-active-color);
        }
        .el-menu--horizontal:hover, .el-menu-item:hover{
          background: #fff;
        }
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
    }
  }
</style>
