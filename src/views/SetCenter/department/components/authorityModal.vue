<template>
<el-dialog
    :model-value="visible"
    title="权限设置"
    width="55%"
    append-to-body
    @close="emit('update:visible', false)"
  >
  <div class="container">
      <div>
        <el-table
          :data="authorityTree"
          stripe
          row-key="id"
          :border="true"
          lazy
          :tree-props="{ children: 'children' }"
          default-expand-all
          class="table"
        >
          <el-table-column prop="name" label="名称" width="280" />
          <el-table-column prop="code" label="编码" width="230" />
          <el-table-column prop="public" label="是否公开" width="100">
            <template #default="pub">
              <el-tag v-if="!pub.row.public" type="success">是</el-tag>
              <el-tag v-if="pub.row.public" type="warning">否</el-tag>
            </template> 
          </el-table-column>
          <el-table-column prop="remark" label="备注" :min-width="150" />
          <el-table-column label="操作" width="90">
            <template #default="{ row }">
              <el-dropdown>
                <span class="el-dropdown-link"> ··· </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="create(row)">新增</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <!-- <div class="cell-box">
                <el-button link type="primary" size="small" @click="create(row)"
                  >新增</el-button
                >
                <el-button link type="primary" size="small" @click="edit(row)"
                  >编辑</el-button
                >
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDel(row)"
                  >删除</el-button
                >
              </div> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
  </div>

  <el-dialog
    v-model="createDialogVisible"
    title="新增身份"
    width="40%"
    center
    append-to-body
    @close="dialogHide"
  >
    <div>
      <el-form-item label="名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="编码" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="是否公开" style="width: 100%">
        <el-radio-group v-model="formData.public" class="ml-4">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" style="width: 100%">
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
  </el-dialog>
</template>
<script lang="ts" setup>
  import { ref, computed, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { setCenterStore } from '@/store/setting'
  const store: any = setCenterStore()
  const current = computed(()=> store.currentSelectItme?.intans ?? store.currentSelectItme?.item)

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits<{
    (e: 'update:visible', isShow: boolean): void,
  }>()

  // 1. 组织角色； 2. 个人角色；3. 群组角色  Todo
  let createDialogVisible = ref<boolean>(false)
  let editDialogVisible = ref<boolean>(false)

  let formData = ref<any>({})
  let belongId = ref<any>({})

  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'nodes',
    emitPath: false
  }

  let authorityTree = ref<any[]>([])
  let cascaderTree = ref<any[]>([])

  watch(()=> props.visible, (newValue) => {
    if(newValue) {
      loadAuthorityTree()
    }
  })

  // 加载角色树
  const loadAuthorityTree = async () => {
    const res = await current.value?.loadAuthorityTree()
    authorityTree.value = []
    authorityTree.value.push(res)
    cascaderTree.value = authorityTree.value
  }

  const currentItem = ref()
  // 新增
  const create = (row: any) => {
    currentItem.value = row
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
    // const success = await roleServices.deleteAuthority(row.id)
    // if (success) {
    //   loadAuthorityTree()
    // }
  }

  // 关闭弹窗清空
  const dialogHide = () => {
    formData.value.parentId = { parentId: formData.value.parentId }
    createDialogVisible.value = false
    editDialogVisible.value = false
  }

  // 创建组织员工角色
  const createAuth = async () => {
    const {name,code,remark} = formData.value
    const res = await currentItem.value?.createSubAuthority(
      name,code, formData.value.public,remark
    )
    if (res.success) {
      ElMessage.success('新增成功!')
      dialogHide()
      loadAuthorityTree()
    } else {
      ElMessage.error(res.msg)
    }
  }

  // 编辑角色
  const editAuth = async () => {
    // const success = await roleServices.updateAuthority(formData.value)
    // if (success) {
    //   dialogHide()
    //   loadAuthorityTree()
    // }
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
  :deep .el-table th.el-table__cell {
    background-color: #eceffb!important;
  }
  .container {
    height: 100%;
    background-color: var(--el-bg-color-overlay);
    display: flex;
    flex-direction: column;

    .cell-box {
      display: flex;
      align-items: center;
    }

    .table {
      width: 100%;
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
