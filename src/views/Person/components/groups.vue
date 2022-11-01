<template>
  <div class="created">
    <div class="createdTop">
      <div class="topLeft">
        <!-- <el-input class="search" placeholder="搜索单位名" :suffix-icon="Search" />-->
      </div> 
      <div class="topRight">
        <el-button type="primary" @click="create"> 创建集团</el-button>
        <el-button type="primary" @click="friendShow"> 申请加入集团</el-button>
      </div>
    </div>
    <div class="createdBody">
      <DiyTable
      class="diytable"
      ref="diyTable"
      :hasTableHead="false"
      @handleUpdate="handleUpdate"
      :tableData="tableData"
      :tableHead="tableHead"
      >
      <template #option="scope">
        <el-button link type="danger"  @click="handleDelete(scope.row.id)">删除</el-button>
        <el-button link type="danger" @click="handleExit(scope.row.id)">退出</el-button>
      </template>
      </DiyTable>
    </div>
    <el-dialog v-model="dialogVisible" title="提示" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="集团名称">
          <el-input v-model="form.teamName" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团编码">
          <el-input v-model="form.code" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团简称">
          <el-input v-model="form.name" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团代码">
          <el-input v-model="form.teamCode" style="width: 80%" />
        </el-form-item>
        <el-form-item label="集团简介">
          <el-input v-model="form.teamRemark" style="width: 80%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <searchGroup v-if="friendDialog" :serachType="4" @closeDialog="closeDialog"  @checksSearch='checksSearch'></searchGroup>
  </div>
</template>
<script lang="ts" setup>
  import $services from '@/services'
  import { onMounted, ref,reactive } from 'vue'
  import { useUserStore } from '@/store/user'
  import { ElMessage ,ElMessageBox} from 'element-plus'
  import searchGroup from '@/components/searchs/index.vue'
  import DiyTable from '@/components/diyTable/index.vue'
  import {chat} from '@/module/chat/orgchat'
  import authority from '@/utils/authority'

  const store = useUserStore()
  const tableData = ref([])
  const diyTable = ref(null)
  const tableHead = ref([
    {
      prop: 'name',
      label: '集团名称',
      name: 'name'
    },
    {
      prop: 'code',
      label: '集团编码',
      name: 'code'
    },
    {
      prop: 'team.name',
      label: '集团简称',
      name: 'teamName'
    },
    {
      prop: 'team.code',
      label: '集团代号',
      name: 'teamCode'
    },
    {
      prop: 'identitys',
      label: '我的岗位',
      name: 'identitys',
      width: '200'
    },
    {
      prop: 'createUser',
      label: '创建人',
      name: 'createUser'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      name: 'createTime'
    },
    {
      prop: 'team.remark',
      label: '简介',
      name: 'teamRemark',
      width: '300'
    },
    {
      type:'slot',
      prop: 'option',
      label: '操作',
      name: 'option'
    }
  ])
  let dialogVisible = ref(false)
  // 表格展示数据
  const pageStore = reactive({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const handleUpdate = (page: any)=>{
    pageStore.currentPage = page.currentPage
    pageStore.pageSize = page.pageSize
    fetchRequest()
  }

  const form = reactive({
    name: '',
    code: '',
    teamName: '',
    teamCode: '',
    teamRemark: ''
  })
  const handleExit = (id: string) => {
    ElMessageBox.confirm(
    '确定退出吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    $services.company
    .exitGroup({
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
      fetchRequest()
      }
    })
  })
  }
  const handleDelete = (id: any) => {
    ElMessageBox.confirm(
    '确定删除吗',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    let token = sessionStorage.getItem('TOKEN')
    $services.company
      .deleteGroup({
        data: {
          id: id
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    })
  }
  const create = () => {
    dialogVisible.value = true
    // console.log(dialogVisible)
  }
  const save = () => {
    $services.company
      .createGroup({
        data: {
          name: form.name,
          code: form.code,
          belongId: store.workspaceData.id,
          teamName: form.teamName,
          teamCode: form.teamCode,
          teamRemark: form.teamRemark
        }
      })
      .then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '创建成功',
            type: 'success'
          })
          dialogVisible.value = false
          fetchRequest()
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }

  onMounted(() => {
    fetchRequest()
  })

  async function fetchRequest() {
    const { data, success } = await $services.company.companyGetGroups({
      data: {
        offset: (pageStore.currentPage-1)*pageStore.pageSize,
        limit: pageStore.pageSize
      },
    })
    if (success) {
      data.result.forEach((item:any)=>{
        let name = chat.getName(item.createUser)
        if(name && name.length > 0){
          item.createUser = name
        }
        item.identitys = authority.GetTargetIdentitys(item.id)
      })
      tableData.value = data.result
      pageStore.total = data.total
      diyTable.value.state.page.total = data.total;
    }else{
      pageStore.total = 0
      diyTable.value.state.page.total = 0;
    }
  }
  const addGroupFun = (arr:any) => {
    $services.company
      .applyJoinGroup({
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
  const friendDialog = ref<boolean>(false)

  const closeDialog = ()=>{
    friendDialog.value = false;
  }
  const friendShow = ()=>{
    friendDialog.value = true;
  }
  type arrList = {
    id:string
  }
  const checksSearch=(val:any)=>{
  if(val.value.length>0){
    let arr:Array<arrList> =[]
    val.value.forEach((element:any) => {
      arr.push(element.id)
    });
    addGroupFun(arr)
  }else{
    friendDialog.value = false;
  }
}
</script>
<style lang="scss">
  .created {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    height: 100%;
    .createdTop {
      width: 100%;
      padding: 20px;
      display: flex;
      justify-content: space-between;
    }
    .createdBody {
      height: calc(100vh - 220px);
      max-height: 1000px;
      padding: 6px;
    }
    .createdBottom {
      position: absolute;
      right: 30px;
      bottom: 30px;
    }
  }
</style>
