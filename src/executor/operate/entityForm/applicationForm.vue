  
<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { IApplication, IDirectory } from '@/ts/core';
// import UploadItem from '../../tools/uploadItem';
// import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';
import type { FormInstance, FormRules } from 'element-plus'
import { TargetModel } from '@/ts/base/model';

// 接收参数
const props = defineProps<{
  formType: string;
  current: IDirectory | IApplication;
  finished: () => void;
}>()

let title = ref('');
let types = ref(['应用']);
let directory: IDirectory;
let parentApp: IApplication;
let application: IApplication | undefined;
const readonly = props.formType === 'remarkApp';
let initialValue: any = props.current.metadata;
const isOpen = ref(true)
const typeName = ref('')
// 表单
const targetFormRef = ref<FormInstance>()
const ruleForm = reactive<TargetModel>({
  id:'',
  belongId: props.current.belongId,
  icon: '',
  name: '',
  public: true,
  typeName: '',
  code: '',
  teamName: '',
  teamCode: '',
  remark: '',
});

onMounted(()=>{
 switch (props.formType) {
    case 'newApp':
      title.value = '新建应用';
      directory = props.current as IDirectory;
      initialValue = {};
      break;
    case 'newModule':
      title.value = '新建模块';
      types.value = ['模块'];
      parentApp = props.current as IApplication;
      initialValue = {};
      break;
    case 'updateApp':
    case 'updateModule':
      application = props.current as IApplication;
      directory = application.directory;
      types.value = [application.typeName];
      title.value = '更新' + application.typeName;
      break;
    case 'remarkApp':
      application = props.current as IApplication;
      directory = application.directory;
      title.value = '查看' + application.typeName;
      break;
    default:
      return;
  }
})
</script>


<template>
  <ElDialog
  :title="title"
  v-model="isOpen"
  :width="640"
  @close="finished"
  top="100px"
>
  <ElRow class="row" :gutter="24"> 
    <ElCol :span="24" title="图标">
      <div class="col-content">
        <ElFormItem label="图标">
          <UploadItem
            :readonly="readonly"
            :typeName="typeName"
            :icon="initialValue.icon"
            :directory="props.current.directory"
            :onChanged="icon=>ruleForm.icon=icon"
          />
        </ElFormItem>
      </div>
    </ElCol>
    <ElCol :span="12" title="名称">
      <div class="col_content">
        <ElFormItem prop="name" required label="名称"> 
          <ElInput v-model="ruleForm.name" placeholder="请输入名称"/>
        </ElFormItem>
      </div>
    </ElCol>
    <ElCol :span="12" title="类型">
      <div class="col-content">
        <ElFormItem prop="typeName" required label="类型">
          <ElSelect v-model="ruleForm.typeName" >
            <ElOption v-for="item in types" :key="item" :label="item" :value="item" />
          </ElSelect>
        </ElFormItem>
      </div>
    </ElCol>
    <ElCol :span="12" title="代码">
      <div class="col-content">
        <ElFormItem prop="code" required label="代码">
          <ElInput v-model="ruleForm.code" placeholder="请输入代码"/>
        </ElFormItem>
      </div>
    </ElCol>
    <ElCol :span="24" title="资源">
      <div class="col-content">
        <ElFormItem prop="code" required label="资源">
          <ElInput v-model="ruleForm.code" placeholder="请输入资源"/>
        </ElFormItem>
      </div>
    </ElCol>
    <ElCol :span="24" title="备注信息">
      <div class="col-content">
        <ElFormItem prop="remark" required label="备注信息">
          <ElInput v-model="ruleForm.remark" type="textarea" :rows="3" placeholder="请输入备注信息"/>
        </ElFormItem>
      </div>
    </ElCol>
  </ElRow>
</ElDialog>
</template>

<style scoped>
.row {
  padding:24px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.col-content {
  margin-bottom: 24px;
  max-width: 100%;
  color: rgba(0,0,0,.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
}
.el-form-item {
  display: flex;
  flex-direction: column;
  &:deep(.el-form-item__label){
    justify-content: start;
    padding: 0 0 8px;
    line-height: 1.5715;
    white-space: initial;
    color: rgba(0,0,0,.45);
    font-size: 14px;
  }
  &:deep(.el-textarea__inner),&:deep(.el-input__wrapper) {
    background-color: #f2f4f9;
  }
}
.el-select {
  width: 100%;
}
</style>
