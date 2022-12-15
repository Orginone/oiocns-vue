<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="30%"
    append-to-body
  >
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="ruleForm"
      label-width="80px"
      label-position="top"
    >
      <el-row :gutter="20">
        <template v-for="(item, index) in columns" :key="index">
          <el-col :span="item.span ?? 12">
            <el-form-item
              :label="item.label"
              :prop="item.propName"
              :required="item.required ?? false"
            >
              <el-input
                v-if="!item.type || item.type === 'input'"
                v-model.trim="ruleForm[item.propName]"
                :clearable="item.clearable === undefined || item.clearable"
                :placeholder="item.placeholder"
              />
              <el-input
                v-if="item.type === 'textarea'"
                v-model="ruleForm[item.propName]"
                type="textarea"
                :clearable="item.clearable === undefined || item.clearable"
                :autosize="{ minRows: 3 }"
                :placeholder="item.placeholder"
              />
              <el-select
                v-if="item.type === 'select'"
                v-model="ruleForm[item.propName]"
                :clearable="item.clearable === undefined || item.clearable"
                :placeholder="item.placeholder || ''"
                class="ele-fluid"
              >
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emit('update:visible', false)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">完成</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import type { FormInstance, FormRules } from 'element-plus'
import { ITarget } from '@/ts/core';

// interface Iprops {
//   title: string; // modal标题
//   visible: boolean; // 弹窗是否打开
//   handleCancel: () => void;
//   handleOk: (newItem: ITarget | undefined) => void;
//   current: ITarget; // 当前选中数据
//   typeNames: string[]; // 类型名称
// }
const props = withDefaults(
  defineProps<{
    visible: boolean; 
  }>(),
  {
    visible: false,
  }
)
const emit = defineEmits<{
  (e: 'update:visible', isShow: boolean): void
}>()
let dialogVisible = computed({
  get() {
    return props.visible ;
  },
  set(v) {
    emit("update:visible", v);
  }
});
const { visible, title, handleOk, current, handleCancel } = props;

type columnsProps = {
  type?: string; // 表单项类型：1、默认是input-输入框 2、select-多选
  label?: string; // 标题
  propName?: string; // 绑定点的数据
  placeholder?: string; // 提示信息
  options?: any[]; // 多选的数据
  required?: boolean; // 是否必填
  clearable?: boolean; // 是否可清除
  span?: number; // 占位份, 默认12
}
// 表单列配置
const columns: columnsProps[] = reactive([
    { label: '名称', propName: 'teamName', placeholder: '请输入', required: true },
    { type: 'select', label: '团队类型', propName: 'typeName', placeholder: '请选择', required: true, options: props.typeNames?.map((i) => {
      return {
        value: i,
        label: i
      }
    }) },
    { label: '团队代码', propName: 'code', placeholder: '请输入', required: true },
    { label: '团队简称', propName: 'name', placeholder: '请输入', required: true },
    { label: '团队标识', propName: 'teamCode', placeholder: '请输入', required: true },
    { type: 'textarea', label: '团队信息备注', propName: 'teamRemark', placeholder: '请输入', span: 24 }
  ]
)
// 表单验证
const rules = reactive<FormRules>({
  teamName: [{ required: true, message: '单位名称为必填项', trigger: 'blur' }],
  typeName: [{ required: true, message: '类型为必填项', trigger: 'change' }],
  code: [{ required: true, message: '团队代码为必填项', trigger: 'blur' }],
  name: [{ required: true, message: '团队简称为必填项', trigger: 'blur' }],
  teamCode: [{ required: true, message: '团队标识为必填项', trigger: 'blur' }]
})
// 表单实例
const ruleFormRef = ref<FormInstance>()
// 表单数据
const ruleForm: any = reactive({});
// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 重置
const resetForm = () => {
  ruleFormRef.value.resetFields()
};
/**
 * 数据回显
 * @param data
 */
function renderViewByData(data) {
  Object.assign(ruleForm, {
    ...data,
    teamName: data.team?.name,
    teamCode: data.team?.code,
    teamRemark: data.team?.remark,
  })
}
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      if (title === '编辑') renderViewByData(current.target);
    } else {
      // ruleFormRef.value.resetFields()
    }
  },
  {
    immediate: true
  }
);

</script>

<style lang="scss" scoped>

</style>