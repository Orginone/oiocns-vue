<template>
  <div class="baseLayout">
    <img class="baseLayout-bg" src="@/assets/img/login.png" alt="" />
    <div class="baseLayout-loginBox">
      <!-- <el-carousel
        ref="carousel"
        style="height: 100%;width:500px"
        :autoplay="false"
        indicator-position="none"
        arrow="never"
      >
        <el-carousel-item name="first">
          <Login @register="register" @userLogin="userLogin" :btnLoading="btnLoading"></Login>
        </el-carousel-item>
        <el-carousel-item name="second">
          <UserInfo @gotoPrev="gotoPrev" @gotoNext="gotoNext"></UserInfo>
        </el-carousel-item>
        <el-carousel-item name="third">
          <Register @gotoPrev="gotoPrev" @registerUser="registerUser"></Register>
        </el-carousel-item>
      </el-carousel> -->
      <Login
        v-show="stept == 'first'"
        @register="register"
        @userLogin="userLogin"
        @forgetPassword="forgetPassword"
        :btnLoading="btnLoading"
      ></Login>
      <UserInfo v-show="stept == 'second'" @gotoPrev="gotoPrev" @gotoNext="gotoNext"></UserInfo>
      <Register
        v-show="stept == 'third'"
        @gotoPrev="gotoPrev"
        @registerUser="registerUser"
        @gotoBack="register"
      ></Register>
      <Forget v-show="stept == 'fourth'" @gotoPrev="gotoPrev" @resetPWD="resetPWD"></Forget>
    </div>
    <div class="baseLayout_btmText">
      Copyright 2021 资产云开放协同创新中⼼ 主办单位：浙江省财政厅
    </div>
  </div>
  <el-dialog v-model="dialogVisible" width="30%" center>
    <div class="dialogText">请妥善保管下面私钥,请勿告诉他人,该私钥可以为你重置密码,加解密数据.</div>
    <span class="dialogPrivate">{{ state.registerValue.privateKey }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  // import 'element-plus/theme-chalk/el-loading.css'
  import Login from './components/login.vue'
  import Register from './components/register.vue'
  import UserInfo from './components/userInfo.vue'
  import Forget from './components/forget.vue'
  import $services from '@/services'
  import { reactive, ref, onMounted } from 'vue'
  import { useUserStore } from '@/store/user'
  import { useMarketStore } from '@/store/market'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'

  const dialogVisible = ref<boolean>(false)
  const carousel = ref<any>()
  const store = useUserStore()
  const marketStore = useMarketStore()
  const router = useRouter()
  const stept = ref<string>('first')
  const state = reactive({
    registerValue: {
      privateKey: ''
    }
  })
  type Form = {
    account: string
    importValue: string
    password: string
    password2: string
  }
  let btnLoading = ref(false)

  onMounted(() => {
    store.resetState()
    sessionStorage.clear()
  })

  let registerData = reactive<Object>({})

  const resetPWD = (data: Form) => {
    console.log(data)
    $services.person
      .reset({
        data: data
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '密码修改成功',
            type: 'success'
          })
          stept.value = 'first'
        }
      })
      .catch((err: any) => {
        ElMessage({
          message: '填写的信息有错误 请检查所填信息',
          type: 'error'
        })
      })
  }
  const register = () => {
    stept.value = 'second'
    // carousel.value?.setActiveItem('second')
  }
  const forgetPassword = () => {
    stept.value = 'fourth'
  }
  const gotoNext = (data: object) => {
    stept.value = 'third'
    registerData = data
    // carousel.value?.setActiveItem('third')
    console.log(registerData)
  }
  const gotoPrev = () => {
    stept.value = 'first'
    // carousel.value?.setActiveItem('first')
  }
  const userLogin = (data: { password: string; username: string; remind: boolean }) => {
    btnLoading.value = true
    store.updateUserInfo(data).then((res) => {
      btnLoading.value = false
      if (data.remind) {
        setCookie(data.username, data.password, 7)
      } else {
        setCookie('', '', -1)
      }

      router.push({ path: 'workHome' })
    })
  }
  const registerUser = (data: any) => {
    registerData = { ...registerData, ...data }
    $services.person
      .register({
        data: registerData
      })
      .then((res: ResultType) => {
        console.log('测试接口', res)
        if (res.code == 200) {
          ElMessage({
            message: '注册成功',
            type: 'success'
          })
          stept.value = 'first'
          dialogVisible.value = true
          state.registerValue = res.data
        }
      })
  }

  const setCookie = (username: string, password: string, days: any) => {
    return
    let date = new Date() // 获取时间
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days) // 保存的天数
    // 字符串拼接cookie
    window.document.cookie = 'username' + '=' + username + ';path=/;expires=' + date.toUTCString()
    window.document.cookie = 'password' + '=' + password + ';path=/;expires=' + date.toUTCString()
  }
</script>

<style lang="scss" scoped>
  :deep(.el-dialog__body) {
    display: flex;
    flex-direction: column;
  }
  :deep(.el-carousel__container) {
    height: 100%;
  }
  .dialogText {
    font-size: 16px;
    margin-bottom: 40px;
  }
  .dialogPrivate {
    font-size: 26px;
    text-align: center;
    color: rgb(35, 72, 211);
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
</style>
