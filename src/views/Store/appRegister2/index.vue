<template>
  <div class="app-register-wrap">
    <div class="steps-box">
      <div class="steps-box-items" v-for="(item,index) in stepsArr" :key="index">
        <div class="circle" :style="active==index?'border-color:#154AD8;color:#154AD8':''">{{index+1}}</div>
        <span :style="active==index?'color:#154AD8':''">{{item.title}}</span>
        <div class="line" :style="active==index?'background:#154AD8':''" v-if="index<3"></div>
      </div>
    </div>
    <div class="app-base-info register-content">
      <div class="custom-title">
        <p><span class="custom-span"></span> {{title}}<el-icon color="#909399" :size="12" style="margin-left:4px"><QuestionFilled /></el-icon></p>
      </div>
      <el-form
        :model="state.form"
        ref="registerFormRef"
        :rules="rules"
        label-position="top"
        class="demo-form-inline"
      >
        <div class="inputs-box" v-if="active==0">
          <el-form-item label="应用名称" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="应用编号" prop="id">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="应用详情" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
        </div>
        <div class="inputs-box" v-if="active==1">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="资源地址" prop="id">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="资源代码" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
        </div>
        <div class="inputs-box" v-if="active==2">
          <el-form-item label="业务信息" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="字段名称" prop="id">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="字段编号" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="字段类型" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
        </div>
        <div class="inputs-box" v-if="active == 3">
          <el-form-item label="组件名称" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="链接地址" prop="id">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="组件宽度" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
          <el-form-item label="组件高度" prop="name">
            <el-input v-model="state.form.name" placeholder="请设置" />
          </el-form-item>
        </div>
      </el-form>
      <div class="btns-box">
        <el-button class="next-check" type="primary" @click="next">{{end?'保存':'下一步'}}</el-button>
        <el-button class="btn-check" type="primary" v-if="active>0" @click="prev" link>上一步</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive } from 'vue'
import { FormRules } from 'element-plus'

const active = ref(0)
const title = ref<string>('基础信息')
const end = ref<boolean>(false)
const stepsArr = reactive([{title:'基础信息'},{title:'资源信息'},{title:'流程信息'},{title:'应用组件'}])

//上一步
const prev = () => {
  if(end){
    end.value = false
  }
  active.value--
  title.value = stepsArr[active.value].title
}
//下一步
const next = () => {
  if(active.value++ == 2){
    end.value = true;
  }else{

  }
  title.value = stepsArr[active.value].title
}

type Resources = {
    name: string
    code: string
    link: string
    privateKey: string
    customId: number
    flows: Flows[]
    components: Components[]
}
type Field = {
    name: string
    code: string
    type: string
    customId: number
    dict: any[]
}
type Flows = {
    formId: string 
    business: string
    customId: number
    field: Field[]
  }
  type Components = {
    name: string
    url: string
    width: string
    height: string
    customId: number
  }
let state = reactive<{ [key: string]: any; resources: Resources[] }>({
  form: {
    id: '',
    code: '',
    name: '',
    remark: '',
    privateKey: ''
  },
  resources: [
    {
      name: '',
      link: '',
      code: '',
      privateKey: '',
      customId: 1,
      flows: [
        {
          formId: Math.round(Math.random() * 10000000000)+'',
          business: '',
          field: [
            {
              name: '',
              code: '',
              type: '',
              customId: 1,
              dict: []
            }
          ],
          customId: 1
        }
      ],
      components: [
        {
          name: '',
          url: '',
          width: '',
          height: '',
          customId: 1
        }
      ]
    }
  ]
})
// 注册表单Dom
const registerFormRef = ref<any>(null)
// 注册验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度限制2-20', trigger: 'blur' }
  ],
  code: [
    {
      required: true,
      message: '请输入应用编码',
      trigger: 'blur'
    }
  ]
})
</script>

<style lang="scss" scoped>
    .app-register-wrap {
      background: var(--el-bg-color-overlay);
      padding: 6px;
      border: 0;
      overflow-y: auto;
      height: calc(100vh - 110px);
      padding: 20px;
      margin-top: 3px;
      .steps-box {
        min-height: 120px;
        width: 720px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        .steps-box-items{
          display: flex;
          align-items: center;
          color: #909399;
          .circle{
            width: 26px; 
            height: 26px;
            border-radius: 50%;
            background: none; 
            border: 1px solid #909399;
            text-align: center;
            line-height: 26px;
            margin-right: 6px;
          }
          .line{
            width: 94px;
            height: 2px;
            margin: 0 8px;
            background: #909399;
          }
        }
      }
  
      .register-content {
        width: 700px;
        margin: 0 auto;
        :deep(.el-form-item__label){
          font-size: 12px;
          color: #909399;
        }
        :deep(.el-form-item){
          margin-bottom: 30px;
        }
        :deep(.el-input__wrapper),
        :deep(.el-textarea__inner) {
          width: 340px;
          height: 32px;
          font-size: 14px;
          background-color: var(--el-color-primary-light-9); //#F2F4F9;
          box-shadow: none;
          border: 0px solid var(--el-input-focus-border-color);
          margin-right: 10px;
          &:nth-child(2n){
            margin-right: 0;
          }
        }
        :deep(.el-textarea .el-input__count) {
          background-color: var(--el-color-primary-light-9); //#f3f5fa;
          box-shadow: none;
        }
      }

      // 自定义标题
      .custom-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 26px;
        font-size: 16px;
        margin-bottom: 30px;
  
        .custom-span {
          display: inline-block;
          width: 3px;
          height: 16px;
          margin-right: 6px;
          background-color: #3e5ed8;
          position: relative;
          top: 2px;
        }
      }

      //输入框
      .inputs-box{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }

      .btns-box{
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        margin-top: 60px;
        .btn-check {
          padding: 8px 16px;
          color: #154AD8;
        }
        .next-check{
          width: 144px;
          height: 38px;
          margin-left: 8px;
        }
      }
    }
</style>