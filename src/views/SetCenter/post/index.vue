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
  <CreateTeamModal 
    :title="activeModal"
    v-model:visible="visible"
    :current="current"
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
  import { userCtrl, TargetType } from '@/ts/coreIndex';
  import { setCenterStore } from '@/store/setting'
  const settingStore = setCenterStore()
  const userStore = useUserStore()

  const isUpdate = ref<boolean>(false)
  const { proxy } = getCurrentInstance()

  const activeModal = ref('')
  const createOrEdit = ref()
  const current = ref()
  const visible = ref(false)
  const handleOk = (newItem) => {
    if(newItem.target.name != settingStore.currentSelectItme.label) {
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
      activeModal.value = '新增|岗位'
      visible.value = true
      current.value = userCtrl.company
    } else if (id == '2009') {
      isUpdate.value = true
      formData = settingStore.currentSelectItme
      current.value = settingStore.currentSelectItme?.object
      activeModal.value = '编辑'
      visible.value = true
    } else if(id == '2010') {
      handleDelete()
    }
  })

  const createOrUpdatePostDialog = ref<boolean>(false)
  const belongId = computed(() => userStore.workspaceData?.id)
  const cascaderProps = {
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'nodes',
    emitPath: false,
  }

  // 删除岗位信息
  const handleDelete = () => {
    if (!settingStore.currentSelectItme?.object?.name) {
      ElMessage.warning('请左侧选择岗位')
      return
    }
    ElMessageBox.confirm(
      `确定删除 ${settingStore.currentSelectItme?.object?.name} 岗位吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      const data = await settingStore.currentSelectItme?.object.delete()
      if (data) {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        proxy?.$Bus.emit('refreshNav')
      }
    })
    .catch(() => {
      console.log('取消移除!')
    })
  }

</script>
<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    padding: 3px 0;
    box-sizing: border-box;
    background: var(--el-bg-color-overlay);
    display: flex;
    .content {
      width: 100%;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      overflow: hidden;
      .info {
        height: calc(40%);
        padding: 0 0 3px 0;
        box-sizing: border-box;
      }
      .body {
        max-height: calc(43%);
      }
    }
  }
</style>
