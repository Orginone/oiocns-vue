<template>
  <div class="userMsg">
    <div class="pageHeader">
      <div class="title">个人信息</div>
    </div>
    <div class="body">
      <div class="bodyLeft">
        <el-form
          class="form1"
          :inline="true"
          :label-position="labelPosition"
          label-width="100px"
          :model="formModel"
          style="max-width: 800px"
        >
          <el-form-item label="昵称">
            <el-input v-model="formModel.nickName" />
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="formModel.account" :disabled="true" />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="formModel.realName" />
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model="formModel.phone" />
          </el-form-item>
        </el-form>
        <el-form
          class="form2"
          :label-position="labelPosition"
          label-width="100px"
          :model="formModel"
          style="max-width: 800px"
        >
          <el-form-item label="座右铭">
            <el-input v-model="formModel.motto" :rows="6" type="textarea" placeholder="座右铭" />
          </el-form-item>
        </el-form>
        <div class="button">
          <el-button type="primary" @click="update()">更新信息</el-button>
          <el-button type="primary" @click="updatePassword()">修改密码</el-button>
        </div>
      </div>
      <div class="bodyRight">
        <div class="touX">
          <div>头像</div>
          <img class="image" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" alt="avatar" />
        
        <el-button icon="Upload" style="margin: 24px 40px;">上传文件</el-button>
      </div>
        <!-- <div class="up"> -->
          <!-- <el-icon><Upload /></el-icon>
          <span>上传文件</span> -->
        <!-- </div> -->
      </div>
    </div>
    <el-dialog v-model="dialogVisible" title="修改密码" width="40%">
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" status-icon class="demo-ruleForm">
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
            placeholder="请输入助记词"
            v-model="ruleForm.privateKey"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="changePWD">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <ProcessDesign ref="processDesignRef" />
</template>

<script lang="ts" setup>
  // @ts-nocheck
  import { ArrowLeft } from '@element-plus/icons-vue'
  // import { regionData, CodeToText } from 'element-china-area-data'
  import { onMounted, reactive, ref } from 'vue'
  import { onBeforeMount } from 'vue'
  import $services from '@/services'
  import console from 'console'
  import { useUserStore } from '@/store/user'
  
  import ProcessDesign from '@/components/wflow/ProcessDesign.vue';
  const processDesignRef = ref();

  const store = useUserStore()
  const labelPosition = ref<'top'>('top')
  
  const formModel = reactive({
    nickName: '',
    account: '',
    realName: '',
    phone: '',
    motto: ''
  })
  const dialogVisible = ref<boolean>(false)
  const ruleForm = reactive({
    password: '',
    password2: '',
    privateKey: ''
  })
  const validatePass1 = (rule: any, value: any, callback: any) => {
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
  const validatePass2 = (rule: any, value: any, callback: any) => {
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
  const validatePass3 = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('请输入助记词'))
    } else {
      callback()
    }
  }
  const rules = reactive({
    password: [{ validator: validatePass1, trigger: 'blur' }],
    password2: [{ validator: validatePass2, trigger: 'blur' }],
    privateKey: [{ validator: validatePass3, trigger: 'blur' }]
  })

  onBeforeMount(() => {
    fetchRequest()
  })

  function fetchRequest() {
    $services.person
      .queryInfo({
        data: {}
      })
      .then((res: ResultType) => {
        if (res.success) {
          formModel.nickName = res.data.name
          formModel.account = res.data.code
          formModel.realName = res.data.team.name
          formModel.phone = res.data.team.code
          formModel.motto = res.data.team.remark
        }
      })
  }
  const changePWD = () => {
    $services.person
      .reset({
        data: {
          account: store.userInfo.account,
          password: ruleForm.password,
          privateKey: ruleForm.privateKey
        }
      })
      .then((res: ResultType) => {
        if (res.code == 200) {
          ElMessage({
            message: '密码修改成功',
            type: 'success'
          })
          dialogVisible.value = false
        }
      })
  }



  function openProcessDesign(){
    processDesignRef.value.startDesign({});
  }

  const updatePassword = () => {
    dialogVisible.value = true
  }
  const update = () => {
    ElMessageBox.confirm('确定修改信息吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      $services.person
        .update({
          data: {
            id: store.queryInfo.id,
            name: formModel.nickName,
            code: formModel.account,
            thingId: store.queryInfo.thingId,
            teamName: formModel.realName,
            teamCode: formModel.phone,
            teamRemark: formModel.motto,
            teamAuthId: store.queryInfo.team.authId
          }
        })
        .then((res: ResultType) => {
          if (res.success) {
            ElMessage({
              message: '更新成功',
              type: 'success'
            })
          } else {
            ElMessage({
              message: res.msg,
              type: 'warning'
            })
          }
        })
    })
  }

  // const options = regionData
  // const selectedOptions: Array<number> = []
  // const handleChange = () => {
  //   var loc = ''
  //   for (let i = 0; i < selectedOptions.length; i++) {
  //     loc += CodeToText[selectedOptions[i]]
  //   }
  //   alert(loc)
  // }
</script>
<style lang="scss" scoped>
  .userMsg {
    flex: 1;
    height: 100%;
    background-color: var(--el-bg-color-page);
    // position: relative;
    .pageHeader {
      width: 100%;
      // height: 60px;
      background-color: var(--el-bg-color);
      padding-bottom: 30px;
      .title {
        padding-top: 30px;
        padding-left: 30px;
        // margin-left: 54px;
        font-size: 20px;
        font-weight: 600;
      }
    }
    .body {
      height: calc(100% - 76px);
      overflow-y: auto;
      width: 100%;
      // position: absolute;
      background-color: var(--el-bg-color);
      
      display: flex;
      box-sizing: border-box;
      padding-bottom: 20px;
      .bodyLeft {
        height: 100%;
        // width: 60%;
        flex: 2;
        .form1 {
          // width: 80%;
          padding-left: 30px;
          margin-top: 20px;
          font-weight: 600;
          .el-input {
            width: 300px;
          }
        }
        .form2 {
          // width: 80%;
          padding-left: 30px;
          font-weight: 600;
          .el-input {
            width: 400px;
          }
        }
        .button {
          margin-top: 30px;
          margin-left: 80px;
          padding-bottom: 20px;
        }
      }
      .bodyRight {
        height: 100%;
        flex:1;
        margin-left: 24px;
        // width: 40%;
        .touX {
          width: 220px;
          // display: flex;
          // flex-direction: column;
          margin-top: 30px;
          .image {
            width: 144px;
            height: 144px;
          }
        }
        .up {
          display: flex;
          align-items: center;
          width: 110px;
          height: 30px;
          padding-left: 12px;
          border: 1px solid #aaa;
          line-height: 30px;
          margin-left: 75px;
        }
      }
    }
  }
</style>