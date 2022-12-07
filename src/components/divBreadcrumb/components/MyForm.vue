<template>
  <div class="formWrap">
    <el-input v-model="searchData" class="serchInput" placeholder="搜索关键词" :prefix-icon="Search" />
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :inline="inline"
      :model="ruleForm"
      :label-width="labelWidth"
    >
      <template v-for="(item, index) in list" :key="index">
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
          <el-select
            v-if="item.type === 'select'"
            v-model="ruleForm[item.propName]"
            :clearable="item.clearable === undefined || item.clearable"
            :placeholder="item.placeholder || ''"
            class="ele-fluid"
          >
          </el-select>
          <el-date-picker
            v-if="item.type === 'date-picker'"
            v-model="ruleForm[item.propName]"
            :clearable="item.clearable === undefined || item.clearable"
            :type="item.pickerType"
            :placeholder="item.placeholder"
            :format="item.format"
            range-separator="至"
            start-placeholder="点击选择日期"
            end-placeholder="点击选择日期"
            :value-format="item.valueFormat"
            class="ele-fluid"
          />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
const emit = defineEmits(["submitForm"]);

type Props = {
  type?: string; // 表单项类型：1、默认是input-输入框 2、select-多选 3、date-picker-日期选择
  label?: string; // 标题
  propName?: string; // 绑定点的数据
  placeholder?: string; // 提示信息
  pickerType?: string; // 日期选择格式
  options?: any[]; // 多选的数据
  format?: string; // 设置格式
  valueFormat?: string; // 绑定值的格式
  required?: boolean; // 是否必填
  clearable?: boolean; // 是否可清除
}

const props = withDefaults(
  defineProps<{
    list?: Array<Props>; // 渲染表单项数据
    inline?: boolean;
    labelWidth?: string;
    rules?: Object;
  }>(),
  {
    list: () => [],
    inline: false,
    labelWidth: "80px",
    rules: () => ({})
  }
);

const ruleFormRef = ref()

// 搜索关键词
const searchData = ref()

const ruleForm: any = ref({});

// 筛选
const submitForm = () => {
  emit('submitForm', ruleForm.value)
};

// 重置
const resetForm = () => {
  ruleFormRef.value.resetFields()
};

defineExpose({ submitForm, resetForm })
</script>

<style lang="scss" scoped>
:deep .serchInput .el-input__wrapper {
  padding-left: 15px !important;
  box-sizing: border-box; 
  border: none !important; 
  box-shadow: none !important; 
  padding: 0px; //前边边距去掉 
  border-radius: 15px; 
  background: #f2f4f9;
  margin-bottom: 20px;
}

.ele-fluid {
  width: 100% !important;
}
::v-deep .el-form-item__content .el-input {
  width: 100% !important;
}
::v-deep .el-form-item__content .el-input .el-input__wrapper {
  width: 100% !important;
}
</style>
