<template>
  <el-dialog center v-model="dialogShow.value" title="添加工作台" width="30%">
    <div class="diy-dialog-body">
      <div style="margin-top: 30px; margin-left: 52px">
        <el-form ref="ruleFormRef" :model="state.form" :rules="rules" label-width="150px">
          <el-form-item label="工作台名称" prop="name">
            <el-input v-model="state.form.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer class="diy-dialog-footer" style="margin-top: 20px">
      <span class="dialog-footer">
        <el-button type="primary" @click="handleClick(ruleFormRef)">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import $services from '@/services'
import { useUserStore } from '@/store/user'
import { anystore } from '@/hubs/anystore'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const emit = defineEmits(['closeDialog'])
const props = defineProps({
  dialogShow: {
    type: Object
  }
})
const store = useUserStore()
const loading = ref(false)
const radio = ref('1')
const state = reactive({
  form: {
    id: '',
    name: ''
  },
  options: {
    labelWidth: '100px'
  },
  templateList: [],
  currentPage: 1,
  pageSize: 9999999
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

onMounted(() => {
  state.templateList = props.dialogShow.temps
})
const handleClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let arr = []
      if (route.query.tabsData && route.query.tabsData.length !== 0) {
        arr = JSON.parse(route.query.tabsData as string)
      }
      arr.push({
        id: arr.length,
        name: arr.length,
        title: state.form.name,
        temps: props.dialogShow.sendData
      })
      let params = {
        userId: store.queryInfo.id,
        workspaceId: store.workspaceData.id,
        content: arr
      }
      anystore.set(`${params.workspaceId}`, {
        operation: 'replaceAll',
        data: {
          name: '首页配置',
          // temps: props.dialogShow.sendData
          content: params.content
        }
      }, "user").then((res: ResultType) => {
        if (res.success) {
          ElMessage({
            message: '添加成功',
            type: 'success'
          })
          handleClose()
          router.push({ path: '/workHome' })
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
const handleClose = () => {
  emit('closeDialog', props.dialogShow.key)
}
</script>

<style lang="scss" scoped>
:deep(.el-select) {
  width: 100%;
}

:deep(.el-input) {
  width: 70%;
}

.diy-dialog-body .el-form {
  justify-content: space-between;
}

.diy-dialog-footer .el-button:first-child {
  margin-right: 20px;
}

.form-shape {
  width: 100%;
}

img {
  width: 200px;
  height: 200px;
}

.photoBtn {
  margin: 20px 0;

  .el-button,
  .el-button--default:focus {
    padding: 8px;
    font-size: 10px;
  }
}
</style>
