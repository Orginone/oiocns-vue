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
import { ref, reactive, watch, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
const emit = defineEmits(["submitForm"]);

const props = withDefaults(
  defineProps<{
    list?: Array<any>; // 渲染表单项数据
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

const ruleForm: any = ref({
  // applyNumber: '',
  startTime: undefined
});

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
::v-deep .serchInput .el-input__wrapper {
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
