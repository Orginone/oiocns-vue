<template>
  <div class="UnitMsg">
    <div class="pageHeader">
      <div class="title">单位信息</div>
    </div>
    <div class="body">
      <el-form class="form1" :inline="true" :label-position="labelPosition" label-width="100px"
        style="max-width: 1400px" :model="formModel">
        <el-form-item label="单位名称">
          <el-input v-model="formModel.name" />
        </el-form-item>
        <el-form-item label="社会信用代码">
          <el-input v-model="formModel.code" />
        </el-form-item>
        <el-form-item label="单位简称">
          <el-input v-model="formModel.teamName" />
        </el-form-item>
        <el-form-item label="单位标识代码">
          <el-input v-model="formModel.teamCode" />
        </el-form-item>
      </el-form>
      <el-form class="form2" :inline="true" :label-position="labelPosition" label-width="100px"
        style="max-width: 1400px" :model="formModel">
        <el-form-item label="单位简介">
          <el-input v-model="formModel.teamRemark" :rows="6" type="textarea" placeholder="单位简介" />
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button type="primary" @click="upDateCompany()">更新信息</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { onBeforeMount } from 'vue'
import $services from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus'

const labelPosition = ref<'top'>('top')
const formModel = reactive({
  name: '',
  code: '',
  teamName: '',
  teamCode: '',
  teamRemark: '',
})
const companyInfo = ref<any>({})
onBeforeMount(() => {
  fetchRequest()
})
function fetchRequest() {
  let token = sessionStorage.getItem('WorkTOKEN')
  $services.company
    .queryInfo({
      data: {},
      headers: { Authorization: token }
    })
    .then((res: ResultType) => {
      if (res.success) {
        companyInfo.value = res.data
        formModel.name = res.data.name
        formModel.code = res.data.code
        formModel.teamName = res.data.team.name
        formModel.teamCode = res.data.team.code
        formModel.teamRemark = res.data.team.remark
      }
    })
}
type infoType = {
  name: string
  code: string,
  teamName: string,
  teamCode: string,
  teamRemark: string,
  id:string,
  thingId:string
}
const upDate = reactive<infoType>({
  name: '',
  code: '',
  teamName: '',
  teamCode: '',
  teamRemark: '',
  id:'',
  thingId:''
})
const upDateCompany = ()=>{
  ElMessageBox.confirm(
    '确定修改信息吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
      upDate.name =  formModel.name
      upDate.code =  formModel.code
      upDate.teamName =  formModel.teamName
      upDate.teamCode =  formModel.teamCode
      upDate.teamRemark =  formModel.teamRemark
      upDate.id = companyInfo.value.id;
      upDate.thingId = companyInfo.value.thingId;
      console.log(upDate)
      $services.company
        .update({
          data: upDate
        })
        .then((res: ResultType) => {
          if (res.success) {
            ElMessage({
              message: '更新成功',
              type: 'success'
            })
          }else{
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
.UnitMsg {
  height: calc(100%);
  background-color: #eff0f4;
  position: relative;

  .pageHeader {
    width: 100%;
    height:60px;
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
      height: calc(100% - 66px);
      width: 100%;
      overflow-y:auto;
      position: absolute;
      background-color: #fff;
      border-left: 6px solid #eff0f4;
      border-top: 6px solid #eff0f4;
      border-right: 6px solid #eff0f4;

      .form1 {
        width: 100%;
        padding-left: 80px;
        padding-top: 30px;
        font-weight: 600;

        .el-input {
          width: 400px;
        }

        .select {
          width: 400px;
        }
      }
      
      .form2 {
        width: 80%;
        margin-left: 80px;
        font-weight: 600;
        .el-input {
          width: 400px;
        }

        .el-form-item{
          width: 100%;
        }
      }

      .button {
        margin-top: 30px;
        margin-left: 80px;
        padding-bottom: 30px;
      }
    }
}
</style>
