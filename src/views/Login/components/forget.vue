<template>
  <div>
    <div class="title">忘记密码</div>
    <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" status-icon class="demo-ruleForm">
      <el-form-item prop="phone">
        <el-input
          size="large"
          v-model="ruleForm.account"
          autocomplete="off"
          placeholder="请输入账户"
          oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="large"
          placeholder="请输入密码(包含大小写字母和数字符号组合的6-15位密码)"
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="password2">
        <el-input
          size="large"
          placeholder="请再次输入密码"
          v-model="ruleForm.password2"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="privateKey">
        <el-input
          size="large"
          placeholder="请输入注册时保存的私钥"
          v-model="ruleForm.privateKey"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <el-button class="loginBtn" type="primary" @click="submitForm(ruleFormRef)">提 交</el-button>
    <div class="textBox">
      <span class="loginText" @click="gotoPrev">返回登录</span>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  export default defineComponent({
    setup(prop, context) {
      const ruleFormRef = ref<FormInstance>()
      const ruleForm = reactive({
        password: '',
        account: '',
        password2: '',
        privateKey: ''
      })
      const gotoPrev = () => {
        context.emit('gotoPrev')
      }
      const validatePass = (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请输入账户'))
        } else {
          callback()
        }
      }
      const validatePass2 = (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (ruleForm.password !== '') {
            if (value.length < 6 || value.length > 15) {
              callback(new Error('密码长度不正确'))
            }
          }
          callback()
        }
      }
      const validatePass3 = (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else {
          if (ruleForm.password2 !== '' && ruleForm.password == ruleForm.password2) {
            callback()
          } else {
            callback(new Error('与原密码不一致'))
          }
        }
      }
      const validatePass4 = (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请输入助记词'))
        } else {
          callback()
        }
      }
      const rules = reactive({
        phone: [{ validator: validatePass, trigger: 'blur' }],
        password: [{ validator: validatePass2, trigger: 'blur' }],
        password2: [{ validator: validatePass3, trigger: 'blur' }],
        privateKey: [{ validator: validatePass4, trigger: 'blur' }]
      })
      const submitForm = (formEl: FormInstance | undefined) => {
        if (!formEl) return
        formEl.validate((valid) => {
          if (valid) {
            context.emit('resetPWD', ruleForm)
          } else {
            return false
          }
        })
      }
      return {
        submitForm,
        rules,
        gotoPrev,
        ruleFormRef,
        ruleForm
      }
    }
  })
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
