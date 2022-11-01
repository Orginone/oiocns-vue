<template>
  <el-dialog  v-model="dialogShow.value" title="添加用户组件" width="600px">
    <div class="diy-dialog-body">
      <div style="margin-top: 30px; margin-left: 52px">
        <el-form ref="ruleFormRef" :model="pageData.form" :rules="rules" label-width="150px">
          <el-form-item label="组件名称" prop="name">
            <el-input v-model="pageData.form.name" />
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-input v-model="pageData.form.url" placeholder="eg: https://www.baidu.com" />
          </el-form-item>
          <el-form-item label="宽度（占几个格子）" prop="width">
            <el-input v-model="pageData.form.width" type="number"></el-input>
          </el-form-item>
          <el-form-item label="高度（占几个格子）" prop="height">
            <el-input v-model="pageData.form.height" type="number"></el-input>
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
// import $services from '@/services'
import { useUserStore } from '@/store/user'
import { useAnyData } from '@/store/anydata'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { nanoid } from 'nanoid'

const ruleFormRef = ref<FormInstance>()
const emit = defineEmits(['closeDialog'])
const props = defineProps({
  dialogShow: {
    type: Object
  }
})
const store = useUserStore()
const ohterData = useAnyData()
// const loading = ref(false)
// const radio = ref('1')
const pageData = reactive({
  form: {
    id: '',
    name: '',
    url: '',
    width: '',
    height: ''
  },
  options: {
    labelWidth: '100px'
  },
  currentPage: 1,
  pageSize: 9999999
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入链接', trigger: 'blur' },
    {
      pattern: /^((http:|https:)+(\/\/)+(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.))+([a-z]+)[/?:]?.*$/, 
      message: '请输入正确的链接地址，eg: https://www.baidu.com'
    }
  ],
  width: [{ required: true, message: '请输入宽度', trigger: 'blur' }],
  height: [{ required: true, message: '请输入高度', trigger: 'blur' }]
})

// // 自动生成id
// const getUid = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     let r = (Math.random() * 16) | 0,
//       v = c == 'x' ? r : (r & 0x3) | 0x8
//     return v.toString(16)
//   })
// }
// onMounted(() => {

// })
// 保存新增的用户组件
const handleClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: boolean, fields: any) => {
    if (valid) {

      let params = {
       
        workspaceId: store.workspaceData.id,
        content: [...ohterData.userComplist, {
          id: nanoid(),
          name: pageData.form.name,
          url: pageData.form.url,
          width: parseInt(pageData.form.width),
          height: parseInt(pageData.form.height)
        }]
      }
      ohterData.updateUserSpace(params)
      ElMessage({
        message: '添加成功',
        type: 'success'
      })
      handleClose()
      // $services.diyHome
      //   .diy(`/anydata/object/set/${params.userId}.${params.workspaceId}.user`, {
      //     data: {
      //       operation: 'replaceAll',
      //       data: {
      //         name: '用户组件',
      //         content: params.content
      //       }
      //     }
      //   })
      //   .then((res: ResultType) => {
      //     if (res.state) {
      //       ElMessage({
      //         message: '添加成功',
      //         type: 'success'
      //       })
      //       handleClose()
      //     }
      //   })
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
