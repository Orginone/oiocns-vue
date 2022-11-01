<template>
  <el-dialog append-to-body	 v-model="dialogShow.value" title="创建单位" width="30%">
    <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" status-icon class="demo-ruleForm">
      <el-form-item prop="teamName">
        <el-input
          size="large"
          v-model="ruleForm.teamName"
          autocomplete="off"
          placeholder="请输入单位名称"
        />
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          size="large"
          v-model="ruleForm.code"
          autocomplete="off"
          placeholder="请输入社会信用统一代码"
        />
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          size="large"
          v-model="ruleForm.name"
          autocomplete="off"
          placeholder="请输入团队简称"
        />
      </el-form-item>
      <el-form-item prop="teamCode">
        <el-input
          size="large"
          v-model="ruleForm.teamCode"
          autocomplete="off"
          placeholder="请输入团队标识"
        />
      </el-form-item>
      <el-form-item prop="teamRemark">
        <el-input
          size="large"
          v-model="ruleForm.teamRemark"
          autocomplete="off"
          placeholder="请输入团队信息备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'

  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    name: '',
    code: '',
    teamName: '',
    teamCode: '',
    teamRemark: ''
  })
  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
    code: [
      {
        required: true,
        message: '请输入社会信用统一代码',
        trigger: 'blur'
      },
      {
        min: 18,
        max: 18,
        message: '长度为18位',
        trigger: 'blur'
      }
    ],
    teamName: [
      {
        required: true,
        message: '请输入团队简称',
        trigger: 'blur'
      }
    ],
    teamCode: [{ required: true, message: '请输入团队标识', trigger: 'blur' }],
    teamRemark: [{ required: true, message: '请输入团队备注', trigger: 'blur' }]
  })

  const props = defineProps({
    dialogShow: {
      type: Object
    }
  })

  const emit = defineEmits(['closeDialog', 'switchCreateCompany'])
  const submit = () => {
    $services.company
      .create({
        data: ruleForm
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '注册成功',
            type: 'success'
          })
          emit('switchCreateCompany', res.data)
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const closeDialog = () => {
    emit('closeDialog', 'unit')
  }
</script>

<style scoped></style>
