<template>
  <div class="content box">
    <div class="info" ref="infoWrap">
      <Info ref="info" />
    </div>
    <div class="body" ref="bodyWrap">
      <div class="body-tabs">
        <!-- <el-menu
          :default-active="tableActiveIndex"
          mode="horizontal"
        >
          <el-menu-item index="1">部门成员</el-menu-item>
          <el-menu-item index="2">部门应用</el-menu-item>
        </el-menu> -->
      <!-- <hr > -->
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
        <!-- <template #slot-tabs>
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
        </template> -->
        <template #buttons>
          <el-button class="btn-check" type="primary" link @click="handleShare()">分享部门</el-button>
          <el-upload
            ref="uploadRef"
            :show-file-list="false"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :auto-upload="false"
          >
          <template #trigger>
            <el-button class="btn-check" link type="primary" @click="uploadExcel">导入成员</el-button>
          </template>
          </el-upload>
          <el-button v-if="checkList.length" @click="setPost('', 1)" class="btn-check" type="primary" link>岗位设置</el-button>
          <el-button class="btn-check" type="primary" link @click="handleIdentity()">身份设置</el-button>
          <el-button class="btn-check" type="primary" link @click="showGiveDialog">添加成员</el-button>
          <el-button class="btn-check" type="primary" link @click="viewApplication">查看申请</el-button>
        </template>
        <template #operate="scope">
          <el-dropdown>
            <span class="el-dropdown-link"> ··· </span>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item @click="reviseInfo(scope.row)">修改信息</el-dropdown-item> -->
                <el-dropdown-item @click="changeDepartment(scope.row)">变更部门</el-dropdown-item>
                <el-dropdown-item @click="setPost(scope.row, 2)">岗位设置</el-dropdown-item>
                <!-- <el-dropdown-item @click="showDiong">停用</el-dropdown-item> -->
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
            :key="item.key"
            :label="item.label"
            :value="item.key"
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
    v-model:visible="visible"
    :current="store.currentSelectItme?.intans || userCtrl.company"
    v-model:typeNames="createOrEdit"
    :handleCancel="handleCancel()"
    @handleOk="handleOk"
  />
  <AssignedPerson v-if="assignDialog" :checkList='tableData' :id="company.id" :selectLimit='0' :serachType='5'
    @closeDialog="hideAssignDialog" @checksSearch='checksCompanySearch' />
  <el-dialog v-model="giveDialog" @close="hideGiveDialog" title="添加人员" width="50%">
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
  <identityModal
    v-model:visible="identityVisible"
  />
</template>
<script lang="ts" setup>
// @ts-nocheck
import Info from "./components/info.vue";
import diytab from "@/components/diyTable/index.vue";
import { ref, onMounted, getCurrentInstance, onBeforeMount, computed } from "vue";
import { useRouter } from 'vue-router'
import AssignedPerson from '@/components/searchs/index.vue'
import { setCenterStore } from '@/store/setting'
const store: any = setCenterStore()
import QrCodeCustom from '@/components/qrCode/index.vue'
import {TargetType, userCtrl} from '@/ts/coreIndex'
import CreateTeamModal from '../GlobalComps/createTeam.vue';
import identityModal from './components/identityModal.vue';

const uploadRef = ref()

const identityVisible = ref(false)
// 权限管理
const handleIdentity = ()=> {
  identityVisible.value = true
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
  if (!store.currentSelectItme.intans?.target?.name) {
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
  const personData = await userCtrl.space.loadMembers({
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
// 添加成员
const giveIdentity = async () => {
  const userIds = giveTable?.value?.state?.multipleSelection.map((u: any) => u.id);
  const data = await store.currentSelectItme.intans?.pullMembers(userIds, TargetType.Person)
  if (data) {
    ElMessage({
      message: '添加成功',
      type: 'success'
    })
    hideGiveDialog()
    getUsers(store.currentSelectItme?.intans)
  }
}

const activeModal = ref('')
const createOrEdit = ref()
const visible = ref(false)
const handleCancel = () => {
  // visible.value = true
}
const handleOk = (newItem) => {
  console.log('newItem: ', newItem);
  if(newItem) {
    ElMessage.success('创建成功!')
    visible.value = false
    proxy?.$Bus.emit('refreshNav')
  }
}

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
    // console.log('state.currentSelectItme',state.currentSelectItme,store.currentSelectItme)

    if(state.currentSelectItme){
      if(state.currentSelectItme.label === '部门管理') return
      setTimeout(()=>{
        getUsers(store.currentSelectItme?.intans)
      },500)
    }
    
  },
  { detached: false }
    // detached:布尔值，默认是 false，正常情况下，当订阅所在的组件被卸载时，订阅将被停止删除，
    // 如果设置detached值为 true 时，即使所在组件被卸载，订阅依然在生效
)

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
  personDialogVisible.value = false
  createDeptDialogVisible.value = false
  setPostDialogVisible.value = false
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
  if(!postValue.value) return
  let userIds = []
  if(setPostType.value === 1) {
    userIds = checkList.value.map((u: any) => u.id)
  } else {
    userIds = [currentData?.value?.id]
  }
  const current = postOptions.value.filter((obj: any) => postValue.value === obj.key)
  const data = await current[0].object?.pullMembers(userIds, TargetType.Person)
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
// 待提供接口
const personUpdate = () => {
  const {id, code, name, thingId, teamName, teamCode, teamRemark } = personFormData.value
  // person
  //   .update({
  //     data: { id, code, name, thingId, teamName, teamCode, teamRemark }
  //   })
  //   .then((res: ResultType) => {
  //     if (res.success) {
  //       dialogHide()
  //       getUsers(store.currentSelectItme?.intans)
  //       ElMessage({
  //         message: '更新成功',
  //         type: 'success'
  //       })
  //     } else {
  //       ElMessage({
  //         message: res.msg,
  //         type: 'warning'
  //       })
  //     }
  //   })
  }

const assignDialog = ref<boolean>(false)
const hideAssignDialog = () => {
  assignDialog.value = false
}
const showAssignDialog = () => {
  assignDialog.value = true
}
// 添加成员
const checksCompanySearch = async(val: any) => {
  if (val.value.length > 0) {
    let arr: Array<arrList> = []
    val.value.forEach((element: any) => {
      arr.push(element.id)
    });
    const current = store.currentSelectItme?.intans
    if (await current.pullMembers(arr, TargetType.Person)) {
      getUsers(current)
      ElMessage({
        message: '分配成功',
        type: 'success'
      })
      hideAssignDialog()
    }
  } else {
    assignDialog.value = false;
  }
}

// 加载用户
const getUsers = async(currentData?: any) => {
  if(currentData){
    const backData =  await currentData?.loadMembers({
      filter: "",
      limit: 20,
      offset: 0
    })
    // console.log(backData)
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
    activeModal.value = '新建'
    visible.value = true
    createOrEdit.value = store.currentSelectItme?.intans?.subTeamTypes
  } else if(id === '2203') {  // 单位创建部门
    activeModal.value = '新建'
    visible.value = true
    createOrEdit.value = ((userCtrl.company.subTeamTypes.join('|')).split('|'))
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
    prop: 'team.remark',
    label: '签名',
    name: 'teamRemark'
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
  setTimeout(()=>{
    getPostList()
    getSelectTree()
  },500)
})
// 获取单位信息
onBeforeMount(()=> {
  setTimeout(()=>{
    store.GetDepartmentInfo()
  },500)
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
  :deep .el-table th.el-table__cell {
    background-color: #eceffb!important;
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
      // .btn-check{
      //   padding: 8px 16px;
      //   color: #154ad8;
      // }
      // .btn-check:hover{
      //   background: #154ad8;
      //   color: #fff;
      //   padding: 8px  16px;
      // }
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
