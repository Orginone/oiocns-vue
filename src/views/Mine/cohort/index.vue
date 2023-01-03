<template>
  <el-card class="container" shadow="never">
    <template #header>
      <div class="card-header">
        <span class="title">群组</span>
        <el-radio-group v-model="mode" size="small" class="button">
          <el-radio-button label="list"
            ><el-icon :size="18"><Tickets /></el-icon
          ></el-radio-button>
          <el-radio-button label="card"
            ><el-icon :size="18"><Menu /></el-icon
          ></el-radio-button>
        </el-radio-group>
      </div>
    </template>

    <div class="tab-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="管理的" name="管理的"> </el-tab-pane>
        <el-tab-pane label="加入的" name="加入的"> </el-tab-pane>
        <div v-if="mode === 'list'">
          <List :type="activeName" />
        </div>
        <div v-if="mode === 'card'">
          <Card :type="activeName" />
        </div>
      </el-tabs>
      <div class="button">
        <el-button small link :icon="CirclePlus" type="primary" @click="createCohortDialog = true"
          >创建</el-button
        >
        <el-button small link :icon="Plus" type="primary" @click="searchDialog = true"
          >加入</el-button
        >
      </div>
    </div>
  </el-card>

  <el-dialog v-model="createCohortDialog" title="创建群组" width="35%">
    <el-form
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    class="demo-ruleForm"
  >
    <el-form-item label="群组名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入群组名称" clearable />
    </el-form-item>
    <el-form-item label="群组编号" prop="code">
      <el-input v-model="formData.code" placeholder="请输入群组编号" clearable />
    </el-form-item>
    <el-form-item label="群组简介" prop="teamRemark">
      <el-input
        v-model="formData.teamRemark"
        placeholder="请输入群组简介"
        type="textarea"
        clearable
        :rows="4"
      />
    </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="createCohortDialog = false">取消</el-button>
        <el-button type="primary" @click="createCohort(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>

  <SearchCohort
    v-if="searchDialog"
    :serachType="2"
    @closeDialog="searchDialog = false"
    @checksSearch="checksSearch"
  />
</template>

<script lang="ts" setup>
  import { onMounted, ref,reactive } from 'vue'
  import List from './list.vue'
  import Card from './card.vue'
  import $services from '@/services'
  import { ElMessage, TabsPaneContext } from 'element-plus'
  import { Plus, CirclePlus } from '@element-plus/icons-vue'
  import SearchCohort from '@/components/searchs/index.vue'
  import type { FormInstance,FormRules } from 'element-plus'
  import CohortServices from '@/module/relation/cohort'
  const cohortServices  = new CohortServices()
  const mode = ref('list')
  const activeName = ref('管理的')
  const ruleFormRef = ref<FormInstance>()

  const createCohortDialog = ref(false)
  const formData = ref<any>({
    name:'',
    code:'',
    teamRemark:''
  })

  const searchDialog = ref<boolean>(false)

  const handleClick = (tab: TabsPaneContext, event: Event) => {}

  const rules = reactive<FormRules>({
    name: [
      { 
        required: true, 
        message: '请输入群组名称',
        trigger: 'blur' 
      },
    ],
    code: [
      {
        required: true,
        message: '请输入群组编号',
        trigger: 'blur',
      },
    ],
    teamRemark: [
      {
        required: true,
        message: '请输入群组简介',
        trigger: 'blur',
      },
    ],
   
  })
  // 创建群组
  const createCohort = async (formEl: FormInstance | undefined) => {
    formEl.validate(async (valid) => {
      if (valid) {
       const data = await cohortServices.create(formData.value)
       console.log('data',data)
       if(data){
          ElMessage({
            message: '创建成功',
            type: 'success'
          })
          createCohortDialog.value = false
          let oldModel = mode.value;
          mode.value = '';
          setTimeout(() => {
            mode.value = oldModel
          }, 100);
       }
       
      } else {
        return false
      }
    })
    
  }

  const checksSearch = (val: any) => {
    if (val.value.length > 0) {
      let arr: Array<any> = []
      val.value.forEach((element: any) => {
        arr.push(element.id)
      })
      applyJoinCohort(arr)
    } else {
      searchDialog.value = false
    }
  }
  // 申请加入群组
  const applyJoinCohort =  async (arr: Array<any>) => {
    const data = await cohortServices.applyJoin(arr)
    if (data) {
      ElMessage({
        message: '申请成功，请等待审核通过!',
        type: 'success'
      })
      searchDialog.value = false
    }
  }
  onMounted(() => {})
</script>
<style lang="scss" scoped>
  .container {
    // height: 100%;
    width: 100%;
    margin: 3px;
    border: 0;
  }

  .title {
    text-align: left;
    font-size: 16px;
    width: 30%;
    font-weight: bold;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tab-container {
    position: relative;
    .button {
      position: absolute;
      font-size: 14px;
      right: 10px;
      top: 4px;
    }
  }
</style>
