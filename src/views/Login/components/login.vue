<template>
  <div class="login">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="账户密码登录" name="first"
        ><UserName ref="username" @forgetPassword="forgetPassword"></UserName
      ></el-tab-pane>
      <!-- <el-tab-pane label="手机号登录" name="second">Config</el-tab-pane> -->
    </el-tabs>
    <el-button class="loginBtn" type="primary" @click="login" :loading="btnLoading"
      >登 录</el-button
    >
    <div class="other-login">
      <div class="other-login__register" @click="register">注册用户</div>
    </div>
  </div>
</template>

<script lang="ts">
  import UserName from './userName.vue'
  import { defineComponent, toRefs, ref, onMounted, onUnmounted } from 'vue'
  export default defineComponent({
    components: { UserName },
    props: ['btnLoading'],
    setup(prop, context) {
      const username = ref<any>()
      const forgetPassword = () => {
        context.emit('forgetPassword')
      }
      let data = {
        activeName: 'first'
      }
      const login = () => {
        context.emit('userLogin', username.value.ruleForm)
      }
      const register = () => {
        context.emit('register')
      }

      onMounted(() => {
        window.addEventListener('keydown', keyDown)
      })
      const keyDown = (e: { keyCode: number }) => {
        //如果是回车则执行登录方法
        if (e.keyCode == 13) {
          login()
        }
      }
      onUnmounted(() => {
        window.removeEventListener('keydown', keyDown, false)
      })
      return {
        username,
        login,
        register,
        forgetPassword,
        ...toRefs(data)
      }
    }
  })
</script>

<style lang="scss" scoped>
  .login {
    :deep(.el-tabs__nav-wrap::after) {
      background-color: unset;
    }
    :deep(.el-tabs__item.is-active) {
      color: rgb(62, 94, 216) !important;
    }
    :deep(.el-tabs__active-bar) {
      background-color: rgb(62, 94, 216) !important;
    }
  }

  .other-login {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    &-box {
      display: flex;
    }
    &__register {
      cursor: pointer;
      color: rgb(35, 72, 211);
      font-size: 14px;
    }
  }
  .baseLayout {
    width: 100%;
    height: 100%;
    &-bg {
      position: absolute;
      left: 40px;
      bottom: 0;
      width: 50%;
      height: 80%;
      background-size: 100% 100%;
    }
  }
  .baseLayout-loginBox {
    width: 25%;
    height: 65%;
    position: absolute;
    right: 10%;
    top: 30%;
  }
  .baseLayout_btmText {
    position: absolute;
    bottom: 20px;
    right: 10%;
  }
  .loginBtn {
    background: rgb(62, 94, 216);
    height: 40px;
    width: 100%;
  }
  .loginImg {
    cursor: pointer;
    margin-right: 10px;
  }
</style>
