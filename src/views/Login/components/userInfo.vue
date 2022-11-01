<template>
  <div>
    <div class="title">填写个人信息</div>
    <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" status-icon class="demo-ruleForm">
      <el-form-item label=" " prop="phone">
        <el-input
          size="large"
          v-model="ruleForm.phone"
          autocomplete="off"
          placeholder="请输入电话号码"
        />
      </el-form-item>
      <el-form-item label=" " prop="nickName">
        <el-input
          size="large"
          v-model="ruleForm.nickName"
          autocomplete="off"
          placeholder="请输入昵称"
        />
      </el-form-item>
      <el-form-item label=" " prop="name">
        <el-input
          size="large"
          placeholder="请输入真实姓名"
          v-model="ruleForm.name"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label=" " prop="motto">
        <el-input
          size="large"
          placeholder="请输入座右铭"
          v-model="ruleForm.motto"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <el-button class="loginBtn" type="primary" @click="submitForm(ruleFormRef)">下一步</el-button>
    <div class="textBox">
      <span>已有账户？</span><span class="loginText" @click="gotoPrev">立即登录</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  const emit = defineEmits(['gotoPrev', 'gotoNext'])
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    phone: '',
    nickName: '',
    name: '',
    motto: ''
  })

  const gotoPrev = () => {
    emit('gotoPrev')
  }
  const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入昵称'))
    } else if (/^[\u4e00-\u9fa5]+$/i.test(value) && value.length >= 2) {
      callback()
    } else if (/^[a-zA-Z]+$/.test(value) && value.length >= 4) {
      callback()
    } else {
      callback('请输入正确的中文或英文')
    }
  }
  const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入真实姓名'))
    } else if (/^[\u4e00-\u9fa5]+$/i.test(value) && value.length >= 2) {
      callback()
    } else if (/^[a-zA-Z]+$/.test(value) && value.length >= 4) {
      callback()
    } else {
      callback('请输入正确的中文或英文')
    }
  }
  const validatePass3 = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入座右铭'))
    } else {
      callback()
    }
  }
  const validatePass4 = (rule: any, value: any, callback: any) => {
    const phoneReg = /^1[3|4|5|7|8|9][0-9]{9}$/
    if (value === '') {
      callback(new Error('请输入手机号'))
    } else {
      if (ruleForm.phone !== '') {
        if (phoneReg.test(value)) {
          callback()
        } else {
          callback(new Error('手机号格式不正确'))
        }
      }
      callback()
    }
  }
  const rules = reactive({
    phone: [{ validator: validatePass4, required: true, trigger: 'blur' }],
    nickName: [{ validator: validatePass, required: true, trigger: 'blur' }],
    name: [{ validator: validatePass2, required: true, trigger: 'blur' }],
    motto: [{ validator: validatePass3, required: true, trigger: 'blur' }]
  })
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        emit('gotoNext', ruleForm)
      } else {
        return false
      }
    })
  }
</script>

<style lang="scss" scoped>
  .title {
    color: rgb(35, 72, 211);
    margin-bottom: 20px;
  }
  .loginBtn {
    background: rgb(62, 94, 216);
    height: 40px;
    width: 100%;
  }
  .textBox {
    margin-top: 20px;
    width: 100%;
    text-align: center;
  }
  .loginText {
    color: rgb(35, 72, 211);
    cursor: pointer;
  }
</style>
