<template>
  <div class="container">
    <div ref="cardHeight">
      <el-card>
        <el-descriptions :title="org?.title + '信息'" :column="2" :border="true">
          <template #extra>
            <a small class="goback" link type="primary" @click="goback">返回</a>
          </template>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item"> 名称 </div>
            </template>
            {{ org?.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item"> 编码 </div>
            </template>
            {{ org?.code }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item"> 描述 </div>
            </template>
            <div class="text-remark">
              {{ org?.teamRemark }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>

    <el-card class="box-card" :style="{ height: mainHeight + 'px', 'margin-top': '3px' }">
      <template #header>
        <div class="card-header">
          <span>角色维护</span>
          <!-- <el-button class="button" type="primary" text @click="goback">返回</el-button> -->
        </div>
      </template>

      <div>
        <el-table
          :data="authorityTree"
          stripe
          row-key="id"
          :border="true"
          lazy
          :height="tableHeight + 'px'"
          :tree-props="{ children: 'nodes' }"
          default-expand-all
          class="table"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="name" label="名称" width="250" />
          <el-table-column prop="code" label="编码" width="230" />
          <el-table-column prop="belong.name" label="所属" width="230">
            <template #default="belong">
              {{ belong.row.belong?.name || '奥集能' }}
              <el-tag v-if="belong.row.belong?.typeName">{{ belong.row.belong?.typeName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="public" label="是否公开" width="120">
            <template #default="pub">
              <el-tag v-if="pub.row.public" type="success">是</el-tag>
              <el-tag v-if="!pub.row.public" type="warning">否</el-tag>
            </template> </el-table-column
          >>
          <el-table-column prop="remark" label="备注" :min-width="150" />
          <el-table-column prop="createUser" label="创建人" :min-width="100">
            <template #default="scope">
              <div>{{ chat.getName(scope.row.createUser) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" :min-width="200" />
          <el-table-column label="操作" width="150">
            <template #default="{ row }">
              <div class="cell-box">
                <el-button link type="primary" size="small" v-if="allowAdd()" @click="create(row)"
                  >新增</el-button
                >
                <el-button link type="primary" size="small" @click="edit(row)" v-if="allowEdit(row)"
                  >编辑</el-button
                >
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDel(row)"
                  v-if="allowEdit(row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>

  <el-dialog
    v-model="createDialogVisible"
    title="请录入角色信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="角色名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="角色编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="是否公开" style="width: 100%">
        <el-radio-group v-model="formData.public" class="ml-4">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
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
      <el-form-item label="角色简介" style="width: 100%">
        <el-input
          v-model="formData.remark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span>
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createAuth">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="editDialogVisible"
    title="请编辑角色信息"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="角色名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="角色编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="是否公开" style="width: 100%">
        <el-radio-group v-model="formData.public" class="ml-4">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
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
      <el-form-item label="角色简介" style="width: 100%">
        <el-input
          v-model="formData.remark"
          :autosize="{ minRows: 5 }"
          placeholder="请输入"
          type="textarea"
          clearable
        />
      </el-form-item>
    </div>
    <template #footer>
      <span>
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="editAuth">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import $services from '@/services'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { chat } from '@/module/chat/orgchat'
  import authority from '@/utils/authority'
  import roleServices from '@/module/relation/role'

  // 1. 组织角色； 2. 个人角色；3. 群组角色  Todo
  const router = useRouter()
  let createDialogVisible = ref<boolean>(false)
  let editDialogVisible = ref<boolean>(false)

  let org = ref<any>({})
  let formData = ref<any>({})
  let belongId = ref<any>({})

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'nodes',
    emitPath: false
  }

  const allowAdd = () => {
    return authority.IsRelationAdmin([belongId.value, authority.getSpaceId()])
  }

  const allowEdit = (belong: any) => {
    if (belong && belong.id && belong.belongId) {
      return authority.IsRelationAdmin([belong.id, belong.belongId])
    }
    return false
  }

  let authorityTree = ref<any[]>([])
  let cascaderTree = ref<any[]>([])

  // 加载角色树
  const loadAuthorityTree = async () => {
    const res = await roleServices.getAuthorityTree(belongId.value)
    authorityTree.value = []
    authorityTree.value.push(res)
    cascaderTree.value = authorityTree.value
  }

  // 返回
  const goback = () => {
    router.go(-1)
  }

  // 新增
  const create = (row: any) => {
    createDialogVisible.value = true
    formData.value.public = true
    formData.value.parentId = row.id
  }

  // 编辑
  const edit = (row: any) => {
    editDialogVisible.value = true
    formData.value.parentId = row.id
    formData.value = { ...formData.value, ...row }
  }

  // 删除行
  const handleDel = async (row: any) => {
    let title: string
    title = `确定把 ${row.name} 删除吗？`
    ElMessageBox.confirm(title, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteCompanyAuthority(row)
      })
      .catch(() => {})
  }

  // 删除组织角色
  const deleteCompanyAuthority = async (row: any) => {
    const success = await roleServices.deleteAuthority(row.id)
    if (success) {
      loadAuthorityTree()
    }
  }

  // 删除群组角色
  const deleteCohortAuthority = (row: any) => {}

  // 删除个人角色
  const deletePersonAuthority = (row: any) => {}

  // 关闭弹窗清空
  const dialogHide = () => {
    formData.value.parentId = { parentId: formData.value.parentId }
    createDialogVisible.value = false
    editDialogVisible.value = false
  }

  // 创建组织员工角色
  const createAuth = async () => {
    const success = await roleServices.createAuthority(formData.value, belongId.value)
    if (success) {
      dialogHide()
      loadAuthorityTree()
    }
  }

  // 编辑角色
  const editAuth = async () => {
    const success = await roleServices.updateAuthority(formData.value)
    if (success) {
      dialogHide()
      loadAuthorityTree()
    }
  }
  const cardHeight = ref(null)
  const tableHeight = ref(100)
  const mainHeight = ref(100)
  // 获取树
  onMounted(() => {
    belongId.value = router.currentRoute.value.query?.belongId
    org.value = router.currentRoute.value.query
    mainHeight.value = document.documentElement.clientHeight - 70 - cardHeight.value.clientHeight
    tableHeight.value = document.documentElement.clientHeight - 160 - cardHeight.value.clientHeight
    loadAuthorityTree()
  })
</script>

<style lang="scss" scoped>
  .goback {
    cursor: pointer;
  }

  .container {
    height: 100%;
    width: calc(100% - 100px);
    background-color: var(--el-bg-color-overlay);
    padding: 5px;
    display: flex;
    flex-direction: column;

    .cell-box {
      display: flex;
      align-items: center;
    }

    .table {
      width: 100%;
      height: calc(100vh - 350px);
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
  }

  .box-card {
    width: 100%;
  }

  .text-remark {
    max-height: 60px;
    overflow-y: auto;
  }
</style>
