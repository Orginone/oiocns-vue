<template>
  <div>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon class="demo-ruleForm">
      <el-form-item prop="username">
        <el-input
          size="large"
          v-model="ruleForm.username"
          autocomplete="off"
          placeholder="请输入账户名称"
          oninput="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          size="large"
          placeholder="请输入密码"
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item prop="remind">
        <div class="rmindBox">
          <el-checkbox v-model="ruleForm.remind" label="记住密码" size="large" />
          <div class="rmindBox_text" @click="forgetPassword">忘记密码</div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, defineEmits, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'

export default defineComponent({
  setup(prop, context) {
    onMounted(() => {
      getCookie()
    })
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive({
      password: '',
      username: '',
      remind: false
    })
    const forgetPassword = () => {
      context.emit('forgetPassword')
    }
    const getCookie = () => {
      if (document.cookie.length > 0) {
        let arr = document.cookie.split('; ') //分割成一个个独立的“key=value”的形式
        for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split('=') // 再次切割，arr2[0]为key值，arr2[1]为对应的value
          if (arr2[0] === 'username') {
            ruleForm.username = arr2[1]
          } else if (arr2[0] === 'password') {
            ruleForm.password = arr2[1]
            ruleForm.remind = true
          }
        }
      }
    }
    return {
      getCookie,
      forgetPassword,
      ruleFormRef,
      ruleForm
    }
  }
})
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  margin-top: 20px;
  width: 100%;
}
.rmindBox {
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.rmindBox_text {
  font-size: 14px;
  cursor: pointer;
  color: rgb(35, 72, 211);
}
</style>