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
  <el-dialog v-model="createIdntityDialog" title="请录入岗位信息" width="40%" center append-to-body @close="dialogHide">
    <div>
      <el-form-item label="岗位名称" style="width: 100%">
        <el-input v-model="formData.name" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="岗位编号" style="width: 100%">
        <el-input v-model="formData.code" placeholder="请输入" clearable style="width: 100%" />
      </el-form-item>
      <el-form-item label="所属角色" style="width: 100%">
        <el-cascader :props="cascaderProps" :options="cascaderTree" v-model="formData.authId" style="width: 100%"
          placeholder="请选择" />
      </el-form-item>
      <el-form-item label="岗位简介" style="width: 100%">
        <el-input v-model="formData.remark" :autosize="{ minRows: 5 }" placeholder="请输入" type="textarea" clearable />
      </el-form-item>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogHide">取消</el-button>
        <el-button type="primary" @click="createIdentity">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  // @ts-nocheck
  import adminTable from './components/adminTable.vue'
  import postTable from './components/postTable.vue'
  import { getCurrentInstance, computed } from "vue";
  import { useUserStore } from '@/store/user'
  import identityServices from '@/module/relation/identity'

  const IdentityServices = new identityServices()
  const userStore = useUserStore()

  const { proxy } = getCurrentInstance()

  proxy?.$Bus.on('clickBus', (id) => {
    if(id == '2008') {
      createIdntityDialog.value = true
    }
  })

  const createIdntityDialog = ref<boolean>(false)
  let formData = reactive<any>({})
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
  // 创建岗位
  const createIdentity = async () => {
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
      dialogHide()
      loadIdentities()
    }
  }

  const dialogHide = () => {
    formData.value = {}
    createIdntityDialog.value = false
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
