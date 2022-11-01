<template>
    <div class="card">
      <div class="header">
        <div class="title">部门维护</div>
        <div class="box-btns">
          <el-button  type="default" @click="goback">返回</el-button>
        </div>
      </div>
      <div>
        <el-table
          :data="orgTree"
          :header-cell-style="{ 'background': 'var(--el-color-primary-light-9)' }"
          stripe
          row-key="id"
          :border="true"
          lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
          class="table"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column prop="label" label="名称" width="330"/>
          <el-table-column prop="data.code" label="编码" width="230"/>
          <el-table-column prop="data.typeName" label="类型"  width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.data.typeName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="data.teamRemark" label="描述">
            <template #default="scope">
              <el-tooltip :content="scope.row.remark" placement="bottom" effect="light">
                <template #content>
                  <div class="tooltip-text" style="width: 400px; max-height: 300px; overflow-y: auto;">{{scope.row.data.teamRemark}}</div>
                </template>
                <div class="remark-text">
                {{scope.row.data.teamRemark}}
                </div>
              </el-tooltip>
            </template>

          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <div class="cell-box">
                <el-dropdown :disabled="row.data.typeName =='工作组'">
                  <el-button link type="primary" size="small" v-if="(row.data.typeName != '工作组' && authority.IsSpaceRelationAdmin())">新增</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="create(row, '部门')">
                        <el-icon class="el-icon--right">
                          <plus />
                        </el-icon>
                        新增部门
                      </el-dropdown-item>
                      <el-dropdown-item @click="create(row, '工作组')">
                        <el-icon class="el-icon--right">
                          <plus />
                        </el-icon>
                        新增工作组
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button link type="primary" size="small" v-if="(row.data.typeName != '单位' && authority.IsSpaceRelationAdmin())" @click="edit(row)">编辑</el-button>
                <el-button link type="danger" size="small" style="margin-left:0" @click="handleDel(row)" v-if="(row.data.typeName != '单位' && authority.IsSpaceRelationAdmin())">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
<!-- ===============================================部门表单===================================== -->
  <el-dialog
    v-model="createDeptDialogVisible"
    title="请录入部门信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="部门名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="部门编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader
          :props="cascaderProps"
          :options="cascaderTree"
          v-model="formData.parentId"
          style="width: 100%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="部门简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createDept">确认</el-button>
      </span>
    </template>
  </el-dialog>


  <el-dialog
    v-model="editDeptDialogVisible"
    title="请编辑部门信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="部门名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="部门编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader
          :props="cascaderProps"
          :options="cascaderTree"
          v-model="formData.parentId"
          style="width: 100%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="部门简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="editDept">确认</el-button>
      </span>
    </template>
  </el-dialog>

<!-- ===============================================工作组表单===================================== -->
  <el-dialog
    v-model="createJobDialogVisible"
    title="请录入工作组信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="工作组名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="工作组编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable  style="width: 100%"/>
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader
          :props="cascaderProps"
          :options="cascaderTree"
          v-model="formData.parentId"
          style="width: 100%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="工作组简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createJob">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editJobDialogVisible"
    title="请编辑工作组信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="工作组名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%"/>
      </el-form-item>
      <el-form-item label="工作组编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable  style="width: 100%"/>
      </el-form-item>
      <el-form-item label="上级节点" style="width: 100%">
        <el-cascader
          :props="cascaderProps"
          :options="cascaderTree"
          v-model="formData.parentId"
          style="width: 100%"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="工作组简介" style="width: 100%">
        <el-input
          v-model="formData.teamRemark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="editJob">确认</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup>
  import { ref, onMounted} from 'vue'
  import $services from '@/services'
  import { ElMessage,ElMessageBox } from 'element-plus';
  import { useRouter } from 'vue-router';
  import authority from '@/utils/authority'

  const router = useRouter()
  let createDeptDialogVisible = ref<boolean>(false)
  let editDeptDialogVisible = ref<boolean>(false)
  let createJobDialogVisible = ref<boolean>(false)
  let editJobDialogVisible = ref<boolean>(false)

  let formData = ref<any>({})

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    emitPath: false,
  }

  let orgTree = ref<OrgTreeModel[]>([])
  let cascaderTree = ref<OrgTreeModel[]>([])

  // 加载单位
  const loadOrgTree = () => {
    $services.company.getCompanyTree({}).then((res: any)=>{
      orgTree.value = []
      orgTree.value.push(res.data)
      cascaderTree.value = filter(JSON.parse(JSON.stringify(orgTree.value)))
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

  // 返回
  const goback = () => {
    router.go(-1)
  }

  // 新增
  const create = (row: any, type: string) =>{
    formData.value = {parentId: row.id}
    if(type == '工作组'){
      createJobDialogVisible.value = true;
    } else {
      createDeptDialogVisible.value = true;
    }
  }

  // 编辑
  const edit = (row: any) =>{
    if(row.data.typeName == '工作组'){
      editJobDialogVisible.value = true;
    } else {
      editDeptDialogVisible.value = true;
    }
    const obj = row.data;
    formData.value.parentId = row.id
    formData.value = {...formData.value, ...obj}
  }

  // 删除行
  const handleDel = (row: any) =>{
    let title: string;
    title = `确定把 ${row.data.name} 移除吗？`
    ElMessageBox.confirm(
      title,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      if(row.data.typeName == '部门'){
        deleteDept(row)
      } else {
        deleteJob(row)
      }
    })
    .catch(() => {
    })
  }

  // 删除部门
  const deleteDept = async (row: any) =>{
    const { success } = await $services.company.deleteDepartment({data: {id: row.id}})
    if (success) {
      ElMessage({
        message: '删除成功!',
        type: 'success'
      })
      loadOrgTree()
    } else {
      ElMessage({
        message: '删除失败!',
        type: 'error'
      })
    }
  }

  // 删除工作组
  const deleteJob = async (row: any) =>{
    const { success } = await $services.company.deleteJob({data: {id: row.id}})
    if (success) {
      ElMessage({
        message: '删除成功!',
        type: 'success'
      })
      loadOrgTree()
    } else {
      ElMessage({
        message: '删除失败!',
        type: 'error'
      })
    }
  }

  //关闭弹窗清空
  const dialogHide = () => {
    formData.value = {}
    createDeptDialogVisible.value = false
    editDeptDialogVisible.value = false
    createJobDialogVisible.value = false
    editJobDialogVisible.value = false
  }

  // 创建部门
  const createDept = () => {
    $services.company.createDepartment({
      data: {
        id: formData.value.id,
        code: formData.value.code,
        name: formData.value.name,
        parentId: formData.value.parentId,
        teamName: formData.value.name,
        teamRemark: formData.value.teamRemark
      }
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  }

  // 编辑部门
  const editDept = ()=>{
    $services.company.updateDepartment({
      data: formData.value
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  }

  // 创建工作组
  const createJob  = () => {
    $services.company.createJob({
      data: {
        id: formData.value.id,
        code: formData.value.code,
        name: formData.value.name,
        parentId: formData.value.parentId,
        thingId: formData.value.thingId,
        teamName: formData.value.name,
        teamRemark: formData.value.teamRemark
      }
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  }

  // 编辑工作组
  const editJob = ()=>{
    $services.company.updateJob({
      data: formData.value
    }).then((res: ResultType) => {
      if (res.success) {
        dialogHide()
        loadOrgTree()
        ElMessage({
          message: res.msg,
          type: 'success'
        })
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        })
      }
    })
  }

  // 获取树
  onMounted(() => {
    loadOrgTree()
  })
</script>

<style lang="scss" scoped>

.card {
  // height: 100%;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  margin: 10px;
  padding: 20px;
  .cell-box{
    display: flex;
    align-items: center;
  }
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

  .table {
    width: 100%;
    height: calc(100vh - 150px);
  }
  .remark-text{
    white-space: nowrap;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
