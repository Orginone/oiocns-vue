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
            <el-input v-model="formModel.account" :disabled='true'/>
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
        </div>
      </div>
      <div class="bodyRight">
        <div class="touX">
          <span>头像</span>
          <img class="image" src="@/assets/img/toux.jpg" alt="" />
        </div>
        <div class="up">
          <el-icon><Upload /></el-icon>
          <span>上传文件</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  // import { regionData, CodeToText } from 'element-china-area-data'
  import { onMounted, reactive, ref } from 'vue'
  import { onBeforeMount } from 'vue'
  import $services from '@/services'
  import { useUserStore } from '@/store/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  const store = useUserStore()
  const labelPosition = ref<'top'>('top')

  const formModel = reactive({
    nickName: '',
    account: '',
    realName: '',
    phone: '',
    motto: ''
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
  const update = () => {
    ElMessageBox.confirm(
    '确定修改信息吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
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
    width: 100%;
    height: 100%;
    background-color: #eff0f4;
    position: relative;
    .pageHeader {
      width: 100%;
      height: 60px;
      background-color: #fff;
      .header {
        margin-top: 20px;
        margin-left: 30px;
      }
      .title {
        padding-top: 20px;
        margin-left: 30px;
        font-size: 20px;
        font-weight: 600;
      }
    }
    .body {
      height: calc(100% - 76px);
      overflow-y: auto;
      width: 100%;
      position: absolute;
      background-color: #fff;
      border-left: 16px solid #eff0f4;
      border-top: 16px solid #eff0f4;
      border-right: 16px solid #eff0f4;
      display: flex;
      box-sizing: border-box;
      padding-bottom: 20px;
      .bodyLeft {
        height: 100%;
        width: 60%;

        .form1 {
          width: 80%;
          margin-left: 80px;
          margin-top: 20px;
          font-weight: 600;
          .el-input {
            width: 300px;
          }
        }
        .form2 {
          width: 80%;
          margin-left: 80px;
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
        width: 40%;

        .touX {
          width: 220px;
          display: flex;
          margin-top: 50px;
          .image {
            width: 180px;
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
