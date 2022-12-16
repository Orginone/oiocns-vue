<template>
  <div class="container mainBox" ref="container">
    <div class="content mid box">
      <div class="info" ref="infoWrap">
        <admin-table />
      </div>
      <div class="body" ref="bodyWrap">
        <post-table />
      </div>
    </div>
  </div>
  <el-dialog v-model="createOrUpdatePostDialog" :title="`${isUpdate ? '修改': '请录入'}岗位信息`" width="40%" center append-to-body @close="dialogHide">
    <el-form ref="ruleFormRef" :model="formData">
      <el-form-item label="岗位名称" style="width: 100%" prop="name">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="岗位编号" style="width: 100%" prop="code">
        <el-input :disabled="isUpdate" v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="所属角色" style="width: 100%" prop="authId">
        <el-cascader :disabled="isUpdate" :props="cascaderProps" :options="cascaderTree" v-model="formData.authId" style="width: 100%"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="岗位简介" style="width: 100%" prop="remark">
        <el-input :disabled="isUpdate" v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <CreateTeamModal 
    :title="activeModal"
    v-model:visible="visible"
    :current="USERCTRL.company  ||  settingStore.currentSelectItme"
    :typeNames="['岗位']"
    @handleOk="handleOk"
  />
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import CreateTeamModal from '../GlobalComps/createTeam.vue';
  import adminTable from './components/adminTable.vue'
  import postTable from './components/postTable.vue'
  import { getCurrentInstance, computed } from "vue";
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useUserStore } from '@/store/user'
  import { USERCTRL, TargetType } from '@/ts/coreIndex';
  import { setCenterStore } from '@/store/setting'
  import identityServices from '@/module/relation/identity'
  const IdentityServices = new identityServices()
  const settingStore = setCenterStore()
  const userStore = useUserStore()

  const isUpdate = ref<boolean>(false)
  const { proxy } = getCurrentInstance()

  const activeModal = ref('')
  const createOrEdit = ref()
  const visible = ref(false)
  const handleOk = (newItem) => {
    if(newItem) {
      ElMessage.success(`${isUpdate.value ? '编辑': '新增'}成功!`)
      visible.value = false
      proxy?.$Bus.emit('refreshNav')
    }
  }

  let formData = reactive<any>({
    name: '',
    code: '',
    authId: '',
    remark: ''
  })
  const ruleFormRef = ref()
  proxy?.$Bus.on('clickBus', (id) => {
    if(id == '2008') {
      isUpdate.value = false
      if (ruleFormRef.value) {
        ruleFormRef.value.resetFields()
      }
      activeModal.value = '新增|岗位'
      visible.value = true
      // createOrUpdatePostDialog.value = true
    } else if (id == '2009') {
      isUpdate.value = true
      formData = settingStore.currentSelectItme
      // createOrUpdatePostDialog.value = true
      activeModal.value = '编辑'
      visible.value = true
    } else if(id == '2010') {
      handleDelete()
    }
  })

  const createOrUpdatePostDialog = ref<boolean>(false)
  const belongId = computed(() => userStore.workspaceData?.id)
  let authorityTree = ref<any[]>([])
  let cascaderTree = ref<any[]>([])
  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'nodes',
    emitPath: false,
  }

  // 加载角色树
  const loadAuthorityTree = async () => {
    const data = await IdentityServices.getAuthorityTree(belongId.value)
    if(data){
      authorityTree.value = []
      authorityTree.value.push(data)
      cascaderTree.value = authorityTree.value
    }
  }
  // 创建或者更新岗位
  const submit = async () => {
    if (isUpdate.value) return ElMessage.error('待提供接口...')
    let obj =  {
      belongId: belongId.value,
      name: formData.name,
      code: formData.code,
      remark: formData.remark,
      authId: formData.authId
    }
    const data =  await IdentityServices.createIdentity(obj)
    if(data){
      ElMessage({
        message: '创建成功!',
        type: 'success'
      })
      proxy?.$Bus.emit('refreshNav')
      dialogHide()
    }
  }

  // 删除岗位信息
  const handleDelete = () => {
    if (!settingStore.currentSelectItme?.id) {
      ElMessage.warning('请左侧选择岗位')
      return
    }
    ElMessageBox.confirm(
      `确定删除 ${settingStore.currentSelectItme?.name} 岗位吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      const data = await IdentityServices.deleteIdentity(settingStore.currentSelectItme?.id)
      if (data) {
        ElMessage({
          message: '操作成功',
          type: 'success'
        })
        proxy?.$Bus.emit('refreshNav')
      }
    })
      .catch(() => {
        console.log('取消移除!')
      })
  }

  const dialogHide = () => {
    if (ruleFormRef.value) {
      ruleFormRef.value.resetFields()
    }
    createOrUpdatePostDialog.value = false
  }

  onMounted(() => {
    loadAuthorityTree()
  })

</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    padding: 3px 0;
    box-sizing: border-box;
    display: flex;
    .content {
      width: 100%;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      overflow: hidden;
      .info {
        height: calc(50%);
        padding: 0 0 3px 0;
        box-sizing: border-box;
      }
      .body {
        height: calc(50%);
      }
    }
  }
</style>
