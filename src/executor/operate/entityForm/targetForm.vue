<script lang="ts" setup>
// import SchemaForm from '@/components/SchemaForm';
import { TargetModel } from '@/ts/base/model'
import { ITarget, TargetType, companyTypes } from '@/ts/core'
import UploadItem from '../../tools/uploadItem.vue'
// import { EntityColumns } from './entityColumns'

import type { FormInstance, FormRules } from 'element-plus'
import { CURRENT_CHANGE } from 'element-plus/es/components/tree-v2/src/virtual-tree'

// 接收参数
const props = defineProps<{
  formType: string;
  current: ITarget;
  finished: () => void;
}>()
const isOpen = ref(true)

let title = ref('')
let typeName = ref('')
let tcodeLabel = ref('代码');
let types: string[] = [props.current.typeName];
const readonly = props.formType === 'remark';
let initialValue: any = props.current.metadata;
switch (props.formType) {
  case 'newCohort':
    typeName.value = '群组';
    title.value = '设立群组';
    types = [TargetType.Cohort];
    initialValue = {};
    break;
  case 'newStorage':
    typeName.value = '存储资源';
    title.value = '设立存储资源';
    types = [TargetType.Storage];
    initialValue = {};
    break;
  case 'newStation':
    typeName.value = '岗位';
    title.value = '设立岗位';
    types = [TargetType.Station];
    initialValue = {};
    break;
  case 'newGroup':
    typeName.value = '组织群';
    title.value = '设立集群';
    types = [TargetType.Group];
    initialValue = {};
    break;
  case 'newCompany':
    typeName.value = '单位';
    title.value = '设立单位';
    types = companyTypes;
    initialValue = {};
    break;
  case 'newDepartment':
    typeName.value = '部门';
    title.value = '设立部门';
    if ('departmentTypes' in props.current) {
      types = props.current.departmentTypes as string[];
    }
    if ('childrenTypes' in props.current) {
      types = props.current.childrenTypes as string[];
    }
    initialValue = {};
    break;
  case 'update':
    initialValue.teamCode = props.current.metadata.team?.code;
    initialValue.teamName = props.current.metadata.team?.name;
    typeName.value = props.current.typeName;
    title.value = '更新' + props.current.name;
    break;
  case 'remark':
    initialValue.teamCode = props.current.metadata.team?.code;
    initialValue.teamName = props.current.metadata.team?.name;
    typeName.value = props.current.typeName;
    title.value = '查看' + props.current.name;
    if (props.current.id === props.current.belongId) {
      if (typeName.value === '人员') {
        tcodeLabel.value = '手机号码';
      } else {
        tcodeLabel.value = '企业信用代码';
      }
    }
    break;
  default:
    break
}

// 表单
const targetFormRef = ref<FormInstance>()
const ruleForm = reactive<TargetModel>({
  id:'',
  belongId: props.current.belongId,
  icon: '',
  name: '',
  public: true,
  typeName: types[0],
  code: '',
  teamName: '',
  teamCode: '',
  remark: '',
});

//动态字段
const flexForm = reactive([]) 
if (readonly) {
  // TODO:
  // let res = EntityColumns(props.current.metadata)
  // flexForm.push(...res.value)
}
for (const key in ruleForm) {
  ruleForm[key] = initialValue[key];
};
const rules = reactive<FormRules>({
  name: [{ required: true, message: '分类名称为必填项' }],
  typeName: [{ required: true, message: '类型为必填项' }],
  code: [{ required: true, message: '分类代码为必填项' }],
  remark: [{ required: true, message: '简介为必填项' }],
})

const handleSubmit = async()=>{
  // 表单校验
  if(!targetFormRef) return
  const r = await targetFormRef.value.validate()
 if(!r) return
  switch (props.formType) {
    case 'update':
      const updateRes = await props.current.update(ruleForm as TargetModel)
      if(updateRes) {
        ElMessage.success('更新成功')
        props.finished()
      }
      break;
    default:
      if (props.formType.startsWith('new')) {
        const res = await props.current.createTarget(ruleForm as TargetModel)
        if(res) {
          ElMessage.success('创建成功')
          props.finished()
        }
      }
      break;
  }
}

</script>

<template>
  <ElDialog
  :title="title"
  v-model="isOpen"
  :width="640"
  @close="finished"
  top="100px"
>
  <ElForm
    ref="targetFormRef"
    :model="ruleForm"
    :rules="rules"
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
      <ElCol :span="12" :title="tcodeLabel">
        <div class="col-content">
          <ElFormItem prop="code" required :label="tcodeLabel">
            <ElInput v-model="ruleForm.code" placeholder="请输入代码"/>
          </ElFormItem>
        </div>
      </ElCol>
      <slot v-if="readonly">
        <ElCol :span="12" v-for="(item,index) in flexForm" :key="index" :title="item.title">
          <div class="col-content">
            <ElFormItem :props="item.dataIndex" required :label="item.title">
              <ElInput :readonly="item.readonly" v-if="!item.types" v-model="item.value" placeholder="请输入代码"/>
              <EntityIcon  v-else :entityId="item.value" showName />
            </ElFormItem>
          </div>
        </ElCol>
      </slot>
      <ElCol :span="24" title="简介">
        <div class="col-content">
          <ElFormItem prop="remark" required label="简介">
            <ElInput v-model="ruleForm.remark" type="textarea" :rows="3" placeholder="请输入简介"/>
          </ElFormItem>
        </div>
      </ElCol>
    </ElRow>
  </ElForm>
  <template #footer>
    <span class="dialog-footer">
      <el-button @click="isOpen = false;props.finished()">取消</el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>
    </span>
  </template>
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
