<template>
  <el-tabs v-model="activeName" class="demo-tabs">
    <el-tab-pane label="综合" name="first"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="联系人" name="second"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="群组" name="third"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="聊天记录" name="four"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="文档" name="five"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="日志" name="six"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="标签" name="six"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="功能" name="six"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="部门" name="six"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="公开群组" name="six"><div class="bank">暂无数据</div></el-tab-pane>
    <el-tab-pane label="应用" name="six"><div class="bank">暂无数据</div></el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
  import { Search } from '@element-plus/icons-vue'
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import $services from '@/services'
  import { ElMessage } from 'element-plus'

  let searchData = ref('')
  let activeName = ref('first')
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive({
    name: '',
    code: '',
    teamName: '',
    teamCode: '',
    teamRemark: ''
  })
  const rules = reactive<FormRules>({
    name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
    code: [
      {
        required: true,
        message: '请输入社会信用统一代码',
        trigger: 'blur'
      },
      {
        min: 18,
        max: 18,
        message: '长度为18位',
        trigger: 'blur'
      }
    ],
    teamName: [
      {
        required: true,
        message: '请输入团队简称',
        trigger: 'blur'
      }
    ],
    teamCode: [{ required: true, message: '请输入团队标识', trigger: 'blur' }],
    teamRemark: [{ required: true, message: '请输入团队备注', trigger: 'blur' }]
  })

  const props = defineProps({
    dialogShow: {
      type: Object
    },
    search: {
      type: String
    }
  })

  onMounted(() => {
    nextTick(() => {
      searchData.value = props.search
    })
  })

  const emit = defineEmits(['closeDialog', 'switchCreateCompany'])
  const submit = () => {
    $services.company
      .create({
        data: ruleForm
      })
      .then((res: ResultType) => {
        console.log('测试接口', res)
        if (res.code == 200) {
          ElMessage({
            message: '注册成功',
            type: 'success'
          })
          emit('switchCreateCompany', res.data)
        } else {
          ElMessage({
            message: res.msg,
            type: 'warning'
          })
        }
      })
  }
  const closeDialog = () => {
    emit('closeDialog', 'unit')
  }
</script>

<style lang="scss" scoped>
  .bank {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 500px;
    width: 100%;
  }
  :deep(.el-dialog__header) {
    margin-right: unset;
  }
  :deep(.el-tabs__item.is-active) {
    color: rgb(62, 94, 216) !important;
  }
  :deep(.el-tabs__active-bar) {
    background-color: rgb(62, 94, 216) !important;
  }
</style>
