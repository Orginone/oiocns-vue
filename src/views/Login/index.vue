<template>
  <div class="baseLayout">
    <div class="container">
      <div class="logo">OrginOne</div>
      <div class="slider">
        <el-carousel height="73vh">
          <el-carousel-item class="sliderSlidesItem">
            <img
              class="sliderSlidesItemImg"
              src="/img/passport/orginOne/passport_img1.png"
              alt=""
            />
            <div class="sliderSlidesItemTitle">奥集能 Orginone</div>
            <div class="sliderSlidesItemContent">
              面向下一代互联网发展趋势，基于动态演化的复杂系统多主体建模方法，以所有权作为第一优先级，运用零信任安全机制，按自组织分形理念提炼和抽象“沟通、办事、存储、流通和设置”等基础功能，为b端和c端融合的全场景业务的提供新一代分布式应用架构。
            </div>
          </el-carousel-item>
          <el-carousel-item class="sliderSlidesItem">
            <img
              class="sliderSlidesItemImg"
              src="/img/passport/orginOne/passport_img2.png"
              alt=""
            />
            <div class="sliderSlidesItemTitle">门户</div>
            <div class="sliderSlidesItemContent">
              汇聚各类动态信息，新闻资讯，交易商城，监控大屏，驾驶舱。用户可以按权限自由定义，千人千面。
            </div>
          </el-carousel-item>
          <el-carousel-item class="sliderSlidesItem">
            <img
              class="sliderSlidesItemImg"
              src="/img/passport/orginOne/passport_img3.png"
              alt=""
            />
            <div class="sliderSlidesItemTitle">沟通</div>
            <div class="sliderSlidesItemContent">
              为个人和组织提供可靠、安全、私密的即时沟通工具，个人会话隐私保护优先，组织会话单位数据权利归属优先。
            </div>
          </el-carousel-item>
          <el-carousel-item class="sliderSlidesItem">
            <img
              class="sliderSlidesItemImg"
              src="/img/passport/orginOne/passport_img4.png"
              alt=""
            />
            <div class="sliderSlidesItemTitle">办事</div>
            <div class="sliderSlidesItemContent">
              满足各类组织和跨组织协同办公，适应各类业务场景，支持发起、待办、已办、已完结等不同状态流程类业务审核审批查阅。
            </div>
          </el-carousel-item>
          <el-carousel-item class="sliderSlidesItem">
            <img
              class="sliderSlidesItemImg"
              src="/img/passport/orginOne/passport_img5.png"
              alt=""
            />
            <div class="sliderSlidesItemTitle">存储</div>
            <div class="sliderSlidesItemContent">
              提供各类文件、数据、应用的存储空间。具有操作系统级文件和资源管理器功能。
            </div>
          </el-carousel-item>
          <el-carousel-item class="sliderSlidesItem">
            <img
              class="sliderSlidesItemImg"
              src="/img/passport/orginOne/passport_img6.png"
              alt=""
            />
            <div class="sliderSlidesItemTitle">设置</div>
            <div class="sliderSlidesItemContent">
              进行个人和组织的关系设置，数据标准、办事和应用的定义和管理。无代码自定义表单、规则，灵活的流程配置。支持各类资源注册和管理。
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="login-foot">
        <img src="/img/passport/orginOne/passport_bg.png" alt="" />
        <div class="baseLayout_btmText"> 主办单位：<a
            href="https://czt.zj.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
          >浙江省财政厅
          </a>&nbsp;技术支持：<a
            href="https://assetcloud.org.cn"
            target="_blank"
            rel="noopener noreferrer"
          >资产云开放协同创新中心
          </a>
        </div>
      </div>
    </div>
    <div class="baseLayout-loginBox">
      <Login
        v-show="stept == 'first'"
        @register="register"
        @userLogin="userLogin"
        @forgetPassword="forgetPassword"
        :btnLoading="btnLoading"
      ></Login>
      <UserInfo
        v-show="stept == 'second'"
        @gotoPrev="gotoPrev"
        @gotoNext="gotoNext"
      ></UserInfo>
      <Register
        v-show="stept == 'third'"
        @gotoPrev="gotoPrev"
        @registerUser="registerUser"
        @gotoBack="register"
      ></Register>
      <Forget
        v-show="stept == 'fourth'"
        @gotoPrev="gotoPrev"
        @resetPWD="resetPWD"
      ></Forget>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" width="30%" center>
    <div class="dialogText">
      请妥善保管下面私钥,请勿告诉他人,该私钥可以为你重置密码,加解密数据.
    </div>
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
import Login from "./components/login.vue";
import Register from "./components/register.vue";
import UserInfo from "./components/userInfo.vue";
import Forget from "./components/forget.vue";
import $services from "@/services";
import { reactive, ref, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useMarketStore } from "@/store/market";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import orgCtrl from "@/ts/controller";

const dialogVisible = ref<boolean>(false);
const carousel = ref<any>();
const store = useUserStore();
const marketStore = useMarketStore();
const router = useRouter();
const stept = ref<string>("first");
const state = reactive({
  registerValue: {
    privateKey: "",
  },
});
type Form = {
  account: string;
  importValue: string;
  password: string;
  password2: string;
};
let btnLoading = ref(false);

onMounted(() => {
  store.resetState();
  sessionStorage.clear();
});

let registerData = reactive<Object>({});

const resetPWD = (data: Form) => {
  console.log(data);
  $services.person
    .reset({
      data: data,
    })
    .then((res: ResultType) => {
      if (res.code == 200) {
        ElMessage({
          message: "密码修改成功",
          type: "success",
        });
        stept.value = "first";
      }
    })
    .catch((err: any) => {
      ElMessage({
        message: "填写的信息有错误 请检查所填信息",
        type: "error",
      });
    });
};
const register = () => {
  stept.value = "second";
  // carousel.value?.setActiveItem('second')
};
const forgetPassword = () => {
  stept.value = "fourth";
};
const gotoNext = (data: object) => {
  stept.value = "third";
  registerData = data;
  // carousel.value?.setActiveItem('third')
  console.log(registerData);
};
const gotoPrev = () => {
  stept.value = "first";
  // carousel.value?.setActiveItem('first')
};
const userLogin = async (data: {
  password: string;
  username: string;
  remind: boolean;
}) => {
  btnLoading.value = true;
  // console.log("orgCtrl", orgCtrl);
  const res = await orgCtrl.provider.login(data.username, data.password);
  // console.log("res", res);
  if (res.msg == "success") {
    router.push("/home");
  }
  // store.updateUserInfo(data).then((res) => {
  //   btnLoading.value = false
  //   // if (data.remind) {
  //   //   setCookie(data.username, data.password, 7)
  //   // } else {
  //   //   setCookie('', '', -1)
  //   // }
  //   router.push({ path: 'workHome' })
  // })
};
const registerUser = (data: any) => {
  registerData = { ...registerData, ...data };
  $services.person
    .register({
      data: registerData,
    })
    .then((res: ResultType) => {
      console.log("测试接口", res);
      if (res.code == 200) {
        ElMessage({
          message: "注册成功",
          type: "success",
        });
        stept.value = "first";
        dialogVisible.value = true;
        state.registerValue = res.data;
      }
    });
};

const setCookie = (username: string, password: string, days: any) => {
  return;
  let date = new Date(); // 获取时间
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * days); // 保存的天数
  // 字符串拼接cookie
  window.document.cookie =
    "username" + "=" + username + ";path=/;expires=" + date.toUTCString();
  window.document.cookie =
    "password" + "=" + password + ";path=/;expires=" + date.toUTCString();
};
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
  right: 6.5%;
  top: 30%;
}
div {
  font-family: "PingFang SC";
}
.container {
  width: 62.5%;
  height: 100%;
  display: grid;
  align-items: center;
  .logo {
    position: absolute;
    top: 43px;
    left: 55.14px;
    z-index: 1;
    height: 40px;
    font-size: 26px;
    line-height: 44px;
    font-weight: bold;
    color: #fff;
  }
}

.background {
  position: fixed;
  height: 100%;
  width: 62.5vw;
  background-color: #deeaff;
  img {
    width: 100%;
  }
}

input[type="radio"] {
  display: none;
}
.count {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 5vw;
  height: 6px;
  top: 92vh;
  left: 28.75vw;
  gap: 6px;
  label {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    transition: width 0.5s;
  }
}

.slider {
  z-index: 1;
  width: 62.5vw;
  height: 100%;
  position: fixed;
  top: 20px;
  &Slides {
    display: -webkit-box;
    transition: margin 0.8s;
    &Item {
      display: flex;
      z-index: 1;
      width: 62.5vw;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &Img {
        position: relative;
        float: right;
        object-fit: contain;
        height: 300px;
      }
      &Title {
        color: #15181d;
        font-size: 36px;
        font-weight: bold;
        line-height: 44px;
        letter-spacing: 0;
        text-align: center;
      }
      &Content {
        margin-top: 23px;
        color: #424a57;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        letter-spacing: 0;
        text-align: center;
        width: 500px;
      }
    }
  }
}

.higher_img {
  height: 65vh;
}
.higher_text {
  position: relative;
  bottom: 5vh;
}

.box {
  width: 25vw;
  height: 65%;
  position: absolute;
  left: 68.75vw;
  top: 28%;
}
.copyright {
  color: #8a8a8a;
  width: 100%;
  &Zh {
    position: absolute;
    bottom: 10px;
    align-items: center;
    left: 31.25%;
    transform: translate(-50%, 0);
  }
  &En {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}

@media (max-width: 1200px) {
  .sliderSlidesItemContent {
    width: 300px;
  }
}

@media (max-width: 800px) {
  .count {
    display: none;
  }
  .slider {
    display: none;
  }
  .background {
    display: none;
  }
  .box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: auto;
    left: auto;
  }
  .copyright {
    width: 100%;
    display: flex;
    justify-content: center;
    right: 0;
    &Zh {
      justify-content: center;
      display: inline-flex;
      left: auto;
      transform: translate(0, 0);
      width: 100%;
    }
    &En {
      display: none;
    }
  }
}
.sliderSlidesItem {
  div {
    color: #fff;
  }
}
.login-foot {
  position: fixed;
  left: 0;
  top: 0;
  width: 62.5%;
  height: 100%;
  background: rgb(1, 23, 54);
  img {
    position: absolute;
    left: 0;
    bottom: 0; 
    width: 100%;
  }
  .baseLayout_btmText {
    line-height: 22px;
    position: absolute;
    width: 500px;
    text-align: center;
    color: rgb(138, 138, 138);
    left: 50%;
    margin-left: -250px;
    bottom: 10px;
    font-size: 14px;
  }
}
</style>
